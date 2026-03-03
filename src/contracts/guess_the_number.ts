import * as Client from 'guess_the_number';
import { rpcUrl } from './util';

export default new Client.Client({
  networkPassphrase: 'Standalone Network ; February 2017',
  contractId: 'CDN5555VRZDGCGARVQULIEGHMXKYJJ7RJ5XXPF6POTXKJ7BBEBJL5C32',
  rpcUrl,
  allowHttp: true,
  publicKey: undefined,
});
