import storage from "./storage";
import {
  ISupportedWallet,
  StellarWalletsKit,
  FREIGHTER_ID,

  // StellarWalletsKit makes us import and then initialize all of these
  // classes, rather than just specify some strings
  FreighterModule,
  WalletNetwork,
} from "@creit.tech/stellar-wallets-kit";
import { Horizon, rpc } from "@stellar/stellar-sdk";
import { networkPassphrase, rpcUrl } from "../contracts/util";

const kit: StellarWalletsKit = new StellarWalletsKit({
  network: networkPassphrase as WalletNetwork,
  modules: [
    // new AlbedoModule(), omitted bc does not support `getNetwork`
    new FreighterModule(),
    // new RabetModule(), omitted bc it is not detected even if you have it
    // new xBullModule(), omitted bc does not support `getNetwork`
    // new HanaModule(), omitted bc does not support `getNetwork`
    // new LobstrModule(), omitted bc does not support `getNetwork`
    // new HotWalletModule(), omitted bc it keeps opening popups
  ],
  selectedWalletId: storage.getItem("walletId") || FREIGHTER_ID, // should be able to keep it unset!!!
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

export const fetchBalance = async (address: string, testnet = false) => {
  const horizonUrl = testnet
    ? "https://horizon-testnet.stellar.org"
    : "https://horizon.stellar.org";
  const horizon = new Horizon.Server(horizonUrl);

  const { balances } = await horizon.accounts().accountId(address).call();
  return balances;
};

export const wallet = kit;
