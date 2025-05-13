const envNetwork = import.meta.env.PUBLIC_STELLAR_NETWORK;
export const stellarNetwork =
  envNetwork && typeof envNetwork === "string"
    ? envNetwork : "local";

const envRPC = import.meta.env.PUBLIC_STELLAR_RPC_URL;
export const rpcUrl =
  envRPC && typeof envRPC === "string"
    ? envRPC : "http://localhost:8000/rpc";

const envPassphrase = import.meta.env.PUBLIC_STELLAR_NETWORK_PASSPHRASE;
export const networkPassphrase =
  envPassphrase && typeof envPassphrase === "string"
    ? envPassphrase : "Standalone Network ; February 2017";
