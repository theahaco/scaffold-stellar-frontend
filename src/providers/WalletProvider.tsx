import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { wallet } from "../util/wallet";
import storage from "../util/storage";
import { fetchBalances } from "../util/wallet";
import type { MappedBalances } from "../util/wallet";

const signTransaction = wallet.signTransaction.bind(wallet);

/**
 * A good-enough implementation of deepEqual.
 *
 * Used in this file to compare MappedBalances.
 *
 * Should maybe add & use a new dependency instead, if needed elsewhere.
 */
function deepEqual<T>(a: T, b: T): boolean {
  if (a === b) {
    return true;
  }

  const bothAreObjects =
    a && b && typeof a === "object" && typeof b === "object";

  return Boolean(
    bothAreObjects &&
      Object.keys(a).length === Object.keys(b).length &&
      Object.entries(a).every(([k, v]) => deepEqual(v, b[k as keyof T])),
  );
}

export interface WalletContextType {
  address?: string;
  balances: MappedBalances;
  isPending: boolean;
  network?: string;
  networkPassphrase?: string;
  signTransaction: typeof wallet.signTransaction;
  updateBalances: () => Promise<void>;
}

const POLL_INTERVAL = 1000;

export const WalletContext = // eslint-disable-line react-refresh/only-export-components
  createContext<WalletContextType>({
    isPending: true,
    balances: {},
    updateBalances: async () => {},
    signTransaction,
  });

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [balances, setBalances] = useState<MappedBalances>({});
  const [address, setAddress] = useState<string>();
  const [network, setNetwork] = useState<string>();
  const [networkPassphrase, setNetworkPassphrase] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const popupLock = useRef(false);
  const popupLock2 = useRef(false);

  const signTransaction = wallet.signTransaction.bind(wallet);

  const nullify = () => {
    setAddress(undefined);
    setNetwork(undefined);
    setNetworkPassphrase(undefined);
    setBalances({});
    storage.setItem("walletId", "");
    storage.setItem("walletAddress", "");
    storage.setItem("walletNetwork", "");
    storage.setItem("networkPassphrase", "");
  };

  const updateBalances = useCallback(async () => {
    if (!address) {
      setBalances({});
      return;
    }

    const newBalances = await fetchBalances(address);
    setBalances((prev) => {
      if (deepEqual(newBalances, prev)) return prev;
      return newBalances;
    });
  }, [address]);

  useEffect(() => {
    void updateBalances();
  }, [updateBalances]);
  const updateNetwork = async () => {
    try {
      const n = await wallet.getNetwork();
      if (n.network) {
        storage.setItem("walletNetwork", n.network);
        storage.setItem("networkPassphrase", n.networkPassphrase);
        return n;
      } else {
        storage.setItem("walletId", "");
        storage.setItem("walletNetwork", "");
        storage.setItem("networkPassphrase", "");
      }
    } catch (err) {
      console.error(err);
      nullify();
    }
  };

  const updateAddress = async () => {
    try {
      const a = await wallet.getAddress();
      if (a.address) {
        storage.setItem("walletAddress", a.address);
        return a;
      } else {
        storage.setItem("walletId", "");
        storage.setItem("walletAddress", "");
      }
    } catch (err) {
      console.error(err);
      nullify();
    }
  };

  const updateNetwork = async () => {
    try {
      const n = await wallet.getNetwork();
      if (n.network) {
        storage.setItem("walletNetwork", n.network);
        storage.setItem("networkPassphrase", n.networkPassphrase);
        return n;
      } else {
        storage.setItem("walletId", "");
        storage.setItem("walletNetwork", "");
        storage.setItem("networkPassphrase", "");
      }
    } catch (err) {
      console.error(err);
      nullify();
    }
  };

  const updateAddress = async () => {
    try {
      const a = await wallet.getAddress();
      if (a.address) {
        storage.setItem("walletAddress", a.address);
        return a;
      } else {
        storage.setItem("walletId", "");
        storage.setItem("walletAddress", "");
      }
    } catch (err) {
      console.error(err);
      nullify();
    }
  };

  const updateCurrentWalletState = async () => {
    // There is no way, with StellarWalletsKit, to check if the wallet is
    // installed/connected/authorized. We need to manage that on our side by
    // checking our storage item.
    const walletId = storage.getItem("walletId");
    if (!walletId) {
      nullify();
    } else {
      if (popupLock.current) return;
      // If our storage item is there, then we try to get the user's address &
      // network from their wallet.
      try {
        popupLock.current = true;
        wallet.setWallet(walletId);
        if (walletId !== "freighter" && walletId !== "hana") return;
        let n;
        if (walletId == "freighter") {
          n = await updateNetwork();
        }
        const a = await updateAddress();

        if (a) {
          if (!a.address) storage.setItem("walletId", "");
          if (n) {
            if (
              a.address !== state.address ||
              n.network !== state.network ||
              n.networkPassphrase !== state.networkPassphrase
            ) {
              updateState({ ...a, ...n });
            }
          } else {
            if (a.address !== state.address) {
              updateState({
                address: a.address,
                network: "",
                networkPassphrase: "",
              });
            }
          }
        }
      } catch (e) {
        // If `getNetwork` or `getAddress` throw errors... sign the user out???
        nullify();
        // then log the error (instead of throwing) so we have visibility
        // into the error while working on Scaffold Stellar but we do not
        // crash the app process.
        console.error(e);
      } finally {
        popupLock.current = false;
      }
    }
  };

  // Every time the page is refreshed this method asks the user to
  // reconnect if they are using a wallet that triggers a popup
  // when calling getAddress()
  const refreshConnection = () => {
    // Avoid being triggered by strict mode
    if (popupLock2.current) return;
    popupLock2.current = true;
    const walletId = storage.getItem("walletId");
    if (walletId !== null && walletId) {
      wallet.setWallet(walletId);
    } else return;
    if (walletId == "freighter" || walletId == "hana") return;
    if (walletId == "hot-wallet") {
      updateNetwork().catch((err) => {
        console.error(err);
      });
    }
    updateAddress()
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        popupLock2.current = false;
      });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let isMounted = true;
    refreshConnection();

    // Create recursive polling function to check wallet state continuously
    const pollWalletState = async () => {
      if (!isMounted) return;
      const walletNetwork = storage.getItem("walletNetwork");
      const walletAddr = storage.getItem("walletAddress");
      const passphrase = storage.getItem("networkPassphrase");

      if (
        !state.address &&
        walletAddr !== null &&
        walletNetwork !== null &&
        passphrase !== null
      ) {
        updateState({
          address: walletAddr,
          network: walletNetwork,
          networkPassphrase: passphrase,
        });
      }
      await updateCurrentWalletState();

      if (isMounted) {
        timer = setTimeout(() => void pollWalletState(), POLL_INTERVAL);
      }
    };

    // Get the wallet address when the component is mounted for the first time
    startTransition(async () => {
      await updateCurrentWalletState();
      // Start polling after initial state is loaded

      if (isMounted) {
        timer = setTimeout(() => void pollWalletState(), POLL_INTERVAL);
      }
    });

    // Clear the timeout and stop polling when the component unmounts
    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps -- it SHOULD only run once per component mount

  const contextValue = useMemo(
    () => ({
      address,
      network,
      networkPassphrase,
      balances,
      updateBalances,
      isPending,
      signTransaction,
    }),
    [address, network, networkPassphrase, balances, updateBalances, isPending],
  );

  return <WalletContext value={contextValue}>{children}</WalletContext>;
};
