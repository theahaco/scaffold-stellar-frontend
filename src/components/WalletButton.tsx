
import { Button, Layout, Modal, Profile } from '@stellar/design-system';
import { useWallet } from '../hooks/useWallet';
import { connectWallet, disconnectWallet } from '../util/wallet';
import { useState } from 'react';


export const WalletButton = () => {
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const { address } = useWallet()

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
            onClick={async () => {
              await disconnectWallet();
              setShowDisconnectModal(false);
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
    {address
      ? <Profile publicAddress={address} size="lg" isShort onClick={() => setShowDisconnectModal(true)} />
      :
      <Button variant="primary" size="lg" onClick={connectWallet}>
        Connect
      </Button>
    }
  </Layout.Content>
}
