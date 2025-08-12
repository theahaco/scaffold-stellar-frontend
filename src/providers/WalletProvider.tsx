import {
  createContext,
  useEffect,
  useMemo,
  useRef,
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
  signTransaction?: typeof wallet.signTransaction;
}

const initialState = {
  address: undefined,
  network: undefined,
  networkPassphrase: undefined,
};

const POLL_INTERVAL = 1000;

export const WalletContext = // eslint-disable-line react-refresh/only-export-components
  createContext<WalletContextType>({ isPending: true });

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] =
    useState<Omit<WalletContextType, "isPending">>(initialState);
  const [isPending, startTransition] = useTransition();
  const popupLock = useRef(false);
  const popupLock2 = useRef(false);

  const signTransaction = wallet.signTransaction.bind(wallet);

  const nullify = () => {
    setState(initialState);
    storage.setItem("walletId", "");
    storage.setItem("walletAddress", "");
    storage.setItem("walletNetwork", "");
    storage.setItem("networkPassphrase", "");
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
              setState({ ...a, ...n });
            }
          } else {
            if (a.address !== state.address) {
              setState({
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
        setState({
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
      ...state,
      isPending,
      signTransaction,
    }),
    [state, isPending, signTransaction],
  );

  return <WalletContext value={contextValue}>{children}</WalletContext>;
};
