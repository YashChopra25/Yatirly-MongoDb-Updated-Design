import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.js"],
    setupFiles: ["./tests/setup.js"],
    // All suites share one in-memory MongoDB, so run files sequentially.
    fileParallelism: false,
    hookTimeout: 60000,
  },
});
