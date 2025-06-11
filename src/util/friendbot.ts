import { stellarNetwork } from "../contracts/util";

// Utility to get the correct Friendbot URL based on environment
export function getFriendbotUrl(address: string) {
  if (stellarNetwork === "local") {
    // Use proxy in development for local
    return `/friendbot?addr=${address}`;
  }
  switch (stellarNetwork) {
    case "futurenet":
      return `https://friendbot-futurenet.stellar.org/?addr=${address}`;
    case "testnet":
      return `https://friendbot.stellar.org/?addr=${address}`;
    default:
      throw new Error(
        `Unknown or unsupported PUBLIC_STELLAR_NETWORK for friendbot: ${stellarNetwork}`,
      );
  }
}
