import {
    StellarWalletsKit,
    WalletNetwork,
    allowAllModules,
    LOBSTR_ID,
  } from '@creit.tech/stellar-wallets-kit';
import { Layout } from '@stellar/design-system';
import { useEffect, useMemo, useState } from 'react';

export const WalletProvider = () => {
    const [address, setAddress] = useState<string | null>(null);


    const kit = useMemo(() => {
      return new StellarWalletsKit({
        network: WalletNetwork.TESTNET,
        selectedWalletId: LOBSTR_ID,
        modules: allowAllModules(),
      });
    }, []);

    let hasInitialized = false;

    const runWalletInit = async (
      kit: StellarWalletsKit,
      address: string | null,
      setAddress: (addr: string) => void
    ) => {
      if (hasInitialized) return;
      hasInitialized = true;

      const savedWalletId = localStorage.getItem('walletId');
      const currentSelected = localStorage.getItem('selectedModuleId');

      if (savedWalletId && !address && currentSelected !== savedWalletId) {
        console.log("SAVED WALLET");
        try {
          kit.setWallet(savedWalletId);
          const { address } = await kit.getAddress();
          setAddress(address);
          console.log("Connected to:", address);
        } catch (e) {
          console.warn("Failed to reconnect:", e);
          localStorage.removeItem("walletId");
          localStorage.removeItem("walletAddress");
        }
      }

      const walletContainer = document.querySelector('#walletContainer') as HTMLElement | null;
      if (!walletContainer || walletContainer.hasChildNodes() || kit.isButtonCreated()) return;

      await kit.createButton({
        container: walletContainer,
        onConnect: ({ address }) => {
          const selectedWalletId = localStorage.getItem('selectedModuleId');
          if (selectedWalletId) {
            localStorage.setItem('walletId', selectedWalletId);
          }
          localStorage.setItem('walletAddress', address);
          setAddress(address);
        },
        onDisconnect: () => {
          console.log("Wallet disconnected");
          localStorage.removeItem("walletId");
          localStorage.removeItem("walletAddress");
          setAddress("");
        }
      });
    };    

    useEffect(() => {
      runWalletInit(kit, address, setAddress); 
    }, [kit, address]);

    return <Layout.Content>
        <div id='walletContainer'>

        </div>
    </Layout.Content>
}