const envRPC = import.meta.env.PUBLIC_SOROBAN_RPC_URL;
export const rpcUrl =
  envRPC && typeof envRPC === "string"
    ? envRPC : "http://localhost:8000/rpc";

const envNetworkPassphrase = import.meta.env.PUBLIC_NETWORK_PASSPHRASE;
export const networkPassphrase =
  envNetworkPassphrase && envNetworkPassphrase === "string"
    ? envRPC : "Standalone Network ; February 2017";
