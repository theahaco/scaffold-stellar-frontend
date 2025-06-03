import React from "react";
import { Icon } from "@stellar/design-system";
import { useWallet } from "../hooks/useWallet";
import { stellarNetwork } from "../contracts/util";

const NetworkPill: React.FC = () => {
  const { network, address } = useWallet();

  // Check if there's a network mismatch
  const isNetworkMismatch =
    address &&
    network &&
    network.toUpperCase() !== stellarNetwork.toUpperCase();

  const bgColor = "#F0F2F5";
  const textColor = "#4A5362";

  // Green when connected (and networks match), red when mismatch, gray when not connected
  const circleColor = !address
    ? "#C1C7D0"
    : isNetworkMismatch
      ? "#FF3B30"
      : "#2ED06E";

  // Format network name with first letter capitalized
  const formatNetworkName = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  // Create mismatch message for hover tooltip with proper capitalization
  const mismatchMessage = isNetworkMismatch
    ? `Network mismatch: App is on ${formatNetworkName(stellarNetwork)}, wallet is on ${formatNetworkName(network)}`
    : "";

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
        padding: "4px 10px",
        borderRadius: "16px",
        fontSize: "12px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        cursor: isNetworkMismatch ? "help" : "default",
      }}
      title={mismatchMessage}
    >
      <Icon.Circle color={circleColor} />
      {formatNetworkName(stellarNetwork)}
    </div>
  );
};

export default NetworkPill;
