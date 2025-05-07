import React from 'react';
import { stellarNetwork } from '../contracts/util';
import FundAccountButton from './FundAccountButton';

const ConnectAccount: React.FC = () => {
  return (
    <div>
        <p>Wallet Button here</p>
        {stellarNetwork !== "mainnet" && <FundAccountButton />}
    </div>
  );
};

export default ConnectAccount;