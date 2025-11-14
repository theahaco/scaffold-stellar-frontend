import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    standalone: {
        networkPassphrase: "Standalone Network ; February 2017",
        contractId: "CA5ZWOBCPFWCJ5F4KTHYQSO6H2TSD2PG236HR3QG3XN2B5ITBI4OIGPM",
    }
};
export const Errors = {
    /**
     * The contract failed to transfer XLM to the guesser
     */
    1: { message: "FailedToTransferToGuesser" },
    /**
     * The guesser failed to transfer XLM to the contract
     */
    2: { message: "FailedToTransferFromGuesser" },
    /**
     * The contract has no balance to transfer to the guesser
     */
    3: { message: "NoBalanceToTransfer" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { admin }, 
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy({ admin }, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAwAAADJUaGUgY29udHJhY3QgZmFpbGVkIHRvIHRyYW5zZmVyIFhMTSB0byB0aGUgZ3Vlc3NlcgAAAAAAGUZhaWxlZFRvVHJhbnNmZXJUb0d1ZXNzZXIAAAAAAAABAAAAMlRoZSBndWVzc2VyIGZhaWxlZCB0byB0cmFuc2ZlciBYTE0gdG8gdGhlIGNvbnRyYWN0AAAAAAAbRmFpbGVkVG9UcmFuc2ZlckZyb21HdWVzc2VyAAAAAAIAAAA2VGhlIGNvbnRyYWN0IGhhcyBubyBiYWxhbmNlIHRvIHRyYW5zZmVyIHRvIHRoZSBndWVzc2VyAAAAAAATTm9CYWxhbmNlVG9UcmFuc2ZlcgAAAAAD",
            "AAAAAAAAAEhDb25zdHJ1Y3RvciB0byBpbml0aWFsaXplIHRoZSBjb250cmFjdCB3aXRoIGFuIGFkbWluIGFuZCBhIHJhbmRvbSBudW1iZXIAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAA=",
            "AAAAAAAAACpVcGRhdGUgdGhlIG51bWJlci4gT25seSBjYWxsYWJsZSBieSBhZG1pbi4AAAAAAAVyZXNldAAAAAAAAAAAAAAA",
            "AAAAAAAAAB9HdWVzcyBhIG51bWJlciBiZXR3ZWVuIDEgYW5kIDEwAAAAAAVndWVzcwAAAAAAAAIAAAAAAAAACGFfbnVtYmVyAAAABgAAAAAAAAAHZ3Vlc3NlcgAAAAATAAAAAQAAA+kAAAABAAAAAw==",
            "AAAAAAAAAChBZG1pbiBjYW4gYWRkIG1vcmUgZnVuZHMgdG8gdGhlIGNvbnRyYWN0AAAACWFkZF9mdW5kcwAAAAAAAAEAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
            "AAAAAAAAADlVcGdyYWRlIHRoZSBjb250cmFjdCB0byBuZXcgd2FzbS4gT25seSBjYWxsYWJsZSBieSBhZG1pbi4AAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
            "AAAAAAAAABFHZXQgY3VycmVudCBhZG1pbgAAAAAAAAVhZG1pbgAAAAAAAAAAAAABAAAD6AAAABM=",
            "AAAAAAAAAChTZXQgYSBuZXcgYWRtaW4uIE9ubHkgY2FsbGFibGUgYnkgYWRtaW4uAAAACXNldF9hZG1pbgAAAAAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAA="]), options);
        this.options = options;
    }
    fromJSON = {
        reset: (this.txFromJSON),
        guess: (this.txFromJSON),
        add_funds: (this.txFromJSON),
        upgrade: (this.txFromJSON),
        admin: (this.txFromJSON),
        set_admin: (this.txFromJSON)
    };
}
