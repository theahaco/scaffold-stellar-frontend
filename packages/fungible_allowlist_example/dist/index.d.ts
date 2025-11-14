import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from '@stellar/stellar-sdk/contract';
import type { u32, u64, i128, Option } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
export declare const networks: {
    readonly standalone: {
        readonly networkPassphrase: "Standalone Network ; February 2017";
        readonly contractId: "CBZ42SGH6E4P5CX7NYC6NNVJ4IABJZNGGN4FKO5FGHLH54OU5XR56NYN";
    };
};
/**
 * Storage key for enumeration of accounts per role.
 */
export interface RoleAccountKey {
    index: u32;
    role: string;
}
/**
 * Storage keys for the data associated with the access control
 */
export type AccessControlStorageKey = {
    tag: "RoleAccounts";
    values: readonly [RoleAccountKey];
} | {
    tag: "HasRole";
    values: readonly [string, string];
} | {
    tag: "RoleAccountsCount";
    values: readonly [string];
} | {
    tag: "RoleAdmin";
    values: readonly [string];
} | {
    tag: "Admin";
    values: void;
} | {
    tag: "PendingAdmin";
    values: void;
};
export declare const AccessControlError: {
    2000: {
        message: string;
    };
    2001: {
        message: string;
    };
    2002: {
        message: string;
    };
    2003: {
        message: string;
    };
    2004: {
        message: string;
    };
    2005: {
        message: string;
    };
    2006: {
        message: string;
    };
    2007: {
        message: string;
    };
    2008: {
        message: string;
    };
};
/**
 * Storage keys for `Ownable` utility.
 */
export type OwnableStorageKey = {
    tag: "Owner";
    values: void;
} | {
    tag: "PendingOwner";
    values: void;
};
export declare const OwnableError: {
    2100: {
        message: string;
    };
    2101: {
        message: string;
    };
    2102: {
        message: string;
    };
};
export declare const RoleTransferError: {
    2200: {
        message: string;
    };
    2201: {
        message: string;
    };
    2202: {
        message: string;
    };
};
export declare const CryptoError: {
    /**
     * The merkle proof length is out of bounds.
     */
    1400: {
        message: string;
    };
    /**
     * The index of the leaf is out of bounds.
     */
    1401: {
        message: string;
    };
    /**
     * No data in hasher state.
     */
    1402: {
        message: string;
    };
};
export type Rounding = {
    tag: "Floor";
    values: void;
} | {
    tag: "Ceil";
    values: void;
};
export declare const SorobanFixedPointError: {
    /**
     * The operation failed because the denominator is 0.
     */
    1500: {
        message: string;
    };
    /**
     * The operation failed because a phantom overflow occurred.
     */
    1501: {
        message: string;
    };
    /**
     * The operation failed because the result does not fit in Self.
     */
    1502: {
        message: string;
    };
};
/**
 * Storage keys for the data associated with `MerkleDistributor`
 */
export type MerkleDistributorStorageKey = {
    tag: "Root";
    values: void;
} | {
    tag: "Claimed";
    values: readonly [u32];
};
export declare const MerkleDistributorError: {
    /**
     * The merkle root is not set.
     */
    1300: {
        message: string;
    };
    /**
     * The provided index was already claimed.
     */
    1301: {
        message: string;
    };
    /**
     * The proof is invalid.
     */
    1302: {
        message: string;
    };
};
/**
 * Storage key for the pausable state
 */
export type PausableStorageKey = {
    tag: "Paused";
    values: void;
};
export declare const PausableError: {
    /**
     * The operation failed because the contract is paused.
     */
    1000: {
        message: string;
    };
    /**
     * The operation failed because the contract is not paused.
     */
    1001: {
        message: string;
    };
};
export declare const UpgradeableError: {
    /**
     * When migration is attempted but not allowed due to upgrade state.
     */
    1100: {
        message: string;
    };
};
/**
 * Storage keys for the data associated with the allowlist extension
 */
export type AllowListStorageKey = {
    tag: "Allowed";
    values: readonly [string];
};
/**
 * Storage keys for the data associated with the blocklist extension
 */
export type BlockListStorageKey = {
    tag: "Blocked";
    values: readonly [string];
};
/**
 * Storage key that maps to [`AllowanceData`]
 */
