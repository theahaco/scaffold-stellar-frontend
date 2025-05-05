import React from 'react';
import { useNotification } from '../providers/NotificationProvider';

const FundAccountButton: React.FC = () => {
  const { addNotification } = useNotification();

  const handleFundAccount = async (account: string) => {
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
      <button onClick={handleFundAccount.bind(this, "GCJBKAXMDTU5ETJIZGSNFZN7ND5VOLEWOJCZJTIMB2AT6CBLLYLJCPFE")}>Fund Account</button>
    </div>
  );
};

export default FundAccountButton;