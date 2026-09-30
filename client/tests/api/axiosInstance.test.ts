import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { InternalAxiosRequestConfig } from "axios";
import axiosInstance from "@/api/axiosInstance";

let sent: InternalAxiosRequestConfig | undefined;
const originalAdapter = axiosInstance.defaults.adapter;

beforeEach(() => {
  sent = undefined;
  // Capture the final request config instead of hitting the network.
  axiosInstance.defaults.adapter = async (config) => {
    sent = config;
    return { data: { ok: true }, status: 200, statusText: "OK", headers: {}, config };
  };
});

afterEach(() => {
  axiosInstance.defaults.adapter = originalAdapter;
});

describe("axiosInstance", () => {
  it("targets the configured backend and sends cookies", async () => {
    await axiosInstance.get("/api/v1");
    expect(sent?.baseURL).toBe("http://api.test");
    expect(sent?.withCredentials).toBe(true);
    expect(sent?.headers["Content-Type"]).toBe("application/json");
  });

  it("adds a Bearer token from localStorage", async () => {
    localStorage.setItem("token", "tok-123");
    await axiosInstance.get("/api/v1");
    expect(sent?.headers.Authorization).toBe("Bearer tok-123");
  });

  it("sends no Authorization header without a stored token", async () => {
    await axiosInstance.get("/api/v1");
    expect(sent?.headers.Authorization).toBeUndefined();
  });

  it("rejects on HTTP errors", async () => {
    axiosInstance.defaults.adapter = async (config) => {
      const error = Object.assign(new Error("Request failed"), {
        isAxiosError: true,
        config,
        response: { status: 401, data: { message: "Unauthorized" } },
      });
      throw error;
    };
    await expect(axiosInstance.get("/x")).rejects.toMatchObject({
      response: { data: { message: "Unauthorized" } },
    });
  });
});