export interface AllowanceKey {
    owner: string;
    spender: string;
}
/**
 * Storage container for the amount of tokens for which an allowance is granted
 * and the ledger number at which this allowance expires.
 */
export interface AllowanceData {
    amount: i128;
    live_until_ledger: u32;
}
/**
 * Storage keys for the data associated with `FungibleToken`
 */
export type StorageKey = {
    tag: "TotalSupply";
    values: void;
} | {
    tag: "Balance";
    values: readonly [string];
} | {
    tag: "Allowance";
    values: readonly [AllowanceKey];
};
/**
 * Storage container for token metadata
 */
export interface Metadata {
    decimals: u32;
    name: string;
    symbol: string;
}
/**
 * Storage key for accessing the SAC address
 */
export type SACAdminGenericDataKey = {
    tag: "Sac";
    values: void;
};
/**
 * Storage key for accessing the SAC address
 */
export type SACAdminWrapperDataKey = {
    tag: "Sac";
    values: void;
};
export declare const FungibleTokenError: {
    /**
     * Indicates an error related to the current balance of account from which
     * tokens are expected to be transferred.
     */
    100: {
        message: string;
    };
    /**
     * Indicates a failure with the allowance mechanism when a given spender
     * doesn't have enough allowance.
     */
    101: {
        message: string;
    };
    /**
     * Indicates an invalid value for `live_until_ledger` when setting an
     * allowance.
     */
    102: {
        message: string;
    };
    /**
     * Indicates an error when an input that must be >= 0
     */
    103: {
        message: string;
    };
    /**
     * Indicates overflow when adding two values
     */
    104: {
        message: string;
    };
    /**
     * Indicates access to uninitialized metadata
     */
    105: {
        message: string;
    };
    /**
     * Indicates that the operation would have caused `total_supply` to exceed
     * the `cap`.
     */
    106: {
        message: string;
    };
    /**
     * Indicates the supplied `cap` is not a valid cap value.
     */
    107: {
        message: string;
    };
    /**
     * Indicates the Cap was not set.
     */
    108: {
        message: string;
    };
    /**
     * Indicates the SAC address was not set.
     */
    109: {
        message: string;
    };
    /**
     * Indicates a SAC address different than expected.
     */
    110: {
        message: string;
    };
    /**
     * Indicates a missing function parameter in the SAC contract context.
     */
    111: {
        message: string;
    };
    /**
     * Indicates an invalid function parameter in the SAC contract context.
     */
    112: {
        message: string;
    };
    /**
     * The user is not allowed to perform this operation
     */
    113: {
        message: string;
    };
    /**
     * The user is blocked and cannot perform this operation
     */
    114: {
        message: string;
    };
};
/**
 * Storage keys for the data associated with the consecutive extension of
 * `NonFungibleToken`
 */
export type NFTConsecutiveStorageKey = {
    tag: "Approval";
    values: readonly [u32];
} | {
    tag: "Owner";
    values: readonly [u32];
} | {
    tag: "OwnershipBucket";
    values: readonly [u32];
} | {
    tag: "BurnedToken";
    values: readonly [u32];
};
export interface OwnerTokensKey {
    index: u32;
    owner: string;
}
/**
 * Storage keys for the data associated with the enumerable extension of
 * `NonFungibleToken`
 */
export type NFTEnumerableStorageKey = {
    tag: "TotalSupply";
    values: void;
} | {
    tag: "OwnerTokens";
    values: readonly [OwnerTokensKey];
} | {
    tag: "OwnerTokensIndex";
    values: readonly [u32];
} | {
    tag: "GlobalTokens";
    values: readonly [u32];
} | {
    tag: "GlobalTokensIndex";
    values: readonly [u32];
};
/**
 * Storage container for royalty information
 */
export interface RoyaltyInfo {
    basis_points: u32;
    receiver: string;
}
/**
 * Storage keys for royalty data
 */
export type NFTRoyaltiesStorageKey = {
    tag: "DefaultRoyalty";
    values: void;
} | {
    tag: "TokenRoyalty";
    values: readonly [u32];
};
/**
 * Storage container for the token for which an approval is granted
 * and the ledger number at which this approval expires.
 */
export interface ApprovalData {
    approved: string;
    live_until_ledger: u32;
}
/**
 * Storage container for token metadata
 */
