import {
    StellarWalletsKit,
    allowAllModules,
    LOBSTR_ID,
  } from '@creit.tech/stellar-wallets-kit';
import { networkPassphrase } from '../contracts/util'

export const kit: StellarWalletsKit = new StellarWalletsKit({
    network: networkPassphrase,
    selectedWalletId: LOBSTR_ID,
    modules: allowAllModules(),
});