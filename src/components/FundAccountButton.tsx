import React, { useRef } from 'react';
import { useNotification } from '../providers/NotificationProvider';

const FundAccountButton: React.FC = () => {
  const { addNotification } = useNotification();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  // TODO: replace with account from wallet
  const account = "GDVWY6R4RP37DQPAWBNQKQIZAGDVHUAYMYXKUDSY2O7PJWZNSIZIJNHQ";

  const handleFundAccount = async (account: string) => {
    // Disable the button to prevent multiple clicks
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
    }

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
      if (buttonRef.current) {
        buttonRef.current.disabled = false;
      }
    }
  };

  return (
    <div>
      <button ref={buttonRef} onClick={handleFundAccount.bind(this, account)}>Fund Account</button>
    </div>
  );
};

export default FundAccountButton;