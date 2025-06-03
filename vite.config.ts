import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    base: '/scaffold-stellar-frontend/',
    plugins: [react()],
    define: {
      global: "window",
    },
    envPrefix: "PUBLIC_",
    server: {
      proxy: {
        "/friendbot": {
          target: "http://localhost:8000/friendbot",
          changeOrigin: true,
        },
      },
    },
  };
});
