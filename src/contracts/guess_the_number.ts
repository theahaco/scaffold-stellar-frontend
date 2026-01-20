import * as Client from 'guess_the_number';
import { rpcUrl } from './util';

export default new Client.Client({
  networkPassphrase: 'Standalone Network ; February 2017',
  contractId: 'CDX23DVQYV2SUOVB5RA6L7NZDNDRKXLCRVVDGGFYBATWTXHYUGJN4HFD',
  rpcUrl,
  allowHttp: true,
  publicKey: undefined,
});
