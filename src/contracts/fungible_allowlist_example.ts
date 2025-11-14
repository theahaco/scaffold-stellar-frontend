import * as Client from 'fungible_allowlist_example';
import { rpcUrl } from './util';

export default new Client.Client({
  networkPassphrase: 'Standalone Network ; February 2017',
  contractId: 'CBZ42SGH6E4P5CX7NYC6NNVJ4IABJZNGGN4FKO5FGHLH54OU5XR56NYN',
  rpcUrl,
  allowHttp: true,
  publicKey: undefined,
});
