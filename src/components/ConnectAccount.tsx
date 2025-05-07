import React from 'react';
import { stellarNetwork } from '../contracts/util';
import FundAccountButton from './FundAccountButton';

const ConnectAccount: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', verticalAlign: 'middle' }}>
        <div>Wallet Button here</div>
        {stellarNetwork !== "mainnet" && <FundAccountButton />}
    </div>
  );
};

export default ConnectAccount;