import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({

  server: {
    host: '0.0.0.0',  // Bind the server to all network interfaces
  },
  plugins: [react(), tsconfigPaths()],
})