export interface Metadata {
    base_uri: string;
    name: string;
    symbol: string;
}
/**
 * Storage keys for the data associated with `NonFungibleToken`
 */
export type NFTStorageKey = {
    tag: "Owner";
    values: readonly [u32];
} | {
    tag: "Balance";
    values: readonly [string];
} | {
    tag: "Approval";
    values: readonly [u32];
} | {
    tag: "ApprovalForAll";
    values: readonly [string, string];
} | {
    tag: "Metadata";
    values: void;
};
export type NFTSequentialStorageKey = {
    tag: "TokenIdCounter";
    values: void;
};
export declare const NonFungibleTokenError: {
    /**
     * Indicates a non-existent `token_id`.
     */
    200: {
        message: string;
    };
    /**
     * Indicates an error related to the ownership over a particular token.
     * Used in transfers.
     */
    201: {
        message: string;
    };
    /**
     * Indicates a failure with the `operator`s approval. Used in transfers.
     */
    202: {
        message: string;
    };
    /**
     * Indicates a failure with the `approver` of a token to be approved. Used
     * in approvals.
     */
    203: {
        message: string;
    };
    /**
     * Indicates an invalid value for `live_until_ledger` when setting
     * approvals.
     */
    204: {
        message: string;
    };
    /**
     * Indicates overflow when adding two values
     */
    205: {
        message: string;
    };
    /**
     * Indicates all possible `token_id`s are already in use.
     */
    206: {
        message: string;
    };
    /**
     * Indicates an invalid amount to batch mint in `consecutive` extension.
     */
    207: {
        message: string;
    };
    /**
     * Indicates the token does not exist in owner's list.
     */
    208: {
        message: string;
    };
    /**
     * Indicates the token does not exist in global list.
     */
    209: {
        message: string;
    };
    /**
     * Indicates access to unset metadata.
     */
    210: {
        message: string;
    };
    /**
     * Indicates the length of the base URI exceeds the maximum allowed.
     */
    211: {
        message: string;
    };
    /**
     * Indicates the royalty amount is higher than 10_000 (100%) basis points.
     */
    212: {
        message: string;
    };
};
export interface SigningKey {
    public_key: Buffer;
    scheme: u32;
}
/**
 * Storage keys for claim issuer key management.
 */
export type ClaimIssuerStorageKey = {
    tag: "Topics";
    values: readonly [u32];
} | {
    tag: "Pairs";
    values: readonly [SigningKey];
} | {
    tag: "RevokedClaim";
    values: readonly [Buffer];
} | {
    tag: "ClaimNonce";
    values: readonly [string, u32];
};
/**
 * Signature data for Ed25519 scheme.
 */
export interface Ed25519SignatureData {
    public_key: Buffer;
    signature: Buffer;
}
/**
 * Signature data for Secp256r1 scheme.
 */
export interface Secp256r1SignatureData {
    public_key: Buffer;
    signature: Buffer;
}
/**
 * Signature data for Secp256k1 scheme.
 */
export interface Secp256k1SignatureData {
    public_key: Buffer;
    recovery_id: u32;
    signature: Buffer;
}
export declare const ClaimIssuerError: {
    /**
     * Signature data length does not match the expected scheme.
     */
    350: {
        message: string;
    };
    /**
     * The provided key is empty.
     */
    351: {
        message: string;
    };
    /**
     * The key is already allowed for the specified topic.
     */
    352: {
        message: string;
    };
    /**
     * The specified key was not found in the allowed keys.
     */
    353: {
        message: string;
    };
    /**
     * The claim issuer is not allowed to sign claims about the specified
     * claim topic.
     */
    354: {
        message: string;
    };
    /**
     * Maximum limit exceeded (keys per topic or registries per key).
     */
    355: {
        message: string;
    };
    /**
     * No signing keys found for the specified claim topic.
     */
    356: {
        message: string;
    };
    /**
     * Invalid claim data encoding.
     */
    357: {
        message: string;
    };
    /**
     * Recovery of the Secp256k1 public key failed.
     */
    358: {
        message: string;
    };
    /**
     * Indicates overflow when adding two values.
     */
    359: {
        message: string;
    };
};
/**
 * Storage keys for the data associated with the claim topics and issuers
 * extension
 */
export type ClaimTopicsAndIssuersStorageKey = {
    tag: "ClaimTopics";
    values: void;
} | {
    tag: "TrustedIssuers";
    values: void;
} | {
    tag: "IssuerClaimTopics";
    values: readonly [string];
} | {
    tag: "ClaimTopicIssuers";
    values: readonly [u32];
};
export declare const ClaimTopicsAndIssuersError: {
    /**
     * Indicates a non-existent claim topic.
     */
    370: {
        message: string;
    };
    /**
     * Indicates a non-existent trusted issuer.
     */
    371: {
        message: string;
    };
    /**
     * Indicates a claim topic already exists.
     */
    372: {
        message: string;
    };
    /**
     * Indicates a trusted issuer already exists.
     */
    373: {
        message: string;
    };
    /**
     * Indicates max claim topics limit is reached.
     */
    374: {
        message: string;
    };
    /**
     * Indicates max trusted issuers limit is reached.
     */
    375: {
        message: string;
    };
    /**
     * Indicates claim topics set provided for the issuer cannot be empty.
     */
    376: {
        message: string;
    };
};
/**
 * Storage keys for the modular compliance contract.
 */
export type ComplianceDataKey = {
    tag: "HookModules";
    values: readonly [ComplianceHook];
};
/**
 * Hook types for modular compliance system.
 *
 * Each hook type represents a specific event or validation point
 * where compliance modules can be executed.
 */
export type ComplianceHook = {
    tag: "Transferred";
    values: void;
} | {
    tag: "Created";
    values: void;
} | {
    tag: "Destroyed";
    values: void;
} | {
    tag: "CanTransfer";
    values: void;
} | {
    tag: "CanCreate";
    values: void;
};
export declare const ComplianceError: {
    /**
     * Indicates a module is already registered for this hook.
     */
    360: {
        message: string;
    };
    /**
     * Indicates a module is not registered for this hook.
     */
    361: {
        message: string;
    };
    /**
     * Indicates a module bound is exceeded.
     */
    362: {
        message: string;
    };
    /**
     * Indicates a token is not bound to this compliance contract.
     */
    363: {
        message: string;
    };
};
/**
 * Represents a document with its metadata.
 */
export interface Document {
    /**
   * The hash of the document contents.
   */
    document_hash: Buffer;
    /**
   * Timestamp when the document was last modified.
   */
    timestamp: u64;
    /**
   * The URI where the document can be accessed.
   */
    uri: string;
}
/**
 * Storage keys for document management.
 */
export type DocumentStorageKey = {
    tag: "Index";
    values: readonly [Buffer];
} | {
    tag: "Bucket";
    values: readonly [u32];
} | {
    tag: "Count";
    values: void;
};
/**
 * Error codes for document management operations.
 */
export declare const DocumentError: {
    /**
     * The specified document was not found.
     */
    380: {
        message: string;
    };
    /**
     * Maximum number of documents has been reached.
     */
    381: {
        message: string;
    };
    /**
     * The URI exceeds the maximum allowed length.
     */
    382: {
        message: string;
    };
};
/**
 * Represents a claim stored on-chain.
 */
export interface Claim {
    /**
   * The claim data
   */
    data: Buffer;
    /**
   * The address of the claim issuer
   */
    issuer: string;
    /**
   * The signature scheme used
   */
    scheme: u32;
    /**
   * The cryptographic signature
   */
    signature: Buffer;
    /**
   * The claim topic (numeric identifier)
   */
    topic: u32;
    /**
   * Optional URI for additional information
   */
    uri: string;
}
/**
 * Storage keys for the data associated with Identity Claims.
 */
export type ClaimsStorageKey = {
    tag: "Claim";
    values: readonly [Buffer];
} | {
    tag: "ClaimsByTopic";
    values: readonly [u32];
};
export declare const ClaimsError: {
    /**
     * Claim  ID does not exist.
     */
    340: {
        message: string;
    };
    /**
     * Claim Issuer cannot validate the claim (revocation, signature mismatch,
     * unauthorized signing key, etc.)
     */
    341: {
        message: string;
    };
};
/**
 * Represents the type of identity holder
 */
export type IdentityType = {
    tag: "Individual";
    values: void;
} | {
    tag: "Organization";
    values: void;
};
/**
 * Represents different types of country relationships for individuals
 * ISO 3166-1 numeric country code
 */
export type IndividualCountryRelation = {
    tag: "Residence";
    values: readonly [u32];
} | {
    tag: "Citizenship";
    values: readonly [u32];
} | {
    tag: "SourceOfFunds";
    values: readonly [u32];
} | {
    tag: "TaxResidency";
    values: readonly [u32];
} | {
    tag: "Custom";
    values: readonly [string, u32];
};
/**
 * Represents different types of country relationships for organizations
 */
export type OrganizationCountryRelation = {
    tag: "Incorporation";
    values: readonly [u32];
} | {
    tag: "OperatingJurisdiction";
    values: readonly [u32];
} | {
    tag: "TaxJurisdiction";
    values: readonly [u32];
} | {
    tag: "SourceOfFunds";
    values: readonly [u32];
} | {
    tag: "Custom";
    values: readonly [string, u32];
};
/**
 * Unified country relationship that can be either individual or organizational
 */
export type CountryRelation = {
    tag: "Individual";
    values: readonly [IndividualCountryRelation];
} | {
    tag: "Organization";
    values: readonly [OrganizationCountryRelation];
};
/**
 * A country data containing the country relationship and optional metadata
 */
export interface CountryData {
    /**
   * Type of country relationship
   */
    country: CountryRelation;
    /**
   * Optional metadata (e.g., visa type, validity period)
   */
    metadata: Option<Map<string, string>>;
}
/**
 * Complete identity profile containing identity type and country data
 */
export interface IdentityProfile {
    countries: Array<CountryData>;
    identity_type: IdentityType;
}
/**
 * Storage keys for the data associated with Identity Storage Registry.
 */
export type IRSStorageKey = {
    tag: "Identity";
    values: readonly [string];
} | {
    tag: "IdentityProfile";
    values: readonly [string];
} | {
    tag: "RecoveredTo";
    values: readonly [string];
};
/**
 * Error codes for the Identity Registry Storage system.
 */
export declare const IRSError: {
    /**
     * An identity already exists for the given account.
     */
    320: {
        message: string;
    };
    /**
     * No identity found for the given account.
     */
    321: {
        message: string;
    };
    /**
     * Country data not found at the specified index.
     */
    322: {
        message: string;
    };
    /**
     * Identity can't be with empty country data list.
     */
    323: {
        message: string;
    };
    /**
     * The maximum number of country entries has been reached.
     */
    324: {
        message: string;
    };
    /**
     * Account has been recovered and cannot be used.
     */
    325: {
        message: string;
    };
};
/**
 * Storage keys for the data associated with `RWA` token
 */
export type IdentityVerifierStorageKey = {
    tag: "ClaimTopicsAndIssuers";
    values: void;
} | {
    tag: "IdentityRegistryStorage";
    values: void;
};
/**
 * Storage keys for the data associated with `RWA` token
 */
export type RWAStorageKey = {
    tag: "AddressFrozen";
    values: readonly [string];
} | {
    tag: "FrozenTokens";
    values: readonly [string];
} | {
    tag: "Compliance";
    values: void;
} | {
    tag: "OnchainId";
    values: void;
} | {
    tag: "Version";
    values: void;
} | {
    tag: "IdentityVerifier";
    values: void;
};
/**
 * Storage keys for the token binder system.
 *
 * - Tokens are stored in buckets of 100 addresses each
 * - Each bucket is a `Vec<Address>` stored under its bucket index
 * - Total count is tracked separately
 * - When a token is unbound, the last token is moved to fill the gap
 * (swap-remove pattern)
 */
export type TokenBinderStorageKey = {
    tag: "TokenBucket";
    values: readonly [u32];
} | {
    tag: "TotalCount";
    values: void;
};
/**
 * Error codes for the Token Binder system.
 */
