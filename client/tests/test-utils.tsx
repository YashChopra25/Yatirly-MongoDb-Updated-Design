/* eslint-disable react-refresh/only-export-components -- test helpers, not a hot-reloaded module */
import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes, useLocation, type InitialEntry } from "react-router-dom";
import { render } from "@testing-library/react";
import authReducer, { type User } from "@/slices/auth.slice";
import { ThemeProvider } from "@/context/ThemeContext";

export const testUser: User = { id: "u1", name: "jane doe", email: "jane@example.com" };

export const makeStore = (user: User | null = null) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user, token: null, isLoading: false } },
  });

/** Renders the current URL so tests can assert on navigation. */
export const LocationProbe = () => {
  const location = useLocation();
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
};

interface Options {
  route?: InitialEntry;
  path?: string;
  user?: User | null;
  store?: ReturnType<typeof makeStore>;
}

/**
 * Renders `ui` at `path` inside the app's providers. Any other route renders a
 * LocationProbe, so a redirect shows up as the probe's text.
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  { route = "/", path = "/", user = null, store = makeStore(user) }: Options = {}
) => {
  const result = render(
    <Provider store={store}>
      <ThemeProvider>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path={path} element={ui} />
            <Route path="*" element={<LocationProbe />} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
  return { ...result, store };
};
