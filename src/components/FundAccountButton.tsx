import React, { useState } from 'react';
import { useNotification } from '../providers/NotificationProvider';
import { Button } from '@stellar/design-system';

const FundAccountButton: React.FC = () => {
  const { addNotification } = useNotification();
  const [isDisabled, setIsDisabled] = useState(false);
  // TODO: replace with account from wallet
  const account = "GDVWY6R4RP37DQPAWBNQKQIZAGDVHUAYMYXKUDSY2O7PJWZNSIZIJNHQ";

  const handleFundAccount = async (account: string) => {
    setIsDisabled(true);

    addNotification('Funding account, please wait…', 'primary');
    try {
      const response = await fetch(`/friendbot?addr=${account}`, {
        method: 'GET',
      });

      if (response.ok) {
        addNotification('Account funded successfully!', 'success');
      } else {
        const body = await response.json();
        addNotification(`Error funding account: ${body?.detail || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error funding account:', error);
      addNotification('Error funding account. Please try again.', 'error');
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div>
      <Button disabled={isDisabled} onClick={handleFundAccount.bind(this, account)} variant="primary" size="md">Fund Account</Button>
    </div>
  );
};

export default FundAccountButton;