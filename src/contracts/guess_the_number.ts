// This is a stub file for the GuessTheNumber contract client.
// The actual contract client is generated at runtime by the Scaffold Stellar CLI.
// This stub allows the build to succeed when the contract hasn't been generated yet.
import {
  AssembledTransaction,
  AssembledTransactionOptions,
  Client as ContractClient,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type { u64, i128, Option } from '@stellar/stellar-sdk/contract';
import { rpcUrl, networkPassphrase } from './util';

interface Client {
  reset: (options?: AssembledTransactionOptions<null>) => Promise<AssembledTransaction<null>>
  guess: ({a_number, guesser}: {a_number: u64, guesser: string}, options?: AssembledTransactionOptions<boolean>) => Promise<AssembledTransaction<Result<boolean>>>
  add_funds: ({amount}: {amount: i128}, options?: AssembledTransactionOptions<null>) => Promise<AssembledTransaction<null>>
  upgrade: ({new_wasm_hash}: {new_wasm_hash: Buffer}, options?: AssembledTransactionOptions<null>) => Promise<AssembledTransaction<null>>
  admin: (options?: AssembledTransactionOptions<string>) => Promise<AssembledTransaction<Option<string>>>
  set_admin: ({admin}: {admin: string}, options?: AssembledTransactionOptions<null>) => Promise<AssembledTransaction<null>>
}

class Client extends ContractClient {
  constructor() {
    super(
      new ContractSpec(["AAAAAAAAABFHZXQgY3VycmVudCBhZG1pbgAAAAAAAAVhZG1pbgAAAAAAAAAAAAABAAAD6AAAABM="]),
      { contractId: "STUB", networkPassphrase, rpcUrl, allowHttp: true, publicKey: undefined }
    )
  }
}

export default new Client();
