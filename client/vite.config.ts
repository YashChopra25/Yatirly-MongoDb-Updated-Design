/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({

  server: {
    host: '0.0.0.0',  // Bind the server to all network interfaces
  },
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    env: {
      VITE_BACKEND_URL: 'http://api.test',
      VITE_FRONTEND_URL: 'http://yatirly.test',
    },
  },
})
