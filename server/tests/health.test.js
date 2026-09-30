import { describe, expect, it } from "vitest";
import { api } from "./helpers.js";

describe("GET /api/v1", () => {
  it("reports that the API is running", async () => {
    const res = await api().get("/api/v1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, message: "API is running" });
  });
});
