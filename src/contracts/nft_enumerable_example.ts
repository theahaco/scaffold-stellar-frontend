import * as Client from 'nft_enumerable_example';
import { rpcUrl } from './util';

export default new Client.Client({
  networkPassphrase: 'Standalone Network ; February 2017',
  contractId: 'CDDSQS5XS7TCFWGXOLLYKOMDETGJVGJMHVJFZZGRL3FGMPYF42WETM2Y',
  rpcUrl,
  allowHttp: true,
  publicKey: undefined,
});
