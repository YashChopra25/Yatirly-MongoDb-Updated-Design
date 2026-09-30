import request from "supertest";
import app from "../app.js";

export const api = () => request(app);

export const defaultUser = {
  name: "Jane Doe",
  email: "jane@example.com",
  password: "s3cret-pass",
};

/** Creates a user and logs in, returning the auth cookie and the user payload. */
export const signUpAndLogin = async (user = defaultUser) => {
  await api().post("/api/v1/auth/user/create").send(user);
  const res = await api()
    .post("/api/v1/auth/user/login")
    .send({ email: user.email, password: user.password });
  const cookie = res.headers["set-cookie"];
  const token = cookie[0].split(";")[0].split("=")[1];
  return { cookie, token, user: res.body.data };
};

export const CHROME_WINDOWS_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
export const SAFARI_IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
