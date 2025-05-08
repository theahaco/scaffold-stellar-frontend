import { createContext, useEffect, useMemo, useState } from "react";
import { wallet } from "../util/wallet";
import storage from "../util/storage";

type WalletContextType = {
  address?: string;
  network?: Awaited<ReturnType<typeof wallet.getNetwork>>;
  setAddress?: React.Dispatch<React.SetStateAction<string | undefined>>
};

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string>();
  const [network, setNetwork] = useState<Awaited<ReturnType<typeof wallet.getNetwork>>>();

  useEffect(() => {
    const timer = setInterval(() => {
      void (async () => {
      // There is no way, with StellarWalletsKit, to check if the wallet is
      // installed/connected/authorized! You just have to try to get the
      // address and then parse an error that is not even an Error class.
      const didUserInteractWithWalletSelectorYet = !!storage.getItem("walletId")
      if (didUserInteractWithWalletSelectorYet) {
        try {
          setNetwork(await wallet.getNetwork())
          const { address } = await wallet.getAddress()
          setAddress(address)
        } catch (e) {
          // If `getNetwork` or `getAddress` throw errors... sign the user out???
          setAddress(undefined)
          setNetwork(undefined)

          // then log the error (instead of throwing) so we have visibility
          // into the error while working on Scaffold Stellar but we do not
          // crash the app process
          console.error(e)
        }
      }
    })()}, 1000)

    // return function to call when component dismounts
    return () => { clearTimeout(timer) }
  }, [])

const contextValue = useMemo(() => ({
    address,
    network,
    setAddress,
  }), [address, network, setAddress]);

  return (
    <WalletContext value={contextValue}>
      {children}
    </WalletContext>
  );
};
