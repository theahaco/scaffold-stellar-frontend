import React, { useState, useTransition } from "react";
import { useNotification } from "../hooks/useNotification.ts";
import { useWallet } from "../hooks/useWallet.ts";
import { Button, Tooltip } from "@stellar/design-system";
import { getFriendbotUrl } from "../util/friendbot";
import { useWalletBalance } from "../hooks/useWalletBalance.ts";

const FundAccountButton: React.FC = () => {
  const { addNotification } = useNotification();
  const [isPending, startTransition] = useTransition();
  const { isFunded, isLoading } = useWalletBalance();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const { address } = useWallet();

  if (!address) return null;

  const handleFundAccount = () => {
    startTransition(async () => {
      try {
        const response = await fetch(getFriendbotUrl(address));

        if (response.ok) {
          addNotification("Account funded successfully!", "success");
        } else {
          const body: unknown = await response.json();
          if (
            body !== null &&
            typeof body === "object" &&
            "detail" in body &&
            typeof body.detail === "string"
          ) {
            addNotification(`Error funding account: ${body.detail}`, "error");
          } else {
            addNotification("Error funding account: Unknown error", "error");
          }
        }
      } catch {
        addNotification("Error funding account. Please try again.", "error");
      }
    });
  };

  return (
    <div
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
    >
      <Tooltip
        isVisible={isTooltipVisible}
        isContrast
        title="Fund Account"
        placement="bottom"
        triggerEl={
          <Button
            disabled={isPending || isLoading || isFunded}
            onClick={handleFundAccount}
            variant="primary"
            size="md"
          >
            Fund Account
          </Button>
        }
      >
        <div style={{ width: "13em" }}>
          {isFunded
            ? "Account is already funded"
            : "Fund your account using the Stellar Friendbot"}
        </div>
      </Tooltip>
    </div>
  );
};

export default FundAccountButton;
