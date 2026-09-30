import { describe, expect, it } from "vitest";
import bcrypt from "bcrypt";
import userModel from "../models/user.models.js";
import { generateToken } from "../utils/general.js";
import { api, defaultUser, signUpAndLogin } from "./helpers.js";

const SIGNUP = "/api/v1/auth/user/create";
const LOGIN = "/api/v1/auth/user/login";
const VERIFY = "/api/v1/auth/user/verify";
const LOGOUT = "/api/v1/auth/user/logout";
const UPDATE = "/api/v1/auth/user/update";

describe("POST /auth/user/create (sign up)", () => {
  it("creates a user and returns public fields only", async () => {
    const res = await api().post(SIGNUP).send(defaultUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({
      name: "jane doe",
      email: "jane@example.com",
      id: expect.any(String),
    });
    expect(res.body.data).not.toHaveProperty("password");
  });

  it("hashes the password before saving", async () => {
    await api().post(SIGNUP).send(defaultUser);
    const stored = await userModel.findOne({ email: defaultUser.email });
    expect(stored.password).not.toBe(defaultUser.password);
    expect(await bcrypt.compare(defaultUser.password, stored.password)).toBe(true);
  });

  it("stores name and email in lowercase", async () => {
    const res = await api()
      .post(SIGNUP)
      .send({ name: "  JANE Doe ", email: "Jane@Example.COM", password: "pw" });
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ name: "jane doe", email: "jane@example.com" });
  });

  it.each([
    ["name", { ...defaultUser, name: "" }],
    ["email", { ...defaultUser, email: "" }],
    ["password", { ...defaultUser, password: "" }],
  ])("rejects an empty %s with 400", async (_field, body) => {
    const res = await api().post(SIGNUP).send(body);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  it("rejects an invalid email", async () => {
    const res = await api().post(SIGNUP).send({ ...defaultUser, email: "not-an-email" });
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ success: false, message: "Email is not valid" });
  });

  it("does not create a second account with the same email", async () => {
    await api().post(SIGNUP).send(defaultUser);
    const res = await api().post(SIGNUP).send(defaultUser);
    expect(res.body.success).toBe(false);
    expect(await userModel.countDocuments({ email: defaultUser.email })).toBe(1);
  });

  // Known bug: the controller checks Prisma's P2002 code, but MongoDB reports
  // duplicates as code 11000, so this currently returns 500. Remove `.fails` once fixed.
  it.fails("returns 409 'Email already exists' for a duplicate email", async () => {
    await api().post(SIGNUP).send(defaultUser);
    const res = await api().post(SIGNUP).send(defaultUser);
    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Email already exists");
  });

  // Known bug: validator.isEmpty() throws on undefined, so a missing field is a 500.
  it.fails("returns 400 when a field is missing from the body", async () => {
    const res = await api().post(SIGNUP).send({ email: "a@b.com", password: "pw" });
    expect(res.status).toBe(400);
  });
});

describe("POST /auth/user/login", () => {
  it("logs in with correct credentials and sets a token cookie", async () => {
    await api().post(SIGNUP).send(defaultUser);
    const res = await api()
      .post(LOGIN)
      .send({ email: defaultUser.email, password: defaultUser.password });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      data: { name: "jane doe", email: "jane@example.com" },
    });
    const cookie = res.headers["set-cookie"]?.[0];
    expect(cookie).toMatch(/^token=[^;]+/);
    expect(cookie).toMatch(/Expires=/);
  });

  it("returns 401 for a wrong password", async () => {
    await api().post(SIGNUP).send(defaultUser);
    const res = await api().post(LOGIN).send({ email: defaultUser.email, password: "wrong" });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Please enter correct credentials");
    expect(res.headers["set-cookie"]).toBeUndefined();
  });

  it("returns 404 for an unknown email with the same generic message", async () => {
    const res = await api().post(LOGIN).send({ email: "ghost@example.com", password: "pw" });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Please enter correct credentials");
  });

  it("returns 400 when email or password is empty", async () => {
    const res = await api().post(LOGIN).send({ email: "", password: "" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  it("rejects an invalid email format", async () => {
    const res = await api().post(LOGIN).send({ email: "nope", password: "pw" });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Email is not valid");
  });
});

describe("GET /auth/user/verify (auth middleware)", () => {
  it("returns the current user when the token cookie is present", async () => {
    const { cookie } = await signUpAndLogin();
    const res = await api().get(VERIFY).set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      message: "User is verified",
      data: { name: "jane doe", email: "jane@example.com" },
    });
  });

  it("accepts a Bearer token in the Authorization header", async () => {
    const { token } = await signUpAndLogin();
    const res = await api().get(VERIFY).set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("returns 401 without a token", async () => {
    const res = await api().get(VERIFY);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ success: false, message: "Unauthorized" });
  });

  it("returns 401 and clears the cookie for an invalid token", async () => {
    const res = await api().get(VERIFY).set("Cookie", "token=garbage");
    expect(res.status).toBe(401);
    expect(res.headers["set-cookie"]?.[0]).toMatch(/^token=;/);
  });

  it("returns 401 when the token's user no longer exists", async () => {
    const token = generateToken({ id: "64b000000000000000000000" });
    const res = await api().get(VERIFY).set("Cookie", `token=${token}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });
});

describe("GET /auth/user/logout", () => {
  it("clears the token cookie", async () => {
    const res = await api().get(LOGOUT);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, message: "User is logged out" });
    expect(res.headers["set-cookie"]?.[0]).toMatch(/^token=;/);
  });
});

describe("PUT /auth/user/update", () => {
  it("updates the name from first_name and last_name", async () => {
    const { cookie } = await signUpAndLogin();
    const res = await api()
      .put(UPDATE)
      .set("Cookie", cookie)
      .send({ first_name: " John ", last_name: "SMITH " });
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ name: "john smith", email: "jane@example.com" });
  });

  it("ignores attempts to change the email", async () => {
    const { cookie } = await signUpAndLogin();
    const res = await api()
      .put(UPDATE)
      .set("Cookie", cookie)
      .send({ first_name: "a", last_name: "b", email: "hacker@example.com" });
    expect(res.body.data.email).toBe("jane@example.com");
  });

  it("leaves the user unchanged when no names are sent", async () => {
    const { cookie } = await signUpAndLogin();
    const res = await api().put(UPDATE).set("Cookie", cookie).send({});
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("jane doe");
  });

  it("requires authentication", async () => {
    const res = await api().put(UPDATE).send({ first_name: "a", last_name: "b" });
    expect(res.status).toBe(401);
  });

  // Known bug: `first_name.trim() + last_name.trim()` throws when one is missing.
  it.fails("updates the name when only first_name is sent", async () => {
    const { cookie } = await signUpAndLogin();
    const res = await api().put(UPDATE).set("Cookie", cookie).send({ first_name: "Solo" });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("solo");
  });
});
