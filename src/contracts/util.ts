export const rpcUrl =
  import.meta.env.PUBLIC_SOROBAN_RPC_URL as string ?? "http://localhost:8000/rpc";
export const networkPassphrase =
  import.meta.env.PUBLIC_SOROBAN_NETWORK_PASSPHRASE as string ??
  "Standalone Network ; February 2017";
