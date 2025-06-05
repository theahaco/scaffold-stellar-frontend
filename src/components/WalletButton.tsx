import { useState } from "react";
import {
  Button,
  Layout,
  Modal,
  Profile,
  Tooltip,
} from "@stellar/design-system";
import { useWallet } from "../hooks/useWallet";
import { useWalletBalance } from "../hooks/useWalletBalance";
import { connectWallet, disconnectWallet } from "../util/wallet";

export const WalletButton = () => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const { address, isPending } = useWallet();
  const { xlm, ...balance } = useWalletBalance();
  const buttonLabel = isPending ? "Loading..." : "Connect";

  if (!address) {
    return (
      <Button variant="primary" size="md" onClick={() => void connectWallet()}>
        {buttonLabel}
      </Button>
    );
  }

  const showTooltip = () => {
    void balance.updateBalance();
    if (balance.error) return;
    setIsTooltipVisible(true);
  };

  return (
    <Layout.Content>
      <div id="modalContainer">
        <Modal
          visible={showDisconnectModal}
          onClose={() => setShowDisconnectModal(false)}
          parentId="modalContainer"
        >
          <Modal.Heading>
            Connected as{" "}
            <code style={{ lineBreak: "anywhere" }}>{address}</code>. Do you
            want to disconnect?
          </Modal.Heading>
          <Modal.Footer itemAlignment="stack">
            <Button
              size="md"
              variant="primary"
              onClick={() => {
                void disconnectWallet().then(() =>
                  setShowDisconnectModal(false)
                );
              }}
            >
              Disconnect
            </Button>
            <Button
              size="md"
              variant="tertiary"
              onClick={() => {
                setShowDisconnectModal(false);
              }}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div
        onMouseEnter={showTooltip}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        <Tooltip
          isVisible={isTooltipVisible}
          isContrast
          title="Wallet Balance"
          placement="bottom"
          triggerEl={
            <Profile
              publicAddress={address}
              size="md"
              isShort
              onClick={() => setShowDisconnectModal(true)}
            />
          }
        >
          <span style={{ opacity: balance.isLoading ? 0.6 : 1 }}>
            {xlm} XLM
          </span>
        </Tooltip>
      </div>
    </Layout.Content>
  );
};
