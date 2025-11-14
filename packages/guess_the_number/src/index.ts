import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  standalone: {
    networkPassphrase: "Standalone Network ; February 2017",
    contractId: "CA5ZWOBCPFWCJ5F4KTHYQSO6H2TSD2PG236HR3QG3XN2B5ITBI4OIGPM",
  }
} as const

export const Errors = {
  /**
   * The contract failed to transfer XLM to the guesser
   */
  1: {message:"FailedToTransferToGuesser"},
  /**
   * The guesser failed to transfer XLM to the contract
   */
  2: {message:"FailedToTransferFromGuesser"},
  /**
   * The contract has no balance to transfer to the guesser
   */
  3: {message:"NoBalanceToTransfer"}
}

export interface Client {
  /**
   * Construct and simulate a reset transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update the number. Only callable by admin.
   */
  reset: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a guess transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Guess a number between 1 and 10
   */
  guess: ({a_number, guesser}: {a_number: u64, guesser: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<boolean>>>

  /**
   * Construct and simulate a add_funds transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Admin can add more funds to the contract
   */
  add_funds: ({amount}: {amount: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Upgrade the contract to new wasm. Only callable by admin.
   */
  upgrade: ({new_wasm_hash}: {new_wasm_hash: Buffer}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get current admin
   */
  admin: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<string>>>

  /**
   * Construct and simulate a set_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Set a new admin. Only callable by admin.
   */
  set_admin: ({admin}: {admin: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {admin}: {admin: string},
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy({admin}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAwAAADJUaGUgY29udHJhY3QgZmFpbGVkIHRvIHRyYW5zZmVyIFhMTSB0byB0aGUgZ3Vlc3NlcgAAAAAAGUZhaWxlZFRvVHJhbnNmZXJUb0d1ZXNzZXIAAAAAAAABAAAAMlRoZSBndWVzc2VyIGZhaWxlZCB0byB0cmFuc2ZlciBYTE0gdG8gdGhlIGNvbnRyYWN0AAAAAAAbRmFpbGVkVG9UcmFuc2ZlckZyb21HdWVzc2VyAAAAAAIAAAA2VGhlIGNvbnRyYWN0IGhhcyBubyBiYWxhbmNlIHRvIHRyYW5zZmVyIHRvIHRoZSBndWVzc2VyAAAAAAATTm9CYWxhbmNlVG9UcmFuc2ZlcgAAAAAD",
        "AAAAAAAAAEhDb25zdHJ1Y3RvciB0byBpbml0aWFsaXplIHRoZSBjb250cmFjdCB3aXRoIGFuIGFkbWluIGFuZCBhIHJhbmRvbSBudW1iZXIAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAA=",
        "AAAAAAAAACpVcGRhdGUgdGhlIG51bWJlci4gT25seSBjYWxsYWJsZSBieSBhZG1pbi4AAAAAAAVyZXNldAAAAAAAAAAAAAAA",
        "AAAAAAAAAB9HdWVzcyBhIG51bWJlciBiZXR3ZWVuIDEgYW5kIDEwAAAAAAVndWVzcwAAAAAAAAIAAAAAAAAACGFfbnVtYmVyAAAABgAAAAAAAAAHZ3Vlc3NlcgAAAAATAAAAAQAAA+kAAAABAAAAAw==",
        "AAAAAAAAAChBZG1pbiBjYW4gYWRkIG1vcmUgZnVuZHMgdG8gdGhlIGNvbnRyYWN0AAAACWFkZF9mdW5kcwAAAAAAAAEAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
        "AAAAAAAAADlVcGdyYWRlIHRoZSBjb250cmFjdCB0byBuZXcgd2FzbS4gT25seSBjYWxsYWJsZSBieSBhZG1pbi4AAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAABFHZXQgY3VycmVudCBhZG1pbgAAAAAAAAVhZG1pbgAAAAAAAAAAAAABAAAD6AAAABM=",
        "AAAAAAAAAChTZXQgYSBuZXcgYWRtaW4uIE9ubHkgY2FsbGFibGUgYnkgYWRtaW4uAAAACXNldF9hZG1pbgAAAAAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    reset: this.txFromJSON<null>,
        guess: this.txFromJSON<Result<boolean>>,
        add_funds: this.txFromJSON<null>,
        upgrade: this.txFromJSON<null>,
        admin: this.txFromJSON<Option<string>>,
        set_admin: this.txFromJSON<null>
  }
}