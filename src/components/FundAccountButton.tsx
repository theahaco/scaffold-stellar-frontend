import React from 'react';
import { useNotification } from '../providers/NotificationProvider';

const FundAccountButton: React.FC = () => {
  const { addNotification } = useNotification();
  // TODO: replace with account from wallet
  const account = "GBE3HA2ZCHF2GHX6QVGSN5V3EC6URGYVUHUUEJGBJK4QYP2NGIOLAVUO"

  const handleFundAccount = async (account: string) => {
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
    }
  };

  return (
    <div>
      <button onClick={handleFundAccount.bind(this, account)}>Fund Account</button>
    </div>
  );
};

export default FundAccountButton;