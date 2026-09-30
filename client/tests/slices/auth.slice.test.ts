import { beforeEach, describe, expect, it, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";
import authReducer, { login, logoutFn, verifyUser } from "@/slices/auth.slice";

vi.mock("@/api/axiosInstance", () => ({ default: { get: vi.fn() } }));

const user = { id: "u1", name: "jane doe", email: "jane@example.com" };
const makeStore = () => configureStore({ reducer: { auth: authReducer } });

describe("auth slice reducers", () => {
  it("starts logged out", () => {
    expect(makeStore().getState().auth).toEqual({ user: null, token: null, isLoading: false });
  });

  it("login stores the user", () => {
    const store = makeStore();
    store.dispatch(login({ data: user }));
    expect(store.getState().auth.user).toEqual(user);
  });

  it("logoutFn clears the session", () => {
    const store = makeStore();
    store.dispatch(login({ data: user }));
    store.dispatch(logoutFn());
    expect(store.getState().auth).toEqual({ user: null, token: null, isLoading: false });
  });
});

describe("verifyUser thunk", () => {
  beforeEach(() => {
    vi.mocked(axiosInstance.get).mockReset();
  });

  it("calls the verify endpoint", async () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: { data: user } });
    await makeStore().dispatch(verifyUser());
    expect(axiosInstance.get).toHaveBeenCalledWith("/api/v1/auth/user/verify");
  });

  it("is loading while the request is in flight", () => {
    vi.mocked(axiosInstance.get).mockReturnValue(new Promise(() => {}));
    const store = makeStore();
    store.dispatch(verifyUser());
    expect(store.getState().auth.isLoading).toBe(true);
  });

  it("stores the user and the cookie token on success", async () => {
    document.cookie = "token=abc123";
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: { data: user } });
    const store = makeStore();
    await store.dispatch(verifyUser());
    expect(store.getState().auth).toEqual({ user, token: "abc123", isLoading: false });
  });

  it("stops loading and keeps the user empty on failure", async () => {
    vi.mocked(axiosInstance.get).mockRejectedValue(new Error("401"));
    const store = makeStore();
    await store.dispatch(verifyUser());
    expect(store.getState().auth).toMatchObject({ user: null, isLoading: false });
  });
});
