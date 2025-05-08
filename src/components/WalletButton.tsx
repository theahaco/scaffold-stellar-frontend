
import { Button, Layout, Modal } from '@stellar/design-system';
import { useWallet } from '../providers/WalletProviders';
import { connectWallet, disconnectWallet } from '../util/wallet';
import { useState } from 'react';


export const WalletButton = () => {
  const [showModal, setShowModal] = useState(false);
  const { address } = useWallet()
  const buttonLabel = address ? `${address.slice(0, 10)}...` : "Connect"

  // TODO: figure out why `useWallet` is getting mounted/used twice
  console.log({ component: 'WalletButton', address })

  const handleClick = async () => {
    if (address) {
      setShowModal(true)
    }
    else {
      await connectWallet()
    }
  }


  return <Layout.Content>
    <div id="modalContainer">
      <Modal visible={showModal} onClose={() => setShowModal(false)} parentId="modalContainer">
        <Modal.Heading>Do you want to disconnect ?</Modal.Heading>
        <Modal.Footer itemAlignment='stack'>
          <Button
            size="md"
            variant="primary"
            onClick={async () => {
              await disconnectWallet();
              setShowModal(false);
            }}
          >
            Disconnect
          </Button>
          <Button
            size="md"
            variant="tertiary"
            onClick={() => {
              setShowModal(false);
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    <Button variant="primary" size="lg" onClick={handleClick}>{buttonLabel}</Button>
  </Layout.Content>
}
