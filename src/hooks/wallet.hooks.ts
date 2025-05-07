import { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import storage from '../util/storage'
import { kit } from "../util/stellar-wallet-kit";
import { useState } from "react";

export const useWallet = () => {
    const [address, setAddress] = useState<string | null>(null);

    const connectWallet = async () => {
        await kit.openModal({
        modalTitle: "Connect to your wallet",
        onWalletSelected: async (option: ISupportedWallet) => {
            const selectedId = option.id;
            kit.setWallet(selectedId);
            const { address } = await kit.getAddress();
            setAddress(address);
            storage.setItem("walletId", selectedId);

            console.log("Connected to:", address);
        },
        });
    };

    const disconnectWallet = async () => {
        await kit.disconnect();
        setAddress("");
        storage.removeItem("walletId");
    }

    const runWalletInit = async () => {
        const savedWalletId = storage.getItem("walletId");

        if (savedWalletId) {
        try {
            kit.setWallet(savedWalletId);
            const { address } = await kit.getAddress();
            setAddress(address);
            console.log("Reconnected to:", address);
        } catch (e) {
            console.warn("Failed to reconnect:", e);
            setAddress("");
            storage.removeItem("walletId");
        }
        }
        else {
            await connectWallet();
        }
    }

    return {
        address,
        connectWallet,
        disconnectWallet,
        runWalletInit,
    };
};
