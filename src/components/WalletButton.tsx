
import { Button, Layout, Modal, Profile } from '@stellar/design-system';
import { useWallet } from '../hooks/useWallet';
import { connectWallet, disconnectWallet } from '../util/wallet';
import { useState } from 'react';


export const WalletButton = () => {
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const { address } = useWallet()

  if (!address) {
    return  (
      <Button variant="primary" size="lg" onClick={() => void connectWallet()}>
        Connect
      </Button>
    )
  }

  return <Layout.Content>
    <div id="modalContainer">
      <Modal visible={showDisconnectModal} onClose={() => setShowDisconnectModal(false)} parentId="modalContainer">
        <Modal.Heading>
          Connected as <code style={{ lineBreak: 'anywhere' }}>{address}</code>.
          Do you want to disconnect?
        </Modal.Heading>
        <Modal.Footer itemAlignment='stack'>
          <Button
            size="md"
            variant="primary"
            onClick={() => {
              void disconnectWallet().then(() =>
                setShowDisconnectModal(false)
              )
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
    <Profile
      publicAddress={address}
      size="md"
      isShort
      onClick={() => setShowDisconnectModal(true)}
    />
  </Layout.Content>
}
