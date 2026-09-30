import { describe, expect, it } from "vitest";
import URLmodel from "../models/urls.model.js";
import visitmodel from "../models/visit.models.js";
import { api, CHROME_WINDOWS_UA, SAFARI_IPHONE_UA, signUpAndLogin } from "./helpers.js";

const ANALYTICS = "/api/v1/analytics/fetch";

const createLink = async (cookie, longUrl = "https://example.com") => {
  const res = await api().post("/api/v1/urls/create").set("Cookie", cookie).send({ longUrl });
  return res.body.data.ShortURL;
};

const visit = (code, ua) => api().get(`/api/v1/urls/${code}`).set("User-Agent", ua);

describe("GET /analytics/fetch", () => {
  it("requires authentication", async () => {
    const res = await api().get(ANALYTICS);
    expect(res.status).toBe(401);
  });

  it("returns zeroed stats for a user with no visits", async () => {
    const { cookie } = await signUpAndLogin();
    const res = await api().get(ANALYTICS).set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true, totalVisits: 0, browser: [], devices: [], os: [] });
    expect(res.body.monthAnalytics).toHaveLength(12);
    expect(res.body.monthAnalytics.every((m) => m.views === 0)).toBe(true);
  });

  it("aggregates visits across all of the user's links", async () => {
    const { cookie } = await signUpAndLogin();
    const a = await createLink(cookie);
    const b = await createLink(cookie);
    await visit(a, CHROME_WINDOWS_UA);
    await visit(a, CHROME_WINDOWS_UA);
    await visit(b, CHROME_WINDOWS_UA);
    await visit(b, SAFARI_IPHONE_UA);

    const res = await api().get(ANALYTICS).set("Cookie", cookie);
    expect(res.body.totalVisits).toBe(4);
    expect(res.body.browser).toEqual(
      expect.arrayContaining([
        { name: "Chrome", views: "75.00%" },
        { name: "Mobile Safari", views: "25.00%" },
      ])
    );
    expect(res.body.os).toEqual(
      expect.arrayContaining([
        { name: "Windows", views: "75.00%" },
        { name: "iOS", views: "25.00%" },
      ])
    );
    expect(res.body.devices).toEqual([{ name: "iPhone", views: "25.00%" }]);
  });

  it("buckets this year's visits by month", async () => {
    const { cookie } = await signUpAndLogin();
    await visit(await createLink(cookie), CHROME_WINDOWS_UA);

    const res = await api().get(ANALYTICS).set("Cookie", cookie);
    const monthIndex = new Date().getMonth();
    expect(res.body.monthAnalytics[monthIndex].views).toBe(1);
    expect(res.body.monthAnalytics.reduce((sum, m) => sum + m.views, 0)).toBe(1);
  });

  it("counts old visits in the total but not in the monthly chart", async () => {
    const { cookie } = await signUpAndLogin();
    const code = await createLink(cookie);
    const url = await URLmodel.findOne({ ShortURL: code });
    const old = await visitmodel.create({ urlId: url._id, browser: "Firefox", visitedAt: new Date("2020-03-15") });
    url.visits.push(old);
    await url.save();

    const res = await api().get(ANALYTICS).set("Cookie", cookie);
    expect(res.body.totalVisits).toBe(1);
    expect(res.body.monthAnalytics.every((m) => m.views === 0)).toBe(true);
    expect(res.body.browser).toEqual([{ name: "Firefox", views: "100.00%" }]);
  });

  it("excludes other users' visits", async () => {
    const alice = await signUpAndLogin({ name: "alice", email: "alice@example.com", password: "pw" });
    const bob = await signUpAndLogin({ name: "bob", email: "bob@example.com", password: "pw" });
    await visit(await createLink(alice.cookie), CHROME_WINDOWS_UA);

    const res = await api().get(ANALYTICS).set("Cookie", bob.cookie);
    expect(res.body.totalVisits).toBe(0);
  });
});
