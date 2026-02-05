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
 * Each wallet can have different behaviors for `getAddress` and `getNetwork`.
 *
 * - `getAddressBehavior`:
 *   - "standard": getAddress only triggers popup when not connected (ideal behavior)
 *   - "popup-always": getAddress triggers a popup yo sign every time it's called, even when connected
 *
 * - `supportsGetNetwork`:
 *   - true: wallet supports the getNetwork method
 *   - false: wallet does NOT support getNetwork, will use fallback/cached values
 */
interface WalletBehavior {
  getAddressBehavior: "standard" | "popup-always";
  supportsGetNetwork: boolean;
}

/**
 * Default behavior for unknown wallets
 * Assumes popup-always to avoid unwanted popups, and assumes getNetwork is not supported
 */
const DEFAULT_WALLET_BEHAVIOR: WalletBehavior = {
  getAddressBehavior: "popup-always",
  supportsGetNetwork: false,
};

const WALLET_BEHAVIORS: Record<string, WalletBehavior> = {
  freighter: { getAddressBehavior: "standard", supportsGetNetwork: true },
  "hot-wallet": {
    getAddressBehavior: "popup-always",
    supportsGetNetwork: true,
  },
  hana: { getAddressBehavior: "standard", supportsGetNetwork: false },
  lobstr: { getAddressBehavior: "popup-always", supportsGetNetwork: false },
  albedo: { getAddressBehavior: "popup-always", supportsGetNetwork: false },
  xbull: { getAddressBehavior: "standard", supportsGetNetwork: false },
  rabbet: { getAddressBehavior: "standard", supportsGetNetwork: false },
  klever: { getAddressBehavior: "popup-always", supportsGetNetwork: true },
};

/**
 * Get the behavior configuration for a specific wallet
 */
function getWalletBehavior(walletId: string): WalletBehavior {
  return WALLET_BEHAVIORS[walletId] ?? DEFAULT_WALLET_BEHAVIOR;
}

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

  /**
   * Fetches the address from the wallet, respecting wallet-specific behaviors.
   * For "popup-always" wallets: Never calls getAddress more than once.
   */
  const fetchAddress = async (
    walletId: string,
    cachedAddress: string | null,
  ): Promise<{ address: string }> => {
    const behavior = getWalletBehavior(walletId);

    if (behavior.getAddressBehavior === "popup-always") {
      if (cachedAddress) {
        return { address: cachedAddress };
      }
    }

    return wallet.getAddress();
  };

  /**
   * Fetches the network from the wallet, respecting wallet-specific behaviors.
   * For wallets that don't support getNetwork, returns cached values or defaults.
   */
  const fetchNetwork = async (
    walletId: string,
    cachedNetwork: string | null,
    cachedPassphrase: string | null,
  ): Promise<{ network: string; networkPassphrase: string }> => {
    const behavior = getWalletBehavior(walletId);

    if (!behavior.supportsGetNetwork) {
      return {
        network: cachedNetwork ?? "testnet",
        networkPassphrase:
          cachedPassphrase ?? "Test SDF Network ; September 2015",
      };
    }

    return wallet.getNetwork();
  };

  const updateCurrentWalletState = async () => {
    // There is no way, with StellarWalletsKit, to check if the wallet is
    // installed/connected/authorized. We need to manage that on our side by
    // checking our storage item.
    const walletId = storage.getItem("walletId");
    const walletNetwork = storage.getItem("walletNetwork");
    const walletAddr = storage.getItem("walletAddress");
    const passphrase = storage.getItem("networkPassphrase");

    if (
      !address &&
      walletAddr !== null &&
      walletNetwork !== null &&
      passphrase !== null
    ) {
      setAddress(walletAddr);
      setNetwork(walletNetwork);
      setNetworkPassphrase(passphrase);
    }

    if (!walletId) {
      nullify();
    } else {
      if (popupLock.current) return;

      try {
        popupLock.current = true;
        wallet.setWallet(walletId);

        const [addressResult, networkResult] = await Promise.all([
          fetchAddress(walletId, walletAddr),
          fetchNetwork(walletId, walletNetwork, passphrase),
        ]);

        if (!addressResult.address) {
          storage.setItem("walletId", "");
          return;
        }

        if (
          addressResult.address !== address ||
          networkResult.network !== network ||
          networkResult.networkPassphrase !== networkPassphrase
        ) {
          storage.setItem("walletAddress", addressResult.address);
          storage.setItem("walletNetwork", networkResult.network);
          storage.setItem("networkPassphrase", networkResult.networkPassphrase);
          setAddress(addressResult.address);
          setNetwork(networkResult.network);
          setNetworkPassphrase(networkResult.networkPassphrase);
        }
      } catch (e) {
        // If `getNetwork` or `getAddress` throw errors... sign the user out???
        nullify();
        // then log the error (instead of throwing) so we have visibility
        // into the error while working on Scaffold Stellar but we do not
        // crash the app process
        console.error(e);
      } finally {
        popupLock.current = false;
      }
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let isMounted = true;

    // Create recursive polling function to check wallet state continuously
    const pollWalletState = async () => {
      if (!isMounted) return;

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
