import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/friendbot': {
        target: 'https://friendbot.stellar.org/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/friendbot/, ''),
      },
    }
  }
});
