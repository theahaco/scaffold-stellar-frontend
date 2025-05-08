import { use } from "react";
import { WalletContext } from "../providers/WalletProviders";


export const useWallet = () => {
  const ctx = use(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return ctx;
};
