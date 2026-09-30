import { describe, expect, it } from "vitest";
import { decodeToken, generateToken, RandomString } from "../utils/general.js";

describe("generateToken / decodeToken", () => {
  it("round-trips the user's id, name and email", () => {
    const token = generateToken({ id: "abc123", name: "jane", email: "jane@example.com" });
    const decoded = decodeToken(token);
    expect(decoded).toMatchObject({ id: "abc123", name: "jane", email: "jane@example.com" });
  });

  it("issues tokens that expire in 30 days", () => {
    const { iat, exp } = decodeToken(generateToken({ id: "x" }));
    expect(exp - iat).toBe(30 * 24 * 60 * 60);
  });

  it("rejects tampered tokens", () => {
    const token = generateToken({ id: "x" });
    expect(() => decodeToken(token.slice(0, -2) + "zz")).toThrow();
  });

  it("rejects tokens signed with a different secret", () => {
    const token = generateToken({ id: "x" });
    const original = process.env.JWT_SECRET;
    process.env.JWT_SECRET = "other-secret";
    try {
      expect(() => decodeToken(token)).toThrow();
    } finally {
      process.env.JWT_SECRET = original;
    }
  });
});

describe("RandomString", () => {
  it("defaults to 10 characters", () => {
    expect(RandomString()).toHaveLength(10);
  });

  it("honours a custom length", () => {
    expect(RandomString(4)).toHaveLength(4);
    expect(RandomString(0)).toBe("");
  });

  it("only uses ASCII letters", () => {
    expect(RandomString(200)).toMatch(/^[A-Za-z]+$/);
  });

  it("produces different values across calls", () => {
    const values = new Set(Array.from({ length: 50 }, () => RandomString()));
    expect(values.size).toBe(50);
  });
});