export declare const TokenBinderError: {
    /**
     * The specified token was not found in the bound tokens list.
     */
    330: {
        message: string;
    };
    /**
     * Attempted to bind a token that is already bound.
     */
    331: {
        message: string;
    };
    /**
     * Total token capacity (MAX_TOKENS) has been reached.
     */
    332: {
        message: string;
    };
    /**
     * Batch bind size exceeded.
     */
    333: {
        message: string;
    };
    /**
     * The batch contains duplicates.
     */
    334: {
        message: string;
    };
};
export declare const RWAError: {
    /**
     * Indicates an error related to insufficient balance for the operation.
     */
    300: {
        message: string;
    };
    /**
     * Indicates an error when an input must be >= 0.
     */
    301: {
        message: string;
    };
    /**
     * Indicates the address is frozen and cannot perform operations.
     */
    302: {
        message: string;
    };
    /**
     * Indicates insufficient free tokens (due to partial freezing).
     */
    303: {
        message: string;
    };
    /**
     * Indicates an identity cannot be verified.
     */
    304: {
        message: string;
    };
    /**
     * Indicates the transfer does not comply with the compliance rules.
     */
    305: {
        message: string;
    };
    /**
     * Indicates the mint operation does not comply with the compliance rules.
     */
    306: {
        message: string;
    };
    /**
     * Indicates the compliance contract is not set.
     */
    307: {
        message: string;
    };
    /**
     * Indicates the onchain ID is not set.
     */
    308: {
        message: string;
    };
    /**
     * Indicates the version is not set.
     */
    309: {
        message: string;
    };
    /**
     * Indicates the claim topics and issuers contract is not set.
     */
    310: {
        message: string;
    };
    /**
     * Indicates the identity registry storage contract is not set.
     */
    311: {
        message: string;
    };
    /**
     * Indicates the identity verifier contract is not set.
     */
    312: {
        message: string;
    };
    /**
     * Indicates the old account and new account have different identities.
     */
    313: {
        message: string;
    };
};
/**
 * Storage keys for the data associated with the vault extension
 */
