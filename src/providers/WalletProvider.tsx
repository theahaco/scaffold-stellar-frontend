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

  // The state is not updated in updateCurrentWalletState() so we need
  // to create a ref and to keep it up to date with the useEffect.
  const stateRef = useRef(state);
  useEffect(() => {
    if (state.address !== stateRef.current.address) stateRef.current = state;
  }, [state]);

  const nullify = () => {
    setState(initialState);
    storage.setItem("walletId", "");
    storage.setItem("walletAddress", "");
    storage.setItem("walletNetwork", "");
    storage.setItem("networkPassphrase", "");
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
        if (walletId !== "freighter") return;
        const [a, n] = await Promise.all([
          wallet.getAddress(),
          wallet.getNetwork(),
        ]);
        if (!a.address) storage.setItem("walletId", "");
        if (
          a.address !== stateRef.current.address ||
          n.network !== stateRef.current.network ||
          n.networkPassphrase !== stateRef.current.networkPassphrase
        ) {
          storage.setItem("walletAddress", a.address);
          storage.setItem("walletNetwork", n.network);
          storage.setItem("networkPassphrase", n.networkPassphrase);
          setState({ ...a, ...n });
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
    if (walletId == "freighter") return;

    wallet
      .getAddress()
      .then((address) => {
        if (address.address) {
          storage.setItem("walletAddress", address.address);
        } else {
          storage.setItem("walletId", "");
          storage.setItem("walletAddress", "");
        }
      })
      .catch((err) => {
        console.error(err);
        nullify();
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
        !stateRef.current.address &&
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- it SHOULD only run once per component mount

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
