import {
  createContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { wallet } from "../util/wallet";
import storage from "../util/storage";

export interface WalletContextType {
  address?: string;
  network?: string;
  networkPassphrase?: string;
  isPending: boolean;
}

export const WalletContext = // eslint-disable-line react-refresh/only-export-components
  createContext<WalletContextType>({ isPending: true });

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string>();
  const [network, setNetwork] = useState<string>();
  const [networkPassphrase, setNetworkPassphrase] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const nullify = () => {
    setNetwork(undefined);
    setNetworkPassphrase(undefined);
    setAddress(undefined);
  };

  const updateCurrentWalletState = async () => {
    // There is no way, with StellarWalletsKit, to check if the wallet is
    // installed/connected/authorized. We need to manage that on our side by
    // checking our storage item.
    if (!storage.getItem("walletId")) {
      nullify();
    } else {
      // If our storage item is there, then we try to get the user's address &
      // network from their wallet. Note: `getAddress` MAY open their wallet
      // extension, depending on which wallet they select!
      try {
        const [a, n] = await Promise.all([
          wallet.getAddress(),
          wallet.getNetwork(),
        ]);
        if (a.address !== address) setAddress(a.address);
        if (n.network !== network) setNetwork(n.network);
        if (n.networkPassphrase !== networkPassphrase)
          setNetworkPassphrase(n.networkPassphrase);
      } catch (e) {
        // If `getNetwork` or `getAddress` throw errors... sign the user out???
        nullify();

        // then log the error (instead of throwing) so we have visibility
        // into the error while working on Scaffold Stellar but we do not
        // crash the app process
        console.error(e);
      }
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Get the wallet address when the component is mounted for the first time
    startTransition(async () => {
      await updateCurrentWalletState();
    });

    void (async () => {
      // Poll the wallet extension for updates every second. This allows the
      // app to stay aware of which address & network the user selected in
      // their wallet extension.
      //
      // Using `while (true)` (as opposed to `setInterval`) allows awaits to
      // complete between iterations.
      while (true) {
        await new Promise((res) => {
          timer = setTimeout(res, 1000);
        });
        await updateCurrentWalletState();
      }
    })();

    // Clear the timeout when the component unmounts
    // (unmounting removes the `while (true)` loop)
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- it SHOULD only run once per component mount

  const contextValue = useMemo(
    () => ({
      address,
      network,
      networkPassphrase,
      isPending,
    }),
    [address, network, networkPassphrase, isPending],
  );

  return <WalletContext value={contextValue}>{children}</WalletContext>;
};