export type VaultStorageKey = {
    tag: "AssetAddress";
    values: void;
} | {
    tag: "VirtualDecimalsOffset";
    values: void;
};
export declare const VaultTokenError: {
    /**
     * Indicates access to uninitialized vault asset address.
     */
    400: {
        message: string;
    };
    /**
     * Indicates that vault asset address is already set.
     */
    401: {
        message: string;
    };
    /**
     * Indicates that vault virtual decimals offset is already set.
     */
    402: {
        message: string;
    };
    /**
     * Indicates the amount is not a valid vault assets value.
     */
    403: {
        message: string;
    };
    /**
     * Indicates the amount is not a valid vault shares value.
     */
    404: {
        message: string;
    };
    /**
     * Attempted to deposit more assets than the max amount for address.
     */
    405: {
        message: string;
    };
    /**
     * Attempted to mint more shares than the max amount for address.
     */
    406: {
        message: string;
    };
    /**
     * Attempted to withdraw more assets than the max amount for address.
     */
    407: {
        message: string;
    };
    /**
     * Attempted to redeem more shares than the max amount for address.
     */
    408: {
        message: string;
    };
    /**
     * Maximum number of decimals offset exceeded
     */
    409: {
        message: string;
    };
    /**
     * Indicates overflow due to mathematical operations
     */
    410: {
        message: string;
    };
};
export interface Client {
    /**
     * Construct and simulate a total_supply transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    total_supply: (options?: {
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
    }) => Promise<AssembledTransaction<i128>>;
    /**
     * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    balance: ({ account }: {
        account: string;
    }, options?: {
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
    }) => Promise<AssembledTransaction<i128>>;
    /**
     * Construct and simulate a allowance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    allowance: ({ owner, spender }: {
        owner: string;
        spender: string;
    }, options?: {
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
    }) => Promise<AssembledTransaction<i128>>;
    /**
     * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    transfer: ({ from, to, amount }: {
        from: string;
        to: string;
        amount: i128;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a transfer_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    transfer_from: ({ spender, from, to, amount }: {
        spender: string;
        from: string;
        to: string;
        amount: i128;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a approve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    approve: ({ owner, spender, amount, live_until_ledger }: {
        owner: string;
        spender: string;
        amount: i128;
        live_until_ledger: u32;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a decimals transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    decimals: (options?: {
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
    }) => Promise<AssembledTransaction<u32>>;
    /**
     * Construct and simulate a name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    name: (options?: {
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
    }) => Promise<AssembledTransaction<string>>;
    /**
     * Construct and simulate a symbol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    symbol: (options?: {
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
    }) => Promise<AssembledTransaction<string>>;
    /**
     * Construct and simulate a allowed transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    allowed: ({ account }: {
        account: string;
    }, options?: {
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
    }) => Promise<AssembledTransaction<boolean>>;
    /**
     * Construct and simulate a allow_user transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    allow_user: ({ user, operator }: {
        user: string;
        operator: string;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a disallow_user transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    disallow_user: ({ user, operator }: {
        user: string;
        operator: string;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a has_role transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    has_role: ({ account, role }: {
        account: string;
        role: string;
    }, options?: {
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
    }) => Promise<AssembledTransaction<Option<u32>>>;
    /**
     * Construct and simulate a get_role_member_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_role_member_count: ({ role }: {
        role: string;
    }, options?: {
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
    }) => Promise<AssembledTransaction<u32>>;
    /**
     * Construct and simulate a get_role_member transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_role_member: ({ role, index }: {
        role: string;
        index: u32;
    }, options?: {
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
    }) => Promise<AssembledTransaction<string>>;
    /**
     * Construct and simulate a get_role_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_role_admin: ({ role }: {
        role: string;
    }, options?: {
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
    }) => Promise<AssembledTransaction<Option<string>>>;
    /**
     * Construct and simulate a get_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_admin: (options?: {
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
    }) => Promise<AssembledTransaction<Option<string>>>;
    /**
     * Construct and simulate a grant_role transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    grant_role: ({ caller, account, role }: {
        caller: string;
        account: string;
        role: string;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a revoke_role transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    revoke_role: ({ caller, account, role }: {
        caller: string;
        account: string;
        role: string;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a renounce_role transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    renounce_role: ({ caller, role }: {
        caller: string;
        role: string;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a renounce_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    renounce_admin: (options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a transfer_admin_role transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    transfer_admin_role: ({ new_admin, live_until_ledger }: {
        new_admin: string;
        live_until_ledger: u32;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a accept_admin_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    accept_admin_transfer: (options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a set_role_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    set_role_admin: ({ role, admin_role }: {
        role: string;
        admin_role: string;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a burn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    burn: ({ from, amount }: {
        from: string;
        amount: i128;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a burn_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    burn_from: ({ spender, from, amount }: {
        spender: string;
        from: string;
        amount: i128;
    }, options?: {
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
    }) => Promise<AssembledTransaction<null>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { admin, manager, initial_supply }: {
        admin: string;
        manager: string;
        initial_supply: i128;
    }, 
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions & Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
    }): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        total_supply: (json: string) => AssembledTransaction<bigint>;
        balance: (json: string) => AssembledTransaction<bigint>;
        allowance: (json: string) => AssembledTransaction<bigint>;
        transfer: (json: string) => AssembledTransaction<null>;
        transfer_from: (json: string) => AssembledTransaction<null>;
        approve: (json: string) => AssembledTransaction<null>;
        decimals: (json: string) => AssembledTransaction<number>;
        name: (json: string) => AssembledTransaction<string>;
        symbol: (json: string) => AssembledTransaction<string>;
        allowed: (json: string) => AssembledTransaction<boolean>;
        allow_user: (json: string) => AssembledTransaction<null>;
        disallow_user: (json: string) => AssembledTransaction<null>;
        has_role: (json: string) => AssembledTransaction<Option<number>>;
        get_role_member_count: (json: string) => AssembledTransaction<number>;
        get_role_member: (json: string) => AssembledTransaction<string>;
        get_role_admin: (json: string) => AssembledTransaction<Option<string>>;
        get_admin: (json: string) => AssembledTransaction<Option<string>>;
        grant_role: (json: string) => AssembledTransaction<null>;
        revoke_role: (json: string) => AssembledTransaction<null>;
        renounce_role: (json: string) => AssembledTransaction<null>;
        renounce_admin: (json: string) => AssembledTransaction<null>;
        transfer_admin_role: (json: string) => AssembledTransaction<null>;
        accept_admin_transfer: (json: string) => AssembledTransaction<null>;
        set_role_admin: (json: string) => AssembledTransaction<null>;
        burn: (json: string) => AssembledTransaction<null>;
        burn_from: (json: string) => AssembledTransaction<null>;
    };
}
