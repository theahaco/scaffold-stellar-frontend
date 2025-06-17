import { z } from "zod";
import { WalletNetwork } from "@creit.tech/stellar-wallets-kit";

const envSchema = z.object({
  PUBLIC_STELLAR_NETWORK: z.enum([
    "PUBLIC",
    "FUTURENET",
    "TESTNET",
    "LOCAL",
    "STANDALONE", // deprecated in favor of LOCAL
  ] as const),
  PUBLIC_STELLAR_NETWORK_PASSPHRASE: z.nativeEnum(WalletNetwork),
  PUBLIC_STELLAR_RPC_URL: z.string(),
});

const parsed = envSchema.safeParse(import.meta.env);

const env: z.infer<typeof envSchema> = parsed.success
  ? parsed.data
  : {
      PUBLIC_STELLAR_NETWORK: "LOCAL",
      PUBLIC_STELLAR_NETWORK_PASSPHRASE: WalletNetwork.STANDALONE,
      PUBLIC_STELLAR_RPC_URL: "http://localhost:8000/rpc",
    };

export const stellarNetwork =
  env.PUBLIC_STELLAR_NETWORK === "STANDALONE"
    ? "LOCAL"
    : env.PUBLIC_STELLAR_NETWORK;
export const networkPassphrase = env.PUBLIC_STELLAR_NETWORK_PASSPHRASE;

// NOTE: needs to be exported for contract files in this directory
export const rpcUrl = env.PUBLIC_STELLAR_RPC_URL;
