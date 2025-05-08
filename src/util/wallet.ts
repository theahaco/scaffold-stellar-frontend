import storage from './storage'
import {
  ISupportedWallet,
  StellarWalletsKit,
  FREIGHTER_ID,

  // StellarWalletsKit makes us import and then initialize all of these
  // classes, rather than just specify some strings
  AlbedoModule,
  FreighterModule,
  RabetModule,
  xBullModule,
  HotWalletModule,
  HanaModule,
  WalletNetwork,
} from '@creit.tech/stellar-wallets-kit';
import { networkPassphrase } from '../contracts/util'

const kit: StellarWalletsKit = new StellarWalletsKit({
  network: networkPassphrase as WalletNetwork,
  modules: [
    new AlbedoModule(),
    new FreighterModule(),
    new RabetModule(),
    new xBullModule(),
    new HanaModule(),
    // new LobstrModule(), omitted bc does not support `getNetwork`
    new HotWalletModule(),
  ],
  selectedWalletId: storage.getItem("walletId") || FREIGHTER_ID, // should be able to keep it unset!!!
});

export const connectWallet = async () => {
  await kit.openModal({
    modalTitle: "Connect to your wallet",
    onWalletSelected: (option: ISupportedWallet) => {
      void (async () => {
        const selectedId = option.id;
        kit.setWallet(selectedId);

        // now open selected wallet's login flow by calling `getAddress` (!)
        await kit.getAddress();

        // once the `await` returns successfully, we know they actually connected that wallet
        storage.setItem("walletId", selectedId);
      })();
    },
  });
};

export const disconnectWallet = async () => {
  await kit.disconnect();
  storage.removeItem("walletId");
}

export const wallet = kit;
