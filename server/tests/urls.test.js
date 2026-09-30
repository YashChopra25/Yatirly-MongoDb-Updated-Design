import { describe, expect, it } from "vitest";
import URLmodel from "../models/urls.model.js";
import visitmodel from "../models/visit.models.js";
import { api, CHROME_WINDOWS_UA, signUpAndLogin } from "./helpers.js";

const CREATE = "/api/v1/urls/create";
const FETCH_URLS = "/api/v1/auth/user/fetch-urls";

describe("POST /urls/create", () => {
  it("creates an anonymous short link", async () => {
    const res = await api().post(CREATE).send({ longUrl: "https://example.com/some/long/path" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      longURL: "https://example.com/some/long/path",
      ShortURL: expect.stringMatching(/^[A-Za-z]{10}$/),
      isQR: false,
      visits: [],
    });
    expect(res.body.data.ownerId).toBeUndefined();
  });

  it("assigns the link to the logged-in user", async () => {
    const { cookie, user } = await signUpAndLogin();
    const res = await api().post(CREATE).set("Cookie", cookie).send({ longUrl: "https://example.com" });
    expect(res.body.data.ownerId).toBe(user.id);
  });

  it("stores the QR flag", async () => {
    const res = await api().post(CREATE).send({ longUrl: "https://example.com", isQR: true });
    expect(res.body.data.isQR).toBe(true);
  });

  it("accepts URLs without a protocol", async () => {
    const res = await api().post(CREATE).send({ longUrl: "example.com" });
    expect(res.body.success).toBe(true);
  });

  it("generates a unique short code per link", async () => {
    const a = await api().post(CREATE).send({ longUrl: "https://example.com" });
    const b = await api().post(CREATE).send({ longUrl: "https://example.com" });
    expect(a.body.data.ShortURL).not.toBe(b.body.data.ShortURL);
  });

  it.each([
    ["missing", {}],
    ["empty", { longUrl: "" }],
  ])("rejects a %s longUrl", async (_case, body) => {
    const res = await api().post(CREATE).send(body);
    expect(res.body).toEqual({ success: false, message: "All fields are required" });
    expect(await URLmodel.countDocuments()).toBe(0);
  });

  it.each(["not a url", "http://", "javascript:alert(1)"])("rejects invalid URL %j", async (longUrl) => {
    const res = await api().post(CREATE).send({ longUrl });
    expect(res.body).toEqual({ success: false, message: "Url is not valid" });
  });
});

describe("GET /urls/:shortUrl (redirect lookup)", () => {
  it("returns the destination URL", async () => {
    const created = await api().post(CREATE).send({ longUrl: "https://example.com/dest" });
    const res = await api().get(`/api/v1/urls/${created.body.data.ShortURL}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      redirectOn: "https://example.com/dest",
      message: "Url is redirected",
    });
  });

  it("records a visit with parsed user-agent details", async () => {
    const created = await api().post(CREATE).send({ longUrl: "https://example.com" });
    const code = created.body.data.ShortURL;
    await api().get(`/api/v1/urls/${code}`).set("User-Agent", CHROME_WINDOWS_UA);

    const url = await URLmodel.findOne({ ShortURL: code });
    expect(url.visits).toHaveLength(1);
    const visit = await visitmodel.findById(url.visits[0]);
    expect(visit).toMatchObject({
      browser: "Chrome",
      os: "Windows",
      userAgent: CHROME_WINDOWS_UA,
      urlId: url._id,
    });
    expect(visit.visitedAt).toBeInstanceOf(Date);
  });

  it("counts every visit", async () => {
    const created = await api().post(CREATE).send({ longUrl: "https://example.com" });
    const code = created.body.data.ShortURL;
    for (let i = 0; i < 3; i++) await api().get(`/api/v1/urls/${code}`);
    const url = await URLmodel.findOne({ ShortURL: code });
    expect(url.visits).toHaveLength(3);
  });

  it("reports an unknown short code", async () => {
    const res = await api().get("/api/v1/urls/doesNotExist");
    expect(res.body).toEqual({ success: false, message: "Url is not found" });
  });

  it("is case-sensitive", async () => {
    const created = await api().post(CREATE).send({ longUrl: "https://example.com" });
    const code = created.body.data.ShortURL;
    const flipped = [...code].map((c) => (c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase())).join("");
    const res = await api().get(`/api/v1/urls/${flipped}`);
    expect(res.body.success).toBe(false);
  });
});

describe("GET /auth/user/fetch-urls (link history)", () => {
  it("returns only the current user's links, newest first, with visit counts", async () => {
    const { cookie, user } = await signUpAndLogin();
    const first = await api().post(CREATE).set("Cookie", cookie).send({ longUrl: "https://one.com" });
    await api().post(CREATE).set("Cookie", cookie).send({ longUrl: "https://two.com", isQR: true });
    await api().post(CREATE).send({ longUrl: "https://anonymous.com" });
    await api().get(`/api/v1/urls/${first.body.data.ShortURL}`);
    await api().get(`/api/v1/urls/${first.body.data.ShortURL}`);

    const res = await api().get(FETCH_URLS).set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.map((u) => u.longURL)).toEqual(["https://two.com", "https://one.com"]);
    expect(res.body.data[0]).toMatchObject({ isQR: true, _count: { visits: 0 } });
    expect(res.body.data[1]).toMatchObject({ isQR: false, _count: { visits: 2 } });
    expect(res.body.data[1].owner).toMatchObject({ name: user.name, email: user.email });
    expect(res.body.data[1].owner).not.toHaveProperty("password");
  });

  it("returns an empty list for a user with no links", async () => {
    const { cookie } = await signUpAndLogin();
    const res = await api().get(FETCH_URLS).set("Cookie", cookie);
    expect(res.body.data).toEqual([]);
  });

  it("does not leak another user's links", async () => {
    const alice = await signUpAndLogin({ name: "alice", email: "alice@example.com", password: "pw" });
    const bob = await signUpAndLogin({ name: "bob", email: "bob@example.com", password: "pw" });
    await api().post(CREATE).set("Cookie", alice.cookie).send({ longUrl: "https://alice.com" });
    const res = await api().get(FETCH_URLS).set("Cookie", bob.cookie);
    expect(res.body.data).toEqual([]);
  });

  it("requires authentication", async () => {
    const res = await api().get(FETCH_URLS);
    expect(res.status).toBe(401);
  });
});
