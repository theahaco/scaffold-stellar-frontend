import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function getFriendbotUrl(mode: string) {
  // See https://developers.stellar.org/docs/tools/quickstart/faucet for more information
  // on friendbot and the local faucet
  const env = loadEnv(mode, process.cwd(), '')
  switch (env.PUBLIC_STELLAR_NETWORK) {
    case "local":
      return "http://localhost:8000";
    case "testnet":
    case "futurenet":
      return "https://friendbot.stellar.org";
    case "mainnet":
      // friendbot is not available on mainnet, this is a fallback that should not need to be called
      return "https://friendbot.stellar.org";
    default:
      throw new Error(`Unknown PUBLIC_STELLAR_NETWORK: ${env.PUBLIC_STELLAR_NETWORK}`);
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    envPrefix: "PUBLIC_",
    server: {
      proxy: {
        '/friendbot': {
          target: getFriendbotUrl(mode),
          changeOrigin: true,
        },
      }
    }
  }
});
