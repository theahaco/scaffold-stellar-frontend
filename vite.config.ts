import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/friendbot': {
        // Use the local faucet http://localhost:8000/friendbot
        // See https://developers.stellar.org/docs/tools/quickstart/faucet for more information
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    }
  }
});
