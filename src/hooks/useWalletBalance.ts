import { useCallback, useEffect, useState } from "react";
import { useWallet } from "./useWallet";
import { fetchBalance } from "../util/wallet";

const formatter = new Intl.NumberFormat();

export const useWalletBalance = () => {
  const { address, network, ...wallet } = useWallet();
  const [isPending, setIsPending] = useState(false);
  const [balances, setBalances] = useState<
    Awaited<ReturnType<typeof fetchBalance>>
  >([]);

  const updateBalance = useCallback(async () => {
    if (!address) return;
    setIsPending(true);
    const result = await fetchBalance(address, network === "TESTNET");
    setBalances(result);
    setIsPending(false);
  }, [address, network]);

  useEffect(() => {
    void updateBalance();
  }, [updateBalance]);

  const native = balances.find(({ asset_type }) => asset_type === "native");

  return {
    balances,
    xlm: formatter.format(Number(native?.balance ?? "0")),
    isPending: wallet.isPending || isPending,
    updateBalance,
  };
};
