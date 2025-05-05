import { Notification } from '@stellar/design-system';
import React, { useState } from 'react';

const FundAccountButton: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [fundingError, setFundingError] = useState<string | null>(null);

  const handleFundAccount = async (account: string) => {
    try {
      const response = await fetch(`/friendbot?addr=${account}`, {
        method: 'GET',
      });

      if (response.ok) {
        setStatus('success');
      } else {
        const body = await response.json();
        setFundingError(body?.detail || 'Unknown error');
        setStatus('failure');
      }
    } catch (error) {
      console.error('Error funding account:', error);
      setStatus('failure');
    }
  };

  return (
    <div>
      <button onClick={handleFundAccount.bind(this, "GCJBKAXMDTU5ETJIZGSNFZN7ND5VOLEWOJCZJTIMB2AT6CBLLYLJCPFE")}>Fund Account</button>
      {status === 'success' && <Notification title="Account funded successfully!" variant="success"/>}
      {status === 'failure' && <Notification title={`Error funding account: ${fundingError}`} variant="error"/>}
    </div>
  );
};

export default FundAccountButton;