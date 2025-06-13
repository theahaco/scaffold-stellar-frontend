import storage from "./storage";
import {
  ISupportedWallet,
  StellarWalletsKit,
  sep43Modules,
  WalletNetwork,
} from "@creit.tech/stellar-wallets-kit";
import { Horizon } from "@stellar/stellar-sdk";
import { networkPassphrase, stellarNetwork } from "../contracts/util";

const kit: StellarWalletsKit = new StellarWalletsKit({
  network: networkPassphrase as WalletNetwork,
  modules: sep43Modules(),
});

export const connectWallet = async () => {
  await kit.openModal({
    modalTitle: "Connect to your wallet",
    onWalletSelected: (option: ISupportedWallet) => {
      const selectedId = option.id;
      kit.setWallet(selectedId);

      // Now open selected wallet's login flow by calling `getAddress` --
      // Yes, it's strange that a getter has a side effect of opening a modal
      void kit.getAddress().then(() => {
        // Once `getAddress` returns successfully, we know they actually
        // connected the selected wallet, and we set our localStorage
        storage.setItem("walletId", selectedId);
      });
    },
  });
};

export const disconnectWallet = async () => {
  await kit.disconnect();
  storage.removeItem("walletId");
};

function getHorizonHost(mode: string) {
  switch (mode) {
    case "local":
      return "http://localhost:8000";
    case "futurenet":
      return "https://horizon-futurenet.stellar.org";
    case "testnet":
      return "https://horizon-testnet.stellar.org";
    case "mainnet":
      return "https://horizon.stellar.org";
    default:
      throw new Error(`Unknown Stellar network: ${mode}`);
  }
}

export const fetchBalance = async (address: string) => {
  const horizon = new Horizon.Server(getHorizonHost(stellarNetwork), {
    allowHttp: stellarNetwork === "local",
  });

  const { balances } = await horizon.accounts().accountId(address).call();
  return balances;
};

export const wallet = kit;
