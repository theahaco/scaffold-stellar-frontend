import React, { useState, useTransition } from 'react';
import { useNotification } from '../providers/NotificationProvider';
import { Button, Tooltip } from '@stellar/design-system';
import { z } from 'zod';

const FriendbotResponseSchema = z.object({
  status: z.number(),
  type: z.string(),
  title: z.string(),
  detail: z.string(),
});

const FundAccountButton: React.FC = () => {
  const { addNotification } = useNotification();
  const [isPending, startTransition] = useTransition();
  const [isFunded, setIsFunded] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  // TODO: replace with account from wallet
  const account = "GDVWY6R4RP37DQPAWBNQKQIZAGDVHUAYMYXKUDSY2O7PJWZNSIZIJNHQ";

  const handleFundAccount = (account: string) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/friendbot?addr=${account}`, {
          method: 'GET',
        });

        if (response.ok) {
          addNotification('Account funded successfully!', 'success');
          setIsFunded(true);
        } else {
          const body = FriendbotResponseSchema.parse(await response.json());

          if (body.detail === "account already funded to starting balance") {
            setIsFunded(true);
          }
          addNotification(`Error funding account: ${body.detail || 'Unknown error'}`, 'error');
        }
      } catch (error) {
        console.error('Error funding account:', error);
        addNotification('Error funding account. Please try again.', 'error');
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
            disabled={isPending || isFunded}
            onClick={handleFundAccount.bind(this, account)}
            variant="primary"
            size="md"
          >
            Fund Account
          </Button>
        }
      >
        <div style={{ width: '13em' }} >
          {isFunded ? "Account is already funded" : "Fund your account using the Stellar Friendbot"}
        </div>
      </Tooltip>
    </div>
  );
};

export default FundAccountButton;