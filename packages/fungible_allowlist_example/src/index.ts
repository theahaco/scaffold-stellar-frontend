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
    contractId: "CBZ42SGH6E4P5CX7NYC6NNVJ4IABJZNGGN4FKO5FGHLH54OU5XR56NYN",
  }
} as const


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
export type AccessControlStorageKey = {tag: "RoleAccounts", values: readonly [RoleAccountKey]} | {tag: "HasRole", values: readonly [string, string]} | {tag: "RoleAccountsCount", values: readonly [string]} | {tag: "RoleAdmin", values: readonly [string]} | {tag: "Admin", values: void} | {tag: "PendingAdmin", values: void};

export const AccessControlError = {
  2000: {message:"Unauthorized"},
  2001: {message:"AdminNotSet"},
  2002: {message:"IndexOutOfBounds"},
  2003: {message:"AdminRoleNotFound"},
  2004: {message:"RoleCountIsNotZero"},
  2005: {message:"RoleNotFound"},
  2006: {message:"AdminAlreadySet"},
  2007: {message:"RoleNotHeld"},
  2008: {message:"RoleIsEmpty"}
}







/**
 * Storage keys for `Ownable` utility.
 */
export type OwnableStorageKey = {tag: "Owner", values: void} | {tag: "PendingOwner", values: void};

export const OwnableError = {
  2100: {message:"OwnerNotSet"},
  2101: {message:"TransferInProgress"},
  2102: {message:"OwnerAlreadySet"}
}




export const RoleTransferError = {
  2200: {message:"NoPendingTransfer"},
  2201: {message:"InvalidLiveUntilLedger"},
  2202: {message:"InvalidPendingAccount"}
}

export const CryptoError = {
  /**
   * The merkle proof length is out of bounds.
   */
  1400: {message:"MerkleProofOutOfBounds"},
  /**
   * The index of the leaf is out of bounds.
   */
  1401: {message:"MerkleIndexOutOfBounds"},
  /**
   * No data in hasher state.
   */
  1402: {message:"HasherEmptyState"}
}

export type Rounding = {tag: "Floor", values: void} | {tag: "Ceil", values: void};

export const SorobanFixedPointError = {
  /**
   * The operation failed because the denominator is 0.
   */
  1500: {message:"ZeroDenominator"},
  /**
   * The operation failed because a phantom overflow occurred.
   */
  1501: {message:"PhantomOverflow"},
  /**
   * The operation failed because the result does not fit in Self.
   */
  1502: {message:"ResultOverflow"}
}

/**
 * Storage keys for the data associated with `MerkleDistributor`
 */
export type MerkleDistributorStorageKey = {tag: "Root", values: void} | {tag: "Claimed", values: readonly [u32]};

export const MerkleDistributorError = {
  /**
   * The merkle root is not set.
   */
  1300: {message:"RootNotSet"},
  /**
   * The provided index was already claimed.
   */
  1301: {message:"IndexAlreadyClaimed"},
  /**
   * The proof is invalid.
   */
  1302: {message:"InvalidProof"}
}



/**
 * Storage key for the pausable state
 */
export type PausableStorageKey = {tag: "Paused", values: void};

export const PausableError = {
  /**
   * The operation failed because the contract is paused.
   */
  1000: {message:"EnforcedPause"},
  /**
   * The operation failed because the contract is not paused.
   */
  1001: {message:"ExpectedPause"}
}



export const UpgradeableError = {
  /**
   * When migration is attempted but not allowed due to upgrade state.
   */
  1100: {message:"MigrationNotAllowed"}
}

/**
 * Storage keys for the data associated with the allowlist extension
 */
export type AllowListStorageKey = {tag: "Allowed", values: readonly [string]};



/**
 * Storage keys for the data associated with the blocklist extension
 */
export type BlockListStorageKey = {tag: "Blocked", values: readonly [string]};





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
export type StorageKey = {tag: "TotalSupply", values: void} | {tag: "Balance", values: readonly [string]} | {tag: "Allowance", values: readonly [AllowanceKey]};


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
export type SACAdminGenericDataKey = {tag: "Sac", values: void};

/**
 * Storage key for accessing the SAC address
 */
export type SACAdminWrapperDataKey = {tag: "Sac", values: void};

export const FungibleTokenError = {
  /**
   * Indicates an error related to the current balance of account from which
   * tokens are expected to be transferred.
   */
  100: {message:"InsufficientBalance"},
  /**
   * Indicates a failure with the allowance mechanism when a given spender
   * doesn't have enough allowance.
   */
  101: {message:"InsufficientAllowance"},
  /**
   * Indicates an invalid value for `live_until_ledger` when setting an
   * allowance.
   */
  102: {message:"InvalidLiveUntilLedger"},
  /**
   * Indicates an error when an input that must be >= 0
   */
  103: {message:"LessThanZero"},
  /**
   * Indicates overflow when adding two values
   */
  104: {message:"MathOverflow"},
  /**
   * Indicates access to uninitialized metadata
   */
  105: {message:"UnsetMetadata"},
  /**
   * Indicates that the operation would have caused `total_supply` to exceed
   * the `cap`.
   */
  106: {message:"ExceededCap"},
  /**
   * Indicates the supplied `cap` is not a valid cap value.
   */
  107: {message:"InvalidCap"},
  /**
   * Indicates the Cap was not set.
   */
  108: {message:"CapNotSet"},
  /**
   * Indicates the SAC address was not set.
   */
  109: {message:"SACNotSet"},
  /**
   * Indicates a SAC address different than expected.
   */
  110: {message:"SACAddressMismatch"},
  /**
   * Indicates a missing function parameter in the SAC contract context.
   */
  111: {message:"SACMissingFnParam"},
  /**
   * Indicates an invalid function parameter in the SAC contract context.
   */
  112: {message:"SACInvalidFnParam"},
  /**
   * The user is not allowed to perform this operation
   */
  113: {message:"UserNotAllowed"},
  /**
   * The user is blocked and cannot perform this operation
   */
  114: {message:"UserBlocked"}
}





/**
 * Storage keys for the data associated with the consecutive extension of
 * `NonFungibleToken`
 */
export type NFTConsecutiveStorageKey = {tag: "Approval", values: readonly [u32]} | {tag: "Owner", values: readonly [u32]} | {tag: "OwnershipBucket", values: readonly [u32]} | {tag: "BurnedToken", values: readonly [u32]};



export interface OwnerTokensKey {
  index: u32;
  owner: string;
}

/**
 * Storage keys for the data associated with the enumerable extension of
 * `NonFungibleToken`
 */
export type NFTEnumerableStorageKey = {tag: "TotalSupply", values: void} | {tag: "OwnerTokens", values: readonly [OwnerTokensKey]} | {tag: "OwnerTokensIndex", values: readonly [u32]} | {tag: "GlobalTokens", values: readonly [u32]} | {tag: "GlobalTokensIndex", values: readonly [u32]};


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
export type NFTRoyaltiesStorageKey = {tag: "DefaultRoyalty", values: void} | {tag: "TokenRoyalty", values: readonly [u32]};





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
export type NFTStorageKey = {tag: "Owner", values: readonly [u32]} | {tag: "Balance", values: readonly [string]} | {tag: "Approval", values: readonly [u32]} | {tag: "ApprovalForAll", values: readonly [string, string]} | {tag: "Metadata", values: void};

export type NFTSequentialStorageKey = {tag: "TokenIdCounter", values: void};

export const NonFungibleTokenError = {
  /**
   * Indicates a non-existent `token_id`.
   */
  200: {message:"NonExistentToken"},
  /**
   * Indicates an error related to the ownership over a particular token.
   * Used in transfers.
   */
  201: {message:"IncorrectOwner"},
  /**
   * Indicates a failure with the `operator`s approval. Used in transfers.
   */
  202: {message:"InsufficientApproval"},
  /**
   * Indicates a failure with the `approver` of a token to be approved. Used
   * in approvals.
   */
  203: {message:"InvalidApprover"},
  /**
   * Indicates an invalid value for `live_until_ledger` when setting
   * approvals.
   */
  204: {message:"InvalidLiveUntilLedger"},
  /**
   * Indicates overflow when adding two values
   */
  205: {message:"MathOverflow"},
  /**
   * Indicates all possible `token_id`s are already in use.
   */
  206: {message:"TokenIDsAreDepleted"},
  /**
   * Indicates an invalid amount to batch mint in `consecutive` extension.
   */
  207: {message:"InvalidAmount"},
  /**
   * Indicates the token does not exist in owner's list.
   */
  208: {message:"TokenNotFoundInOwnerList"},
  /**
   * Indicates the token does not exist in global list.
   */
  209: {message:"TokenNotFoundInGlobalList"},
  /**
   * Indicates access to unset metadata.
   */
  210: {message:"UnsetMetadata"},
  /**
   * Indicates the length of the base URI exceeds the maximum allowed.
   */
  211: {message:"BaseUriMaxLenExceeded"},
  /**
   * Indicates the royalty amount is higher than 10_000 (100%) basis points.
   */
  212: {message:"InvalidRoyaltyAmount"}
}






export interface SigningKey {
  public_key: Buffer;
  scheme: u32;
}

/**
 * Storage keys for claim issuer key management.
 */
export type ClaimIssuerStorageKey = {tag: "Topics", values: readonly [u32]} | {tag: "Pairs", values: readonly [SigningKey]} | {tag: "RevokedClaim", values: readonly [Buffer]} | {tag: "ClaimNonce", values: readonly [string, u32]};


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





export const ClaimIssuerError = {
  /**
   * Signature data length does not match the expected scheme.
   */
  350: {message:"SigDataMismatch"},
  /**
   * The provided key is empty.
   */
  351: {message:"KeyIsEmpty"},
  /**
   * The key is already allowed for the specified topic.
   */
  352: {message:"KeyAlreadyAllowed"},
  /**
   * The specified key was not found in the allowed keys.
   */
  353: {message:"KeyNotFound"},
  /**
   * The claim issuer is not allowed to sign claims about the specified
   * claim topic.
   */
  354: {message:"NotAllowed"},
  /**
   * Maximum limit exceeded (keys per topic or registries per key).
   */
  355: {message:"LimitExceeded"},
  /**
   * No signing keys found for the specified claim topic.
   */
  356: {message:"NoKeysForTopic"},
  /**
   * Invalid claim data encoding.
   */
  357: {message:"InvalidClaimDataExpiration"},
  /**
   * Recovery of the Secp256k1 public key failed.
   */
  358: {message:"Secp256k1RecoveryFailed"},
  /**
   * Indicates overflow when adding two values.
   */
  359: {message:"MathOverflow"}
}

/**
 * Storage keys for the data associated with the claim topics and issuers
 * extension
 */
export type ClaimTopicsAndIssuersStorageKey = {tag: "ClaimTopics", values: void} | {tag: "TrustedIssuers", values: void} | {tag: "IssuerClaimTopics", values: readonly [string]} | {tag: "ClaimTopicIssuers", values: readonly [u32]};

export const ClaimTopicsAndIssuersError = {
  /**
   * Indicates a non-existent claim topic.
   */
  370: {message:"ClaimTopicDoesNotExist"},
  /**
   * Indicates a non-existent trusted issuer.
   */
  371: {message:"IssuerDoesNotExist"},
  /**
   * Indicates a claim topic already exists.
   */
  372: {message:"ClaimTopicAlreadyExists"},
  /**
   * Indicates a trusted issuer already exists.
   */
  373: {message:"IssuerAlreadyExists"},
  /**
   * Indicates max claim topics limit is reached.
   */
  374: {message:"MaxClaimTopicsLimitReached"},
  /**
   * Indicates max trusted issuers limit is reached.
   */
  375: {message:"MaxIssuersLimitReached"},
  /**
   * Indicates claim topics set provided for the issuer cannot be empty.
   */
  376: {message:"ClaimTopicsSetCannotBeEmpty"}
}






/**
 * Storage keys for the modular compliance contract.
 */
export type ComplianceDataKey = {tag: "HookModules", values: readonly [ComplianceHook]};

/**
 * Hook types for modular compliance system.
 * 
 * Each hook type represents a specific event or validation point
 * where compliance modules can be executed.
 */
export type ComplianceHook = {tag: "Transferred", values: void} | {tag: "Created", values: void} | {tag: "Destroyed", values: void} | {tag: "CanTransfer", values: void} | {tag: "CanCreate", values: void};

export const ComplianceError = {
  /**
   * Indicates a module is already registered for this hook.
   */
  360: {message:"ModuleAlreadyRegistered"},
  /**
   * Indicates a module is not registered for this hook.
   */
  361: {message:"ModuleNotRegistered"},
  /**
   * Indicates a module bound is exceeded.
   */
  362: {message:"ModuleBoundExceeded"},
  /**
   * Indicates a token is not bound to this compliance contract.
   */
  363: {message:"TokenNotBound"}
}




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
export type DocumentStorageKey = {tag: "Index", values: readonly [Buffer]} | {tag: "Bucket", values: readonly [u32]} | {tag: "Count", values: void};

/**
 * Error codes for document management operations.
 */
export const DocumentError = {
  /**
   * The specified document was not found.
   */
  380: {message:"DocumentNotFound"},
  /**
   * Maximum number of documents has been reached.
   */
  381: {message:"MaxDocumentsReached"},
  /**
   * The URI exceeds the maximum allowed length.
   */
  382: {message:"UriTooLong"}
}




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
export type ClaimsStorageKey = {tag: "Claim", values: readonly [Buffer]} | {tag: "ClaimsByTopic", values: readonly [u32]};

export const ClaimsError = {
  /**
   * Claim  ID does not exist.
   */
  340: {message:"ClaimNotFound"},
  /**
   * Claim Issuer cannot validate the claim (revocation, signature mismatch,
   * unauthorized signing key, etc.)
   */
  341: {message:"ClaimNotValid"}
}




/**
 * Represents the type of identity holder
 */
export type IdentityType = {tag: "Individual", values: void} | {tag: "Organization", values: void};

/**
 * Represents different types of country relationships for individuals
 * ISO 3166-1 numeric country code
 */
export type IndividualCountryRelation = {tag: "Residence", values: readonly [u32]} | {tag: "Citizenship", values: readonly [u32]} | {tag: "SourceOfFunds", values: readonly [u32]} | {tag: "TaxResidency", values: readonly [u32]} | {tag: "Custom", values: readonly [string, u32]};

/**
 * Represents different types of country relationships for organizations
 */
export type OrganizationCountryRelation = {tag: "Incorporation", values: readonly [u32]} | {tag: "OperatingJurisdiction", values: readonly [u32]} | {tag: "TaxJurisdiction", values: readonly [u32]} | {tag: "SourceOfFunds", values: readonly [u32]} | {tag: "Custom", values: readonly [string, u32]};

/**
 * Unified country relationship that can be either individual or organizational
 */
export type CountryRelation = {tag: "Individual", values: readonly [IndividualCountryRelation]} | {tag: "Organization", values: readonly [OrganizationCountryRelation]};


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
export type IRSStorageKey = {tag: "Identity", values: readonly [string]} | {tag: "IdentityProfile", values: readonly [string]} | {tag: "RecoveredTo", values: readonly [string]};

/**
 * Error codes for the Identity Registry Storage system.
 */
export const IRSError = {
  /**
   * An identity already exists for the given account.
   */
  320: {message:"IdentityOverwrite"},
  /**
   * No identity found for the given account.
   */
  321: {message:"IdentityNotFound"},
  /**
   * Country data not found at the specified index.
   */
  322: {message:"CountryDataNotFound"},
  /**
   * Identity can't be with empty country data list.
   */
  323: {message:"EmptyCountryList"},
  /**
   * The maximum number of country entries has been reached.
   */
  324: {message:"MaxCountryEntriesReached"},
  /**
   * Account has been recovered and cannot be used.
   */
  325: {message:"AccountRecovered"}
}








/**
 * Storage keys for the data associated with `RWA` token
 */
export type IdentityVerifierStorageKey = {tag: "ClaimTopicsAndIssuers", values: void} | {tag: "IdentityRegistryStorage", values: void};

/**
 * Storage keys for the data associated with `RWA` token
 */
export type RWAStorageKey = {tag: "AddressFrozen", values: readonly [string]} | {tag: "FrozenTokens", values: readonly [string]} | {tag: "Compliance", values: void} | {tag: "OnchainId", values: void} | {tag: "Version", values: void} | {tag: "IdentityVerifier", values: void};

/**
 * Storage keys for the token binder system.
 * 
 * - Tokens are stored in buckets of 100 addresses each
 * - Each bucket is a `Vec<Address>` stored under its bucket index
 * - Total count is tracked separately
 * - When a token is unbound, the last token is moved to fill the gap
 * (swap-remove pattern)
 */
export type TokenBinderStorageKey = {tag: "TokenBucket", values: readonly [u32]} | {tag: "TotalCount", values: void};

/**
 * Error codes for the Token Binder system.
 */
export const TokenBinderError = {
  /**
   * The specified token was not found in the bound tokens list.
   */
  330: {message:"TokenNotFound"},
  /**
   * Attempted to bind a token that is already bound.
   */
  331: {message:"TokenAlreadyBound"},
  /**
   * Total token capacity (MAX_TOKENS) has been reached.
   */
  332: {message:"MaxTokensReached"},
  /**
   * Batch bind size exceeded.
   */
  333: {message:"BindBatchTooLarge"},
  /**
   * The batch contains duplicates.
   */
  334: {message:"BindBatchDuplicates"}
}



export const RWAError = {
  /**
   * Indicates an error related to insufficient balance for the operation.
   */
  300: {message:"InsufficientBalance"},
  /**
   * Indicates an error when an input must be >= 0.
   */
  301: {message:"LessThanZero"},
  /**
   * Indicates the address is frozen and cannot perform operations.
   */
  302: {message:"AddressFrozen"},
  /**
   * Indicates insufficient free tokens (due to partial freezing).
   */
  303: {message:"InsufficientFreeTokens"},
  /**
   * Indicates an identity cannot be verified.
   */
  304: {message:"IdentityVerificationFailed"},
  /**
   * Indicates the transfer does not comply with the compliance rules.
   */
  305: {message:"TransferNotCompliant"},
  /**
   * Indicates the mint operation does not comply with the compliance rules.
   */
  306: {message:"MintNotCompliant"},
  /**
   * Indicates the compliance contract is not set.
   */
  307: {message:"ComplianceNotSet"},
  /**
   * Indicates the onchain ID is not set.
   */
  308: {message:"OnchainIdNotSet"},
  /**
   * Indicates the version is not set.
   */
  309: {message:"VersionNotSet"},
  /**
   * Indicates the claim topics and issuers contract is not set.
   */
  310: {message:"ClaimTopicsAndIssuersNotSet"},
  /**
   * Indicates the identity registry storage contract is not set.
   */
  311: {message:"IdentityRegistryStorageNotSet"},
  /**
   * Indicates the identity verifier contract is not set.
   */
  312: {message:"IdentityVerifierNotSet"},
  /**
   * Indicates the old account and new account have different identities.
   */
  313: {message:"IdentityMismatch"}
}











/**
 * Storage keys for the data associated with the vault extension
 */
export type VaultStorageKey = {tag: "AssetAddress", values: void} | {tag: "VirtualDecimalsOffset", values: void};

export const VaultTokenError = {
  /**
   * Indicates access to uninitialized vault asset address.
   */
  400: {message:"VaultAssetAddressNotSet"},
  /**
   * Indicates that vault asset address is already set.
   */
  401: {message:"VaultAssetAddressAlreadySet"},
  /**
   * Indicates that vault virtual decimals offset is already set.
   */
  402: {message:"VaultVirtualDecimalsOffsetAlreadySet"},
  /**
   * Indicates the amount is not a valid vault assets value.
   */
  403: {message:"VaultInvalidAssetsAmount"},
  /**
   * Indicates the amount is not a valid vault shares value.
   */
  404: {message:"VaultInvalidSharesAmount"},
  /**
   * Attempted to deposit more assets than the max amount for address.
   */
  405: {message:"VaultExceededMaxDeposit"},
  /**
   * Attempted to mint more shares than the max amount for address.
   */
  406: {message:"VaultExceededMaxMint"},
  /**
   * Attempted to withdraw more assets than the max amount for address.
   */
  407: {message:"VaultExceededMaxWithdraw"},
  /**
   * Attempted to redeem more shares than the max amount for address.
   */
  408: {message:"VaultExceededMaxRedeem"},
  /**
   * Maximum number of decimals offset exceeded
   */
  409: {message:"VaultMaxDecimalsOffsetExceeded"},
  /**
   * Indicates overflow due to mathematical operations
   */
  410: {message:"MathOverflow"}
}



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
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  balance: ({account}: {account: string}, options?: {
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
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a allowance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  allowance: ({owner, spender}: {owner: string, spender: string}, options?: {
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
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer: ({from, to, amount}: {from: string, to: string, amount: i128}, options?: {
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
   * Construct and simulate a transfer_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer_from: ({spender, from, to, amount}: {spender: string, from: string, to: string, amount: i128}, options?: {
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
   * Construct and simulate a approve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  approve: ({owner, spender, amount, live_until_ledger}: {owner: string, spender: string, amount: i128, live_until_ledger: u32}, options?: {
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
  }) => Promise<AssembledTransaction<u32>>

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
  }) => Promise<AssembledTransaction<string>>

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
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a allowed transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  allowed: ({account}: {account: string}, options?: {
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
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a allow_user transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  allow_user: ({user, operator}: {user: string, operator: string}, options?: {
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
   * Construct and simulate a disallow_user transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  disallow_user: ({user, operator}: {user: string, operator: string}, options?: {
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
   * Construct and simulate a has_role transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  has_role: ({account, role}: {account: string, role: string}, options?: {
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
  }) => Promise<AssembledTransaction<Option<u32>>>

  /**
   * Construct and simulate a get_role_member_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_role_member_count: ({role}: {role: string}, options?: {
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
  }) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_role_member transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_role_member: ({role, index}: {role: string, index: u32}, options?: {
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
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_role_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_role_admin: ({role}: {role: string}, options?: {
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
  }) => Promise<AssembledTransaction<Option<string>>>

  /**
   * Construct and simulate a grant_role transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  grant_role: ({caller, account, role}: {caller: string, account: string, role: string}, options?: {
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
   * Construct and simulate a revoke_role transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  revoke_role: ({caller, account, role}: {caller: string, account: string, role: string}, options?: {
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
   * Construct and simulate a renounce_role transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  renounce_role: ({caller, role}: {caller: string, role: string}, options?: {
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
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a transfer_admin_role transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer_admin_role: ({new_admin, live_until_ledger}: {new_admin: string, live_until_ledger: u32}, options?: {
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
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_role_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_role_admin: ({role, admin_role}: {role: string, admin_role: string}, options?: {
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
   * Construct and simulate a burn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  burn: ({from, amount}: {from: string, amount: i128}, options?: {
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
   * Construct and simulate a burn_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  burn_from: ({spender, from, amount}: {spender: string, from: string, amount: i128}, options?: {
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
        {admin, manager, initial_supply}: {admin: string, manager: string, initial_supply: i128},
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
    return ContractClient.deploy({admin, manager, initial_supply}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAMAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAHbWFuYWdlcgAAAAATAAAAAAAAAA5pbml0aWFsX3N1cHBseQAAAAAACwAAAAA=",
        "AAAAAAAAAAAAAAAMdG90YWxfc3VwcGx5AAAAAAAAAAEAAAAL",
        "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAABAAAAAAAAAAdhY2NvdW50AAAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAAJYWxsb3dhbmNlAAAAAAAAAgAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAdzcGVuZGVyAAAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAADAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
        "AAAAAAAAAAAAAAANdHJhbnNmZXJfZnJvbQAAAAAAAAQAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAHYXBwcm92ZQAAAAAEAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAABFsaXZlX3VudGlsX2xlZGdlcgAAAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAAIZGVjaW1hbHMAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAEbmFtZQAAAAAAAAABAAAAEA==",
        "AAAAAAAAAAAAAAAGc3ltYm9sAAAAAAAAAAAAAQAAABA=",
        "AAAAAAAAAAAAAAAHYWxsb3dlZAAAAAABAAAAAAAAAAdhY2NvdW50AAAAABMAAAABAAAAAQ==",
        "AAAAAAAAAAAAAAAKYWxsb3dfdXNlcgAAAAAAAgAAAAAAAAAEdXNlcgAAABMAAAAAAAAACG9wZXJhdG9yAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAANZGlzYWxsb3dfdXNlcgAAAAAAAAIAAAAAAAAABHVzZXIAAAATAAAAAAAAAAhvcGVyYXRvcgAAABMAAAAA",
        "AAAAAAAAAAAAAAAIaGFzX3JvbGUAAAACAAAAAAAAAAdhY2NvdW50AAAAABMAAAAAAAAABHJvbGUAAAARAAAAAQAAA+gAAAAE",
        "AAAAAAAAAAAAAAAVZ2V0X3JvbGVfbWVtYmVyX2NvdW50AAAAAAAAAQAAAAAAAAAEcm9sZQAAABEAAAABAAAABA==",
        "AAAAAAAAAAAAAAAPZ2V0X3JvbGVfbWVtYmVyAAAAAAIAAAAAAAAABHJvbGUAAAARAAAAAAAAAAVpbmRleAAAAAAAAAQAAAABAAAAEw==",
        "AAAAAAAAAAAAAAAOZ2V0X3JvbGVfYWRtaW4AAAAAAAEAAAAAAAAABHJvbGUAAAARAAAAAQAAA+gAAAAR",
        "AAAAAAAAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAPoAAAAEw==",
        "AAAAAAAAAAAAAAAKZ3JhbnRfcm9sZQAAAAAAAwAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAdhY2NvdW50AAAAABMAAAAAAAAABHJvbGUAAAARAAAAAA==",
        "AAAAAAAAAAAAAAALcmV2b2tlX3JvbGUAAAAAAwAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAdhY2NvdW50AAAAABMAAAAAAAAABHJvbGUAAAARAAAAAA==",
        "AAAAAAAAAAAAAAANcmVub3VuY2Vfcm9sZQAAAAAAAAIAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAEcm9sZQAAABEAAAAA",
        "AAAAAAAAAAAAAAAOcmVub3VuY2VfYWRtaW4AAAAAAAAAAAAA",
        "AAAAAAAAAAAAAAATdHJhbnNmZXJfYWRtaW5fcm9sZQAAAAACAAAAAAAAAAluZXdfYWRtaW4AAAAAAAATAAAAAAAAABFsaXZlX3VudGlsX2xlZGdlcgAAAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAAVYWNjZXB0X2FkbWluX3RyYW5zZmVyAAAAAAAAAAAAAAA=",
        "AAAAAAAAAAAAAAAOc2V0X3JvbGVfYWRtaW4AAAAAAAIAAAAAAAAABHJvbGUAAAARAAAAAAAAAAphZG1pbl9yb2xlAAAAAAARAAAAAA==",
        "AAAAAAAAAAAAAAAEYnVybgAAAAIAAAAAAAAABGZyb20AAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAJYnVybl9mcm9tAAAAAAAAAwAAAAAAAAAHc3BlbmRlcgAAAAATAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
        "AAAAAQAAADFTdG9yYWdlIGtleSBmb3IgZW51bWVyYXRpb24gb2YgYWNjb3VudHMgcGVyIHJvbGUuAAAAAAAAAAAAAA5Sb2xlQWNjb3VudEtleQAAAAAAAgAAAAAAAAAFaW5kZXgAAAAAAAAEAAAAAAAAAARyb2xlAAAAEQ==",
        "AAAAAgAAADxTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgYWNjZXNzIGNvbnRyb2wAAAAAAAAAF0FjY2Vzc0NvbnRyb2xTdG9yYWdlS2V5AAAAAAYAAAABAAAAAAAAAAxSb2xlQWNjb3VudHMAAAABAAAH0AAAAA5Sb2xlQWNjb3VudEtleQAAAAAAAQAAAAAAAAAHSGFzUm9sZQAAAAACAAAAEwAAABEAAAABAAAAAAAAABFSb2xlQWNjb3VudHNDb3VudAAAAAAAAAEAAAARAAAAAQAAAAAAAAAJUm9sZUFkbWluAAAAAAAAAQAAABEAAAAAAAAAAAAAAAVBZG1pbgAAAAAAAAAAAAAAAAAADFBlbmRpbmdBZG1pbg==",
        "AAAABAAAAAAAAAAAAAAAEkFjY2Vzc0NvbnRyb2xFcnJvcgAAAAAACQAAAAAAAAAMVW5hdXRob3JpemVkAAAH0AAAAAAAAAALQWRtaW5Ob3RTZXQAAAAH0QAAAAAAAAAQSW5kZXhPdXRPZkJvdW5kcwAAB9IAAAAAAAAAEUFkbWluUm9sZU5vdEZvdW5kAAAAAAAH0wAAAAAAAAASUm9sZUNvdW50SXNOb3RaZXJvAAAAAAfUAAAAAAAAAAxSb2xlTm90Rm91bmQAAAfVAAAAAAAAAA9BZG1pbkFscmVhZHlTZXQAAAAH1gAAAAAAAAALUm9sZU5vdEhlbGQAAAAH1wAAAAAAAAALUm9sZUlzRW1wdHkAAAAH2A==",
        "AAAABQAAACVFdmVudCBlbWl0dGVkIHdoZW4gYSByb2xlIGlzIGdyYW50ZWQuAAAAAAAAAAAAAAtSb2xlR3JhbnRlZAAAAAABAAAADHJvbGVfZ3JhbnRlZAAAAAMAAAAAAAAABHJvbGUAAAARAAAAAQAAAAAAAAAHYWNjb3VudAAAAAATAAAAAQAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAI=",
        "AAAABQAAACVFdmVudCBlbWl0dGVkIHdoZW4gYSByb2xlIGlzIHJldm9rZWQuAAAAAAAAAAAAAAtSb2xlUmV2b2tlZAAAAAABAAAADHJvbGVfcmV2b2tlZAAAAAMAAAAAAAAABHJvbGUAAAARAAAAAQAAAAAAAAAHYWNjb3VudAAAAAATAAAAAQAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAI=",
        "AAAABQAAACtFdmVudCBlbWl0dGVkIHdoZW4gYSByb2xlIGFkbWluIGlzIGNoYW5nZWQuAAAAAAAAAAAQUm9sZUFkbWluQ2hhbmdlZAAAAAEAAAAScm9sZV9hZG1pbl9jaGFuZ2VkAAAAAAADAAAAAAAAAARyb2xlAAAAEQAAAAEAAAAAAAAAE3ByZXZpb3VzX2FkbWluX3JvbGUAAAAAEQAAAAAAAAAAAAAADm5ld19hZG1pbl9yb2xlAAAAAAARAAAAAAAAAAI=",
        "AAAABQAAADJFdmVudCBlbWl0dGVkIHdoZW4gYW4gYWRtaW4gdHJhbnNmZXIgaXMgaW5pdGlhdGVkLgAAAAAAAAAAABZBZG1pblRyYW5zZmVySW5pdGlhdGVkAAAAAAABAAAAGGFkbWluX3RyYW5zZmVyX2luaXRpYXRlZAAAAAMAAAAAAAAADWN1cnJlbnRfYWRtaW4AAAAAAAATAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAAAAAAAAAAAEWxpdmVfdW50aWxfbGVkZ2VyAAAAAAAABAAAAAAAAAAC",
        "AAAABQAAADJFdmVudCBlbWl0dGVkIHdoZW4gYW4gYWRtaW4gdHJhbnNmZXIgaXMgY29tcGxldGVkLgAAAAAAAAAAABZBZG1pblRyYW5zZmVyQ29tcGxldGVkAAAAAAABAAAAGGFkbWluX3RyYW5zZmVyX2NvbXBsZXRlZAAAAAIAAAAAAAAACW5ld19hZG1pbgAAAAAAABMAAAABAAAAAAAAAA5wcmV2aW91c19hZG1pbgAAAAAAEwAAAAAAAAAC",
        "AAAABQAAAC9FdmVudCBlbWl0dGVkIHdoZW4gdGhlIGFkbWluIHJvbGUgaXMgcmVub3VuY2VkLgAAAAAAAAAADkFkbWluUmVub3VuY2VkAAAAAAABAAAAD2FkbWluX3Jlbm91bmNlZAAAAAABAAAAAAAAAAVhZG1pbgAAAAAAABMAAAABAAAAAg==",
        "AAAAAgAAACNTdG9yYWdlIGtleXMgZm9yIGBPd25hYmxlYCB1dGlsaXR5LgAAAAAAAAAAEU93bmFibGVTdG9yYWdlS2V5AAAAAAAAAgAAAAAAAAAAAAAABU93bmVyAAAAAAAAAAAAAAAAAAAMUGVuZGluZ093bmVy",
        "AAAABAAAAAAAAAAAAAAADE93bmFibGVFcnJvcgAAAAMAAAAAAAAAC093bmVyTm90U2V0AAAACDQAAAAAAAAAElRyYW5zZmVySW5Qcm9ncmVzcwAAAAAINQAAAAAAAAAPT3duZXJBbHJlYWR5U2V0AAAACDY=",
        "AAAABQAAADZFdmVudCBlbWl0dGVkIHdoZW4gYW4gb3duZXJzaGlwIHRyYW5zZmVyIGlzIGluaXRpYXRlZC4AAAAAAAAAAAART3duZXJzaGlwVHJhbnNmZXIAAAAAAAABAAAAEm93bmVyc2hpcF90cmFuc2ZlcgAAAAAAAwAAAAAAAAAJb2xkX293bmVyAAAAAAAAEwAAAAAAAAAAAAAACW5ld19vd25lcgAAAAAAABMAAAAAAAAAAAAAABFsaXZlX3VudGlsX2xlZGdlcgAAAAAAAAQAAAAAAAAAAg==",
        "AAAABQAAADZFdmVudCBlbWl0dGVkIHdoZW4gYW4gb3duZXJzaGlwIHRyYW5zZmVyIGlzIGNvbXBsZXRlZC4AAAAAAAAAAAAaT3duZXJzaGlwVHJhbnNmZXJDb21wbGV0ZWQAAAAAAAEAAAAcb3duZXJzaGlwX3RyYW5zZmVyX2NvbXBsZXRlZAAAAAEAAAAAAAAACW5ld19vd25lcgAAAAAAABMAAAAAAAAAAg==",
        "AAAABQAAACpFdmVudCBlbWl0dGVkIHdoZW4gb3duZXJzaGlwIGlzIHJlbm91bmNlZC4AAAAAAAAAAAAST3duZXJzaGlwUmVub3VuY2VkAAAAAAABAAAAE293bmVyc2hpcF9yZW5vdW5jZWQAAAAAAQAAAAAAAAAJb2xkX293bmVyAAAAAAAAEwAAAAAAAAAC",
        "AAAABAAAAAAAAAAAAAAAEVJvbGVUcmFuc2ZlckVycm9yAAAAAAAAAwAAAAAAAAARTm9QZW5kaW5nVHJhbnNmZXIAAAAAAAiYAAAAAAAAABZJbnZhbGlkTGl2ZVVudGlsTGVkZ2VyAAAAAAiZAAAAAAAAABVJbnZhbGlkUGVuZGluZ0FjY291bnQAAAAAAAia",
        "AAAABAAAAAAAAAAAAAAAC0NyeXB0b0Vycm9yAAAAAAMAAAApVGhlIG1lcmtsZSBwcm9vZiBsZW5ndGggaXMgb3V0IG9mIGJvdW5kcy4AAAAAAAAWTWVya2xlUHJvb2ZPdXRPZkJvdW5kcwAAAAAFeAAAACdUaGUgaW5kZXggb2YgdGhlIGxlYWYgaXMgb3V0IG9mIGJvdW5kcy4AAAAAFk1lcmtsZUluZGV4T3V0T2ZCb3VuZHMAAAAABXkAAAAYTm8gZGF0YSBpbiBoYXNoZXIgc3RhdGUuAAAAEEhhc2hlckVtcHR5U3RhdGUAAAV6",
        "AAAAAgAAAAAAAAAAAAAACFJvdW5kaW5nAAAAAgAAAAAAAAAAAAAABUZsb29yAAAAAAAAAAAAAAAAAAAEQ2VpbA==",
        "AAAABAAAAAAAAAAAAAAAFlNvcm9iYW5GaXhlZFBvaW50RXJyb3IAAAAAAAMAAAAyVGhlIG9wZXJhdGlvbiBmYWlsZWQgYmVjYXVzZSB0aGUgZGVub21pbmF0b3IgaXMgMC4AAAAAAA9aZXJvRGVub21pbmF0b3IAAAAF3AAAADlUaGUgb3BlcmF0aW9uIGZhaWxlZCBiZWNhdXNlIGEgcGhhbnRvbSBvdmVyZmxvdyBvY2N1cnJlZC4AAAAAAAAPUGhhbnRvbU92ZXJmbG93AAAABd0AAAA9VGhlIG9wZXJhdGlvbiBmYWlsZWQgYmVjYXVzZSB0aGUgcmVzdWx0IGRvZXMgbm90IGZpdCBpbiBTZWxmLgAAAAAAAA5SZXN1bHRPdmVyZmxvdwAAAAAF3g==",
        "AAAAAgAAAD1TdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBgTWVya2xlRGlzdHJpYnV0b3JgAAAAAAAAAAAAABtNZXJrbGVEaXN0cmlidXRvclN0b3JhZ2VLZXkAAAAAAgAAAAAAAAAoVGhlIE1lcmtsZSByb290IG9mIHRoZSBkaXN0cmlidXRpb24gdHJlZQAAAARSb290AAAAAQAAACNNYXBzIGFuIGluZGV4IHRvIGl0cyBjbGFpbWVkIHN0YXR1cwAAAAAHQ2xhaW1lZAAAAAABAAAABA==",
        "AAAABAAAAAAAAAAAAAAAFk1lcmtsZURpc3RyaWJ1dG9yRXJyb3IAAAAAAAMAAAAbVGhlIG1lcmtsZSByb290IGlzIG5vdCBzZXQuAAAAAApSb290Tm90U2V0AAAAAAUUAAAAJ1RoZSBwcm92aWRlZCBpbmRleCB3YXMgYWxyZWFkeSBjbGFpbWVkLgAAAAATSW5kZXhBbHJlYWR5Q2xhaW1lZAAAAAUVAAAAFVRoZSBwcm9vZiBpcyBpbnZhbGlkLgAAAAAAAAxJbnZhbGlkUHJvb2YAAAUW",
        "AAAABQAAACpFdmVudCBlbWl0dGVkIHdoZW4gdGhlIG1lcmtsZSByb290IGlzIHNldC4AAAAAAAAAAAAHU2V0Um9vdAAAAAABAAAACHNldF9yb290AAAAAQAAAAAAAAAEcm9vdAAAAA4AAAAAAAAAAg==",
        "AAAABQAAACdFdmVudCBlbWl0dGVkIHdoZW4gYW4gaW5kZXggaXMgY2xhaW1lZC4AAAAAAAAAAApTZXRDbGFpbWVkAAAAAAABAAAAC3NldF9jbGFpbWVkAAAAAAEAAAAAAAAABWluZGV4AAAAAAAAAAAAAAAAAAAC",
        "AAAAAgAAACJTdG9yYWdlIGtleSBmb3IgdGhlIHBhdXNhYmxlIHN0YXRlAAAAAAAAAAAAElBhdXNhYmxlU3RvcmFnZUtleQAAAAAAAQAAAAAAAAAySW5kaWNhdGVzIHdoZXRoZXIgdGhlIGNvbnRyYWN0IGlzIGluIHBhdXNlZCBzdGF0ZS4AAAAAAAZQYXVzZWQAAA==",
        "AAAABAAAAAAAAAAAAAAADVBhdXNhYmxlRXJyb3IAAAAAAAACAAAANFRoZSBvcGVyYXRpb24gZmFpbGVkIGJlY2F1c2UgdGhlIGNvbnRyYWN0IGlzIHBhdXNlZC4AAAANRW5mb3JjZWRQYXVzZQAAAAAAA+gAAAA4VGhlIG9wZXJhdGlvbiBmYWlsZWQgYmVjYXVzZSB0aGUgY29udHJhY3QgaXMgbm90IHBhdXNlZC4AAAANRXhwZWN0ZWRQYXVzZQAAAAAAA+k=",
        "AAAABQAAACpFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGNvbnRyYWN0IGlzIHBhdXNlZC4AAAAAAAAAAAAGUGF1c2VkAAAAAAABAAAABnBhdXNlZAAAAAAAAAAAAAI=",
        "AAAABQAAACxFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGNvbnRyYWN0IGlzIHVucGF1c2VkLgAAAAAAAAAIVW5wYXVzZWQAAAABAAAACHVucGF1c2VkAAAAAAAAAAI=",
        "AAAABAAAAAAAAAAAAAAAEFVwZ3JhZGVhYmxlRXJyb3IAAAABAAAAQVdoZW4gbWlncmF0aW9uIGlzIGF0dGVtcHRlZCBidXQgbm90IGFsbG93ZWQgZHVlIHRvIHVwZ3JhZGUgc3RhdGUuAAAAAAAAE01pZ3JhdGlvbk5vdEFsbG93ZWQAAAAETA==",
        "AAAAAgAAAEFTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgYWxsb3dsaXN0IGV4dGVuc2lvbgAAAAAAAAAAAAATQWxsb3dMaXN0U3RvcmFnZUtleQAAAAABAAAAAQAAACdTdG9yZXMgdGhlIGFsbG93ZWQgc3RhdHVzIG9mIGFuIGFjY291bnQAAAAAB0FsbG93ZWQAAAAAAQAAABM=",
        "AAAABQAAADhFdmVudCBlbWl0dGVkIHdoZW4gYSB1c2VyIGlzIGFsbG93ZWQgdG8gdHJhbnNmZXIgdG9rZW5zLgAAAAAAAAALVXNlckFsbG93ZWQAAAAAAQAAAAx1c2VyX2FsbG93ZWQAAAABAAAAAAAAAAR1c2VyAAAAEwAAAAEAAAAC",
        "AAAABQAAAEFFdmVudCBlbWl0dGVkIHdoZW4gYSB1c2VyIGlzIGRpc2FsbG93ZWQgZnJvbSB0cmFuc2ZlcnJpbmcgdG9rZW5zLgAAAAAAAAAAAAAOVXNlckRpc2FsbG93ZWQAAAAAAAEAAAAPdXNlcl9kaXNhbGxvd2VkAAAAAAEAAAAAAAAABHVzZXIAAAATAAAAAQAAAAI=",
        "AAAAAgAAAEFTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgYmxvY2tsaXN0IGV4dGVuc2lvbgAAAAAAAAAAAAATQmxvY2tMaXN0U3RvcmFnZUtleQAAAAABAAAAAQAAACdTdG9yZXMgdGhlIGJsb2NrZWQgc3RhdHVzIG9mIGFuIGFjY291bnQAAAAAB0Jsb2NrZWQAAAAAAQAAABM=",
        "AAAABQAAAD5FdmVudCBlbWl0dGVkIHdoZW4gYSB1c2VyIGlzIGJsb2NrZWQgZnJvbSB0cmFuc2ZlcnJpbmcgdG9rZW5zLgAAAAAAAAAAAAtVc2VyQmxvY2tlZAAAAAABAAAADHVzZXJfYmxvY2tlZAAAAAEAAAAAAAAABHVzZXIAAAATAAAAAQAAAAI=",
        "AAAABQAAAEZFdmVudCBlbWl0dGVkIHdoZW4gYSB1c2VyIGlzIHVuYmxvY2tlZCBhbmQgYWxsb3dlZCB0byB0cmFuc2ZlciB0b2tlbnMuAAAAAAAAAAAADVVzZXJVbmJsb2NrZWQAAAAAAAABAAAADnVzZXJfdW5ibG9ja2VkAAAAAAABAAAAAAAAAAR1c2VyAAAAEwAAAAEAAAAC",
        "AAAABQAAACVFdmVudCBlbWl0dGVkIHdoZW4gdG9rZW5zIGFyZSBidXJuZWQuAAAAAAAAAAAAAARCdXJuAAAAAQAAAARidXJuAAAAAgAAAAAAAAAEZnJvbQAAABMAAAABAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAAg==",
        "AAAAAQAAACpTdG9yYWdlIGtleSB0aGF0IG1hcHMgdG8gW2BBbGxvd2FuY2VEYXRhYF0AAAAAAAAAAAAMQWxsb3dhbmNlS2V5AAAAAgAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAdzcGVuZGVyAAAAABM=",
        "AAAAAQAAAINTdG9yYWdlIGNvbnRhaW5lciBmb3IgdGhlIGFtb3VudCBvZiB0b2tlbnMgZm9yIHdoaWNoIGFuIGFsbG93YW5jZSBpcyBncmFudGVkCmFuZCB0aGUgbGVkZ2VyIG51bWJlciBhdCB3aGljaCB0aGlzIGFsbG93YW5jZSBleHBpcmVzLgAAAAAAAAAADUFsbG93YW5jZURhdGEAAAAAAAACAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAEWxpdmVfdW50aWxfbGVkZ2VyAAAAAAAABA==",
        "AAAAAgAAADlTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBgRnVuZ2libGVUb2tlbmAAAAAAAAAAAAAAClN0b3JhZ2VLZXkAAAAAAAMAAAAAAAAAAAAAAAtUb3RhbFN1cHBseQAAAAABAAAAAAAAAAdCYWxhbmNlAAAAAAEAAAATAAAAAQAAAAAAAAAJQWxsb3dhbmNlAAAAAAAAAQAAB9AAAAAMQWxsb3dhbmNlS2V5",
        "AAAAAQAAACRTdG9yYWdlIGNvbnRhaW5lciBmb3IgdG9rZW4gbWV0YWRhdGEAAAAAAAAACE1ldGFkYXRhAAAAAwAAAAAAAAAIZGVjaW1hbHMAAAAEAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAGc3ltYm9sAAAAAAAQ",
        "AAAAAgAAAClTdG9yYWdlIGtleSBmb3IgYWNjZXNzaW5nIHRoZSBTQUMgYWRkcmVzcwAAAAAAAAAAAAAWU0FDQWRtaW5HZW5lcmljRGF0YUtleQAAAAAAAQAAAAAAAAAAAAAAA1NhYwA=",
        "AAAAAgAAAClTdG9yYWdlIGtleSBmb3IgYWNjZXNzaW5nIHRoZSBTQUMgYWRkcmVzcwAAAAAAAAAAAAAWU0FDQWRtaW5XcmFwcGVyRGF0YUtleQAAAAAAAQAAAAAAAAAAAAAAA1NhYwA=",
        "AAAABAAAAAAAAAAAAAAAEkZ1bmdpYmxlVG9rZW5FcnJvcgAAAAAADwAAAG5JbmRpY2F0ZXMgYW4gZXJyb3IgcmVsYXRlZCB0byB0aGUgY3VycmVudCBiYWxhbmNlIG9mIGFjY291bnQgZnJvbSB3aGljaAp0b2tlbnMgYXJlIGV4cGVjdGVkIHRvIGJlIHRyYW5zZmVycmVkLgAAAAAAE0luc3VmZmljaWVudEJhbGFuY2UAAAAAZAAAAGRJbmRpY2F0ZXMgYSBmYWlsdXJlIHdpdGggdGhlIGFsbG93YW5jZSBtZWNoYW5pc20gd2hlbiBhIGdpdmVuIHNwZW5kZXIKZG9lc24ndCBoYXZlIGVub3VnaCBhbGxvd2FuY2UuAAAAFUluc3VmZmljaWVudEFsbG93YW5jZQAAAAAAAGUAAABNSW5kaWNhdGVzIGFuIGludmFsaWQgdmFsdWUgZm9yIGBsaXZlX3VudGlsX2xlZGdlcmAgd2hlbiBzZXR0aW5nIGFuCmFsbG93YW5jZS4AAAAAAAAWSW52YWxpZExpdmVVbnRpbExlZGdlcgAAAAAAZgAAADJJbmRpY2F0ZXMgYW4gZXJyb3Igd2hlbiBhbiBpbnB1dCB0aGF0IG11c3QgYmUgPj0gMAAAAAAADExlc3NUaGFuWmVybwAAAGcAAAApSW5kaWNhdGVzIG92ZXJmbG93IHdoZW4gYWRkaW5nIHR3byB2YWx1ZXMAAAAAAAAMTWF0aE92ZXJmbG93AAAAaAAAACpJbmRpY2F0ZXMgYWNjZXNzIHRvIHVuaW5pdGlhbGl6ZWQgbWV0YWRhdGEAAAAAAA1VbnNldE1ldGFkYXRhAAAAAAAAaQAAAFJJbmRpY2F0ZXMgdGhhdCB0aGUgb3BlcmF0aW9uIHdvdWxkIGhhdmUgY2F1c2VkIGB0b3RhbF9zdXBwbHlgIHRvIGV4Y2VlZAp0aGUgYGNhcGAuAAAAAAALRXhjZWVkZWRDYXAAAAAAagAAADZJbmRpY2F0ZXMgdGhlIHN1cHBsaWVkIGBjYXBgIGlzIG5vdCBhIHZhbGlkIGNhcCB2YWx1ZS4AAAAAAApJbnZhbGlkQ2FwAAAAAABrAAAAHkluZGljYXRlcyB0aGUgQ2FwIHdhcyBub3Qgc2V0LgAAAAAACUNhcE5vdFNldAAAAAAAAGwAAAAmSW5kaWNhdGVzIHRoZSBTQUMgYWRkcmVzcyB3YXMgbm90IHNldC4AAAAAAAlTQUNOb3RTZXQAAAAAAABtAAAAMEluZGljYXRlcyBhIFNBQyBhZGRyZXNzIGRpZmZlcmVudCB0aGFuIGV4cGVjdGVkLgAAABJTQUNBZGRyZXNzTWlzbWF0Y2gAAAAAAG4AAABDSW5kaWNhdGVzIGEgbWlzc2luZyBmdW5jdGlvbiBwYXJhbWV0ZXIgaW4gdGhlIFNBQyBjb250cmFjdCBjb250ZXh0LgAAAAARU0FDTWlzc2luZ0ZuUGFyYW0AAAAAAABvAAAAREluZGljYXRlcyBhbiBpbnZhbGlkIGZ1bmN0aW9uIHBhcmFtZXRlciBpbiB0aGUgU0FDIGNvbnRyYWN0IGNvbnRleHQuAAAAEVNBQ0ludmFsaWRGblBhcmFtAAAAAAAAcAAAADFUaGUgdXNlciBpcyBub3QgYWxsb3dlZCB0byBwZXJmb3JtIHRoaXMgb3BlcmF0aW9uAAAAAAAADlVzZXJOb3RBbGxvd2VkAAAAAABxAAAANVRoZSB1c2VyIGlzIGJsb2NrZWQgYW5kIGNhbm5vdCBwZXJmb3JtIHRoaXMgb3BlcmF0aW9uAAAAAAAAC1VzZXJCbG9ja2VkAAAAAHI=",
        "AAAABQAAADxFdmVudCBlbWl0dGVkIHdoZW4gdG9rZW5zIGFyZSB0cmFuc2ZlcnJlZCBiZXR3ZWVuIGFkZHJlc3Nlcy4AAAAAAAAACFRyYW5zZmVyAAAAAQAAAAh0cmFuc2ZlcgAAAAMAAAAAAAAABGZyb20AAAATAAAAAQAAAAAAAAACdG8AAAAAABMAAAABAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAAg==",
        "AAAABQAAACxFdmVudCBlbWl0dGVkIHdoZW4gYW4gYWxsb3dhbmNlIGlzIGFwcHJvdmVkLgAAAAAAAAAHQXBwcm92ZQAAAAABAAAAB2FwcHJvdmUAAAAABAAAAAAAAAAFb3duZXIAAAAAAAATAAAAAQAAAAAAAAAHc3BlbmRlcgAAAAATAAAAAQAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAAAAAARbGl2ZV91bnRpbF9sZWRnZXIAAAAAAAAEAAAAAAAAAAI=",
        "AAAABQAAACVFdmVudCBlbWl0dGVkIHdoZW4gdG9rZW5zIGFyZSBtaW50ZWQuAAAAAAAAAAAAAARNaW50AAAAAQAAAARtaW50AAAAAgAAAAAAAAACdG8AAAAAABMAAAABAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAAg==",
        "AAAABQAAACVFdmVudCBlbWl0dGVkIHdoZW4gYSB0b2tlbiBpcyBidXJuZWQuAAAAAAAAAAAAAARCdXJuAAAAAQAAAARidXJuAAAAAgAAAAAAAAAEZnJvbQAAABMAAAABAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAAAAAAAAg==",
        "AAAAAgAAAFlTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgY29uc2VjdXRpdmUgZXh0ZW5zaW9uIG9mCmBOb25GdW5naWJsZVRva2VuYAAAAAAAAAAAAAAYTkZUQ29uc2VjdXRpdmVTdG9yYWdlS2V5AAAABAAAAAEAAAAAAAAACEFwcHJvdmFsAAAAAQAAAAQAAAABAAAAAAAAAAVPd25lcgAAAAAAAAEAAAAEAAAAAQAAAAAAAAAPT3duZXJzaGlwQnVja2V0AAAAAAEAAAAEAAAAAQAAAAAAAAALQnVybmVkVG9rZW4AAAAAAQAAAAQ=",
        "AAAABQAAADFFdmVudCBlbWl0dGVkIHdoZW4gY29uc2VjdXRpdmUgdG9rZW5zIGFyZSBtaW50ZWQuAAAAAAAAAAAAAA9Db25zZWN1dGl2ZU1pbnQAAAAAAQAAABBjb25zZWN1dGl2ZV9taW50AAAAAwAAAAAAAAACdG8AAAAAABMAAAABAAAAAAAAAA1mcm9tX3Rva2VuX2lkAAAAAAAABAAAAAAAAAAAAAAAC3RvX3Rva2VuX2lkAAAAAAQAAAAAAAAAAg==",
        "AAAAAQAAAAAAAAAAAAAADk93bmVyVG9rZW5zS2V5AAAAAAACAAAAAAAAAAVpbmRleAAAAAAAAAQAAAAAAAAABW93bmVyAAAAAAAAEw==",
        "AAAAAgAAAFhTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgZW51bWVyYWJsZSBleHRlbnNpb24gb2YKYE5vbkZ1bmdpYmxlVG9rZW5gAAAAAAAAABdORlRFbnVtZXJhYmxlU3RvcmFnZUtleQAAAAAFAAAAAAAAAAAAAAALVG90YWxTdXBwbHkAAAAAAQAAAAAAAAALT3duZXJUb2tlbnMAAAAAAQAAB9AAAAAOT3duZXJUb2tlbnNLZXkAAAAAAAEAAAAAAAAAEE93bmVyVG9rZW5zSW5kZXgAAAABAAAABAAAAAEAAAAAAAAADEdsb2JhbFRva2VucwAAAAEAAAAEAAAAAQAAAAAAAAARR2xvYmFsVG9rZW5zSW5kZXgAAAAAAAABAAAABA==",
        "AAAAAQAAAClTdG9yYWdlIGNvbnRhaW5lciBmb3Igcm95YWx0eSBpbmZvcm1hdGlvbgAAAAAAAAAAAAALUm95YWx0eUluZm8AAAAAAgAAAAAAAAAMYmFzaXNfcG9pbnRzAAAABAAAAAAAAAAIcmVjZWl2ZXIAAAAT",
        "AAAAAgAAAB1TdG9yYWdlIGtleXMgZm9yIHJveWFsdHkgZGF0YQAAAAAAAAAAAAAWTkZUUm95YWx0aWVzU3RvcmFnZUtleQAAAAAAAgAAAAAAAAAAAAAADkRlZmF1bHRSb3lhbHR5AAAAAAABAAAAAAAAAAxUb2tlblJveWFsdHkAAAABAAAABA==",
        "AAAABQAAACpFdmVudCBlbWl0dGVkIHdoZW4gZGVmYXVsdCByb3lhbHR5IGlzIHNldC4AAAAAAAAAAAARU2V0RGVmYXVsdFJveWFsdHkAAAAAAAABAAAAE3NldF9kZWZhdWx0X3JveWFsdHkAAAAAAgAAAAAAAAAIcmVjZWl2ZXIAAAATAAAAAQAAAAAAAAAMYmFzaXNfcG9pbnRzAAAABAAAAAAAAAAC",
        "AAAABQAAAChFdmVudCBlbWl0dGVkIHdoZW4gdG9rZW4gcm95YWx0eSBpcyBzZXQuAAAAAAAAAA9TZXRUb2tlblJveWFsdHkAAAAAAQAAABFzZXRfdG9rZW5fcm95YWx0eQAAAAAAAAMAAAAAAAAACHJlY2VpdmVyAAAAEwAAAAEAAAAAAAAACHRva2VuX2lkAAAABAAAAAEAAAAAAAAADGJhc2lzX3BvaW50cwAAAAQAAAAAAAAAAg==",
        "AAAABQAAACxFdmVudCBlbWl0dGVkIHdoZW4gdG9rZW4gcm95YWx0eSBpcyByZW1vdmVkLgAAAAAAAAASUmVtb3ZlVG9rZW5Sb3lhbHR5AAAAAAABAAAAFHJlbW92ZV90b2tlbl9yb3lhbHR5AAAAAQAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAQAAAAI=",
        "AAAAAQAAAHZTdG9yYWdlIGNvbnRhaW5lciBmb3IgdGhlIHRva2VuIGZvciB3aGljaCBhbiBhcHByb3ZhbCBpcyBncmFudGVkCmFuZCB0aGUgbGVkZ2VyIG51bWJlciBhdCB3aGljaCB0aGlzIGFwcHJvdmFsIGV4cGlyZXMuAAAAAAAAAAAADEFwcHJvdmFsRGF0YQAAAAIAAAAAAAAACGFwcHJvdmVkAAAAEwAAAAAAAAARbGl2ZV91bnRpbF9sZWRnZXIAAAAAAAAE",
        "AAAAAQAAACRTdG9yYWdlIGNvbnRhaW5lciBmb3IgdG9rZW4gbWV0YWRhdGEAAAAAAAAACE1ldGFkYXRhAAAAAwAAAAAAAAAIYmFzZV91cmkAAAAQAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAGc3ltYm9sAAAAAAAQ",
        "AAAAAgAAADxTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBgTm9uRnVuZ2libGVUb2tlbmAAAAAAAAAADU5GVFN0b3JhZ2VLZXkAAAAAAAAFAAAAAQAAAAAAAAAFT3duZXIAAAAAAAABAAAABAAAAAEAAAAAAAAAB0JhbGFuY2UAAAAAAQAAABMAAAABAAAAAAAAAAhBcHByb3ZhbAAAAAEAAAAEAAAAAQAAAAAAAAAOQXBwcm92YWxGb3JBbGwAAAAAAAIAAAATAAAAEwAAAAAAAAAAAAAACE1ldGFkYXRh",
        "AAAAAgAAAAAAAAAAAAAAF05GVFNlcXVlbnRpYWxTdG9yYWdlS2V5AAAAAAEAAAAAAAAAAAAAAA5Ub2tlbklkQ291bnRlcgAA",
        "AAAABAAAAAAAAAAAAAAAFU5vbkZ1bmdpYmxlVG9rZW5FcnJvcgAAAAAAAA0AAAAkSW5kaWNhdGVzIGEgbm9uLWV4aXN0ZW50IGB0b2tlbl9pZGAuAAAAEE5vbkV4aXN0ZW50VG9rZW4AAADIAAAAV0luZGljYXRlcyBhbiBlcnJvciByZWxhdGVkIHRvIHRoZSBvd25lcnNoaXAgb3ZlciBhIHBhcnRpY3VsYXIgdG9rZW4uClVzZWQgaW4gdHJhbnNmZXJzLgAAAAAOSW5jb3JyZWN0T3duZXIAAAAAAMkAAABFSW5kaWNhdGVzIGEgZmFpbHVyZSB3aXRoIHRoZSBgb3BlcmF0b3JgcyBhcHByb3ZhbC4gVXNlZCBpbiB0cmFuc2ZlcnMuAAAAAAAAFEluc3VmZmljaWVudEFwcHJvdmFsAAAAygAAAFVJbmRpY2F0ZXMgYSBmYWlsdXJlIHdpdGggdGhlIGBhcHByb3ZlcmAgb2YgYSB0b2tlbiB0byBiZSBhcHByb3ZlZC4gVXNlZAppbiBhcHByb3ZhbHMuAAAAAAAAD0ludmFsaWRBcHByb3ZlcgAAAADLAAAASkluZGljYXRlcyBhbiBpbnZhbGlkIHZhbHVlIGZvciBgbGl2ZV91bnRpbF9sZWRnZXJgIHdoZW4gc2V0dGluZwphcHByb3ZhbHMuAAAAAAAWSW52YWxpZExpdmVVbnRpbExlZGdlcgAAAAAAzAAAAClJbmRpY2F0ZXMgb3ZlcmZsb3cgd2hlbiBhZGRpbmcgdHdvIHZhbHVlcwAAAAAAAAxNYXRoT3ZlcmZsb3cAAADNAAAANkluZGljYXRlcyBhbGwgcG9zc2libGUgYHRva2VuX2lkYHMgYXJlIGFscmVhZHkgaW4gdXNlLgAAAAAAE1Rva2VuSURzQXJlRGVwbGV0ZWQAAAAAzgAAAEVJbmRpY2F0ZXMgYW4gaW52YWxpZCBhbW91bnQgdG8gYmF0Y2ggbWludCBpbiBgY29uc2VjdXRpdmVgIGV4dGVuc2lvbi4AAAAAAAANSW52YWxpZEFtb3VudAAAAAAAAM8AAAAzSW5kaWNhdGVzIHRoZSB0b2tlbiBkb2VzIG5vdCBleGlzdCBpbiBvd25lcidzIGxpc3QuAAAAABhUb2tlbk5vdEZvdW5kSW5Pd25lckxpc3QAAADQAAAAMkluZGljYXRlcyB0aGUgdG9rZW4gZG9lcyBub3QgZXhpc3QgaW4gZ2xvYmFsIGxpc3QuAAAAAAAZVG9rZW5Ob3RGb3VuZEluR2xvYmFsTGlzdAAAAAAAANEAAAAjSW5kaWNhdGVzIGFjY2VzcyB0byB1bnNldCBtZXRhZGF0YS4AAAAADVVuc2V0TWV0YWRhdGEAAAAAAADSAAAAQUluZGljYXRlcyB0aGUgbGVuZ3RoIG9mIHRoZSBiYXNlIFVSSSBleGNlZWRzIHRoZSBtYXhpbXVtIGFsbG93ZWQuAAAAAAAAFUJhc2VVcmlNYXhMZW5FeGNlZWRlZAAAAAAAANMAAABHSW5kaWNhdGVzIHRoZSByb3lhbHR5IGFtb3VudCBpcyBoaWdoZXIgdGhhbiAxMF8wMDAgKDEwMCUpIGJhc2lzIHBvaW50cy4AAAAAFEludmFsaWRSb3lhbHR5QW1vdW50AAAA1A==",
        "AAAABQAAACpFdmVudCBlbWl0dGVkIHdoZW4gYSB0b2tlbiBpcyB0cmFuc2ZlcnJlZC4AAAAAAAAAAAAIVHJhbnNmZXIAAAABAAAACHRyYW5zZmVyAAAAAwAAAAAAAAAEZnJvbQAAABMAAAABAAAAAAAAAAJ0bwAAAAAAEwAAAAEAAAAAAAAACHRva2VuX2lkAAAABAAAAAAAAAAC",
        "AAAABQAAACpFdmVudCBlbWl0dGVkIHdoZW4gYW4gYXBwcm92YWwgaXMgZ3JhbnRlZC4AAAAAAAAAAAAHQXBwcm92ZQAAAAABAAAAB2FwcHJvdmUAAAAABAAAAAAAAAAIYXBwcm92ZXIAAAATAAAAAQAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAQAAAAAAAAAIYXBwcm92ZWQAAAATAAAAAAAAAAAAAAARbGl2ZV91bnRpbF9sZWRnZXIAAAAAAAAEAAAAAAAAAAI=",
        "AAAABQAAADZFdmVudCBlbWl0dGVkIHdoZW4gYXBwcm92YWwgZm9yIGFsbCB0b2tlbnMgaXMgZ3JhbnRlZC4AAAAAAAAAAAANQXBwcm92ZUZvckFsbAAAAAAAAAEAAAAPYXBwcm92ZV9mb3JfYWxsAAAAAAMAAAAAAAAABW93bmVyAAAAAAAAEwAAAAEAAAAAAAAACG9wZXJhdG9yAAAAEwAAAAAAAAAAAAAAEWxpdmVfdW50aWxfbGVkZ2VyAAAAAAAABAAAAAAAAAAC",
        "AAAABQAAACVFdmVudCBlbWl0dGVkIHdoZW4gYSB0b2tlbiBpcyBtaW50ZWQuAAAAAAAAAAAAAARNaW50AAAAAQAAAARtaW50AAAAAgAAAAAAAAACdG8AAAAAABMAAAABAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAAAAAAAAg==",
        "AAAAAQAAAAAAAAAAAAAAClNpZ25pbmdLZXkAAAAAAAIAAAAAAAAACnB1YmxpY19rZXkAAAAAAA4AAAAAAAAABnNjaGVtZQAAAAAABA==",
        "AAAAAgAAAC1TdG9yYWdlIGtleXMgZm9yIGNsYWltIGlzc3VlciBrZXkgbWFuYWdlbWVudC4AAAAAAAAAAAAAFUNsYWltSXNzdWVyU3RvcmFnZUtleQAAAAAAAAQAAAABAAAAH01hcHMgVG9waWMgLT4gYFZlYzxTaWduaW5nS2V5PmAAAAAABlRvcGljcwAAAAAAAQAAAAQAAAABAAAAKU1hcHMgU2lnbmluZ0tleSAtPiBWZWM8KFRvcGljLCBSZWdpc3RyeSk+AAAAAAAABVBhaXJzAAAAAAAAAQAAB9AAAAAKU2lnbmluZ0tleQAAAAAAAQAAADBUcmFja3MgZXhwbGljaXRseSByZXZva2VkIGNsYWltcyBieSBjbGFpbSBkaWdlc3QAAAAMUmV2b2tlZENsYWltAAAAAQAAA+4AAAAgAAAAAQAAAD1UcmFja3MgY3VycmVudCBub25jZSBmb3IgYSBzcGVjaWZpYyBpZGVudGl0eSBhbmQgY2xhaW0gdG9waWNzAAAAAAAACkNsYWltTm9uY2UAAAAAAAIAAAATAAAABA==",
        "AAAAAQAAACJTaWduYXR1cmUgZGF0YSBmb3IgRWQyNTUxOSBzY2hlbWUuAAAAAAAAAAAAFEVkMjU1MTlTaWduYXR1cmVEYXRhAAAAAgAAAAAAAAAKcHVibGljX2tleQAAAAAD7gAAACAAAAAAAAAACXNpZ25hdHVyZQAAAAAAA+4AAABA",
        "AAAAAQAAACRTaWduYXR1cmUgZGF0YSBmb3IgU2VjcDI1NnIxIHNjaGVtZS4AAAAAAAAAFlNlY3AyNTZyMVNpZ25hdHVyZURhdGEAAAAAAAIAAAAAAAAACnB1YmxpY19rZXkAAAAAA+4AAABBAAAAAAAAAAlzaWduYXR1cmUAAAAAAAPuAAAAQA==",
        "AAAAAQAAACRTaWduYXR1cmUgZGF0YSBmb3IgU2VjcDI1NmsxIHNjaGVtZS4AAAAAAAAAFlNlY3AyNTZrMVNpZ25hdHVyZURhdGEAAAAAAAMAAAAAAAAACnB1YmxpY19rZXkAAAAAA+4AAABBAAAAAAAAAAtyZWNvdmVyeV9pZAAAAAAEAAAAAAAAAAlzaWduYXR1cmUAAAAAAAPuAAAAQA==",
        "AAAABQAAAEFFdmVudCBlbWl0dGVkIHdoZW4gYSBrZXkgaXMgYWxsb3dlZCBmb3IgYSBzY2hlbWUgYW5kIGNsYWltIHRvcGljLgAAAAAAAAAAAAAKS2V5QWxsb3dlZAAAAAAAAQAAAAtrZXlfYWxsb3dlZAAAAAAEAAAAAAAAAApwdWJsaWNfa2V5AAAAAAAOAAAAAQAAAAAAAAAIcmVnaXN0cnkAAAATAAAAAAAAAAAAAAAGc2NoZW1lAAAAAAAEAAAAAAAAAAAAAAALY2xhaW1fdG9waWMAAAAABAAAAAAAAAAC",
        "AAAABQAAAEJFdmVudCBlbWl0dGVkIHdoZW4gYSBrZXkgaXMgcmVtb3ZlZCBmcm9tIGEgc2NoZW1lIGFuZCBjbGFpbSB0b3BpYy4AAAAAAAAAAAAKS2V5UmVtb3ZlZAAAAAAAAQAAAAtrZXlfcmVtb3ZlZAAAAAAEAAAAAAAAAApwdWJsaWNfa2V5AAAAAAAOAAAAAQAAAAAAAAAIcmVnaXN0cnkAAAATAAAAAAAAAAAAAAAGc2NoZW1lAAAAAAAEAAAAAAAAAAAAAAALY2xhaW1fdG9waWMAAAAABAAAAAAAAAAC",
        "AAAABQAAACZFdmVudCBlbWl0dGVkIHdoZW4gYSBjbGFpbSBpcyByZXZva2VkLgAAAAAAAAAAAAxDbGFpbVJldm9rZWQAAAABAAAADWNsYWltX3Jldm9rZWQAAAAAAAAEAAAAAAAAAAhpZGVudGl0eQAAABMAAAABAAAAAAAAAAtjbGFpbV90b3BpYwAAAAAEAAAAAQAAAAAAAAAHcmV2b2tlZAAAAAABAAAAAQAAAAAAAAAKY2xhaW1fZGF0YQAAAAAADgAAAAAAAAAC",
        "AAAABQAAAE5FdmVudCBlbWl0dGVkIHdoZW4gY2xhaW0gc2lnbmF0dXJlcyBhcmUgaW52YWxpZGF0ZWQgYnkgaW5jcmVtZW50aW5nIHRoZQpub25jZS4AAAAAAAAAAAAVU2lnbmF0dXJlc0ludmFsaWRhdGVkAAAAAAAAAQAAABZzaWduYXR1cmVzX2ludmFsaWRhdGVkAAAAAAADAAAAAAAAAAhpZGVudGl0eQAAABMAAAABAAAAAAAAAAtjbGFpbV90b3BpYwAAAAAEAAAAAQAAAAAAAAAFbm9uY2UAAAAAAAAEAAAAAAAAAAI=",
        "AAAABAAAAAAAAAAAAAAAEENsYWltSXNzdWVyRXJyb3IAAAAKAAAAOVNpZ25hdHVyZSBkYXRhIGxlbmd0aCBkb2VzIG5vdCBtYXRjaCB0aGUgZXhwZWN0ZWQgc2NoZW1lLgAAAAAAAA9TaWdEYXRhTWlzbWF0Y2gAAAABXgAAABpUaGUgcHJvdmlkZWQga2V5IGlzIGVtcHR5LgAAAAAACktleUlzRW1wdHkAAAAAAV8AAAAzVGhlIGtleSBpcyBhbHJlYWR5IGFsbG93ZWQgZm9yIHRoZSBzcGVjaWZpZWQgdG9waWMuAAAAABFLZXlBbHJlYWR5QWxsb3dlZAAAAAAAAWAAAAA0VGhlIHNwZWNpZmllZCBrZXkgd2FzIG5vdCBmb3VuZCBpbiB0aGUgYWxsb3dlZCBrZXlzLgAAAAtLZXlOb3RGb3VuZAAAAAFhAAAAT1RoZSBjbGFpbSBpc3N1ZXIgaXMgbm90IGFsbG93ZWQgdG8gc2lnbiBjbGFpbXMgYWJvdXQgdGhlIHNwZWNpZmllZApjbGFpbSB0b3BpYy4AAAAACk5vdEFsbG93ZWQAAAAAAWIAAAA+TWF4aW11bSBsaW1pdCBleGNlZWRlZCAoa2V5cyBwZXIgdG9waWMgb3IgcmVnaXN0cmllcyBwZXIga2V5KS4AAAAAAA1MaW1pdEV4Y2VlZGVkAAAAAAABYwAAADRObyBzaWduaW5nIGtleXMgZm91bmQgZm9yIHRoZSBzcGVjaWZpZWQgY2xhaW0gdG9waWMuAAAADk5vS2V5c0ZvclRvcGljAAAAAAFkAAAAHEludmFsaWQgY2xhaW0gZGF0YSBlbmNvZGluZy4AAAAaSW52YWxpZENsYWltRGF0YUV4cGlyYXRpb24AAAAAAWUAAAAsUmVjb3Zlcnkgb2YgdGhlIFNlY3AyNTZrMSBwdWJsaWMga2V5IGZhaWxlZC4AAAAXU2VjcDI1NmsxUmVjb3ZlcnlGYWlsZWQAAAABZgAAACpJbmRpY2F0ZXMgb3ZlcmZsb3cgd2hlbiBhZGRpbmcgdHdvIHZhbHVlcy4AAAAAAAxNYXRoT3ZlcmZsb3cAAAFn",
        "AAAAAgAAAFBTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgY2xhaW0gdG9waWNzIGFuZCBpc3N1ZXJzCmV4dGVuc2lvbgAAAAAAAAAfQ2xhaW1Ub3BpY3NBbmRJc3N1ZXJzU3RvcmFnZUtleQAAAAAEAAAAAAAAACBTdG9yZXMgdGhlIGNsYWltIHRvcGljcyByZWdpc3RyeQAAAAtDbGFpbVRvcGljcwAAAAAAAAAAI1N0b3JlcyB0aGUgdHJ1c3RlZCBpc3N1ZXJzIHJlZ2lzdHJ5AAAAAA5UcnVzdGVkSXNzdWVycwAAAAAAAQAAAD1TdG9yZXMgdGhlIGNsYWltIHRvcGljcyBhbGxvd2VkIGZvciBhIHNwZWNpZmljIHRydXN0ZWQgaXNzdWVyAAAAAAAAEUlzc3VlckNsYWltVG9waWNzAAAAAAAAAQAAABMAAAABAAAAPVN0b3JlcyB0aGUgdHJ1c3RlZCBpc3N1ZXJzIGFsbG93ZWQgZm9yIGEgc3BlY2lmaWMgY2xhaW0gdG9waWMAAAAAAAARQ2xhaW1Ub3BpY0lzc3VlcnMAAAAAAAABAAAABA==",
        "AAAABAAAAAAAAAAAAAAAGkNsYWltVG9waWNzQW5kSXNzdWVyc0Vycm9yAAAAAAAHAAAAJUluZGljYXRlcyBhIG5vbi1leGlzdGVudCBjbGFpbSB0b3BpYy4AAAAAAAAWQ2xhaW1Ub3BpY0RvZXNOb3RFeGlzdAAAAAABcgAAAChJbmRpY2F0ZXMgYSBub24tZXhpc3RlbnQgdHJ1c3RlZCBpc3N1ZXIuAAAAEklzc3VlckRvZXNOb3RFeGlzdAAAAAABcwAAACdJbmRpY2F0ZXMgYSBjbGFpbSB0b3BpYyBhbHJlYWR5IGV4aXN0cy4AAAAAF0NsYWltVG9waWNBbHJlYWR5RXhpc3RzAAAAAXQAAAAqSW5kaWNhdGVzIGEgdHJ1c3RlZCBpc3N1ZXIgYWxyZWFkeSBleGlzdHMuAAAAAAATSXNzdWVyQWxyZWFkeUV4aXN0cwAAAAF1AAAALEluZGljYXRlcyBtYXggY2xhaW0gdG9waWNzIGxpbWl0IGlzIHJlYWNoZWQuAAAAGk1heENsYWltVG9waWNzTGltaXRSZWFjaGVkAAAAAAF2AAAAL0luZGljYXRlcyBtYXggdHJ1c3RlZCBpc3N1ZXJzIGxpbWl0IGlzIHJlYWNoZWQuAAAAABZNYXhJc3N1ZXJzTGltaXRSZWFjaGVkAAAAAAF3AAAAQ0luZGljYXRlcyBjbGFpbSB0b3BpY3Mgc2V0IHByb3ZpZGVkIGZvciB0aGUgaXNzdWVyIGNhbm5vdCBiZSBlbXB0eS4AAAAAG0NsYWltVG9waWNzU2V0Q2Fubm90QmVFbXB0eQAAAAF4",
        "AAAABQAAACpFdmVudCBlbWl0dGVkIHdoZW4gYSBjbGFpbSB0b3BpYyBpcyBhZGRlZC4AAAAAAAAAAAAPQ2xhaW1Ub3BpY0FkZGVkAAAAAAEAAAARY2xhaW1fdG9waWNfYWRkZWQAAAAAAAABAAAAAAAAAAtjbGFpbV90b3BpYwAAAAAEAAAAAQAAAAI=",
        "AAAABQAAACxFdmVudCBlbWl0dGVkIHdoZW4gYSBjbGFpbSB0b3BpYyBpcyByZW1vdmVkLgAAAAAAAAARQ2xhaW1Ub3BpY1JlbW92ZWQAAAAAAAABAAAAE2NsYWltX3RvcGljX3JlbW92ZWQAAAAAAQAAAAAAAAALY2xhaW1fdG9waWMAAAAABAAAAAEAAAAC",
        "AAAABQAAAC1FdmVudCBlbWl0dGVkIHdoZW4gYSB0cnVzdGVkIGlzc3VlciBpcyBhZGRlZC4AAAAAAAAAAAAAElRydXN0ZWRJc3N1ZXJBZGRlZAAAAAAAAQAAABR0cnVzdGVkX2lzc3Vlcl9hZGRlZAAAAAIAAAAAAAAADnRydXN0ZWRfaXNzdWVyAAAAAAATAAAAAQAAAAAAAAAMY2xhaW1fdG9waWNzAAAD6gAAAAQAAAAAAAAAAg==",
        "AAAABQAAAC9FdmVudCBlbWl0dGVkIHdoZW4gYSB0cnVzdGVkIGlzc3VlciBpcyByZW1vdmVkLgAAAAAAAAAAFFRydXN0ZWRJc3N1ZXJSZW1vdmVkAAAAAQAAABZ0cnVzdGVkX2lzc3Vlcl9yZW1vdmVkAAAAAAABAAAAAAAAAA50cnVzdGVkX2lzc3VlcgAAAAAAEwAAAAEAAAAC",
        "AAAABQAAAC1FdmVudCBlbWl0dGVkIHdoZW4gaXNzdWVyIHRvcGljcyBhcmUgdXBkYXRlZC4AAAAAAAAAAAAAE0lzc3VlclRvcGljc1VwZGF0ZWQAAAAAAQAAABVpc3N1ZXJfdG9waWNzX3VwZGF0ZWQAAAAAAAACAAAAAAAAAA50cnVzdGVkX2lzc3VlcgAAAAAAEwAAAAEAAAAAAAAADGNsYWltX3RvcGljcwAAA+oAAAAEAAAAAAAAAAI=",
        "AAAAAgAAADFTdG9yYWdlIGtleXMgZm9yIHRoZSBtb2R1bGFyIGNvbXBsaWFuY2UgY29udHJhY3QuAAAAAAAAAAAAABFDb21wbGlhbmNlRGF0YUtleQAAAAAAAAEAAAABAAAAPE1hcHMgQ29tcGxpYW5jZUhvb2sgLT4gYFZlYzxBZGRyZXNzPmAgZm9yIHJlZ2lzdGVyZWQgbW9kdWxlcwAAAAtIb29rTW9kdWxlcwAAAAABAAAH0AAAAA5Db21wbGlhbmNlSG9vawAA",
        "AAAAAgAAAJNIb29rIHR5cGVzIGZvciBtb2R1bGFyIGNvbXBsaWFuY2Ugc3lzdGVtLgoKRWFjaCBob29rIHR5cGUgcmVwcmVzZW50cyBhIHNwZWNpZmljIGV2ZW50IG9yIHZhbGlkYXRpb24gcG9pbnQKd2hlcmUgY29tcGxpYW5jZSBtb2R1bGVzIGNhbiBiZSBleGVjdXRlZC4AAAAAAAAAAA5Db21wbGlhbmNlSG9vawAAAAAABQAAAAAAAACeQ2FsbGVkIGFmdGVyIHRva2VucyBhcmUgc3VjY2Vzc2Z1bGx5IHRyYW5zZmVycmVkIGZyb20gb25lIHdhbGxldCB0bwphbm90aGVyLiBNb2R1bGVzIHJlZ2lzdGVyZWQgZm9yIHRoaXMgaG9vayBjYW4gdXBkYXRlIHRoZWlyIHN0YXRlCmJhc2VkIG9uIHRyYW5zZmVyIGV2ZW50cy4AAAAAAAtUcmFuc2ZlcnJlZAAAAAAAAAAAkUNhbGxlZCBhZnRlciB0b2tlbnMgYXJlIHN1Y2Nlc3NmdWxseSBjcmVhdGVkL21pbnRlZCB0byBhIHdhbGxldC4KTW9kdWxlcyByZWdpc3RlcmVkIGZvciB0aGlzIGhvb2sgY2FuIHVwZGF0ZSB0aGVpciBzdGF0ZSBiYXNlZCBvbiBtaW50aW5nCmV2ZW50cy4AAAAAAAAHQ3JlYXRlZAAAAAAAAAAAlUNhbGxlZCBhZnRlciB0b2tlbnMgYXJlIHN1Y2Nlc3NmdWxseSBkZXN0cm95ZWQvYnVybmVkIGZyb20gYSB3YWxsZXQuCk1vZHVsZXMgcmVnaXN0ZXJlZCBmb3IgdGhpcyBob29rIGNhbiB1cGRhdGUgdGhlaXIgc3RhdGUgYmFzZWQgb24gYnVybmluZwpldmVudHMuAAAAAAAACURlc3Ryb3llZAAAAAAAAAAAAADMQ2FsbGVkIGR1cmluZyB0cmFuc2ZlciB2YWxpZGF0aW9uIHRvIGNoZWNrIGlmIGEgdHJhbnNmZXIgc2hvdWxkIGJlCmFsbG93ZWQuIE1vZHVsZXMgcmVnaXN0ZXJlZCBmb3IgdGhpcyBob29rIGNhbiBpbXBsZW1lbnQgdHJhbnNmZXIKcmVzdHJpY3Rpb25zLiBUaGlzIGlzIGEgUkVBRC1vbmx5IG9wZXJhdGlvbiBhbmQgc2hvdWxkIG5vdCBtb2RpZnkKc3RhdGUuAAAAC0NhblRyYW5zZmVyAAAAAAAAAADOQ2FsbGVkIGR1cmluZyBtaW50IHZhbGlkYXRpb24gdG8gY2hlY2sgaWYgYSBtaW50IG9wZXJhdGlvbiBzaG91bGQgYmUKYWxsb3dlZC4gTW9kdWxlcyByZWdpc3RlcmVkIGZvciB0aGlzIGhvb2sgY2FuIGltcGxlbWVudCB0cmFuc2ZlcgpyZXN0cmljdGlvbnMuIFRoaXMgaXMgYSBSRUFELW9ubHkgb3BlcmF0aW9uIGFuZCBzaG91bGQgbm90IG1vZGlmeQpzdGF0ZS4AAAAAAAlDYW5DcmVhdGUAAAA=",
        "AAAABAAAAAAAAAAAAAAAD0NvbXBsaWFuY2VFcnJvcgAAAAAEAAAAN0luZGljYXRlcyBhIG1vZHVsZSBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQgZm9yIHRoaXMgaG9vay4AAAAAF01vZHVsZUFscmVhZHlSZWdpc3RlcmVkAAAAAWgAAAAzSW5kaWNhdGVzIGEgbW9kdWxlIGlzIG5vdCByZWdpc3RlcmVkIGZvciB0aGlzIGhvb2suAAAAABNNb2R1bGVOb3RSZWdpc3RlcmVkAAAAAWkAAAAlSW5kaWNhdGVzIGEgbW9kdWxlIGJvdW5kIGlzIGV4Y2VlZGVkLgAAAAAAABNNb2R1bGVCb3VuZEV4Y2VlZGVkAAAAAWoAAAA7SW5kaWNhdGVzIGEgdG9rZW4gaXMgbm90IGJvdW5kIHRvIHRoaXMgY29tcGxpYW5jZSBjb250cmFjdC4AAAAADVRva2VuTm90Qm91bmQAAAAAAAFr",
        "AAAABQAAADNFdmVudCBlbWl0dGVkIHdoZW4gYSBtb2R1bGUgaXMgYWRkZWQgdG8gY29tcGxpYW5jZS4AAAAAAAAAAAtNb2R1bGVBZGRlZAAAAAABAAAADG1vZHVsZV9hZGRlZAAAAAIAAAAAAAAABGhvb2sAAAfQAAAADkNvbXBsaWFuY2VIb29rAAAAAAABAAAAAAAAAAZtb2R1bGUAAAAAABMAAAAAAAAAAg==",
        "AAAABQAAADdFdmVudCBlbWl0dGVkIHdoZW4gYSBtb2R1bGUgaXMgcmVtb3ZlZCBmcm9tIGNvbXBsaWFuY2UuAAAAAAAAAAANTW9kdWxlUmVtb3ZlZAAAAAAAAAEAAAAObW9kdWxlX3JlbW92ZWQAAAAAAAIAAAAAAAAABGhvb2sAAAfQAAAADkNvbXBsaWFuY2VIb29rAAAAAAABAAAAAAAAAAZtb2R1bGUAAAAAABMAAAAAAAAAAg==",
        "AAAAAQAAAChSZXByZXNlbnRzIGEgZG9jdW1lbnQgd2l0aCBpdHMgbWV0YWRhdGEuAAAAAAAAAAhEb2N1bWVudAAAAAMAAAAiVGhlIGhhc2ggb2YgdGhlIGRvY3VtZW50IGNvbnRlbnRzLgAAAAAADWRvY3VtZW50X2hhc2gAAAAAAAPuAAAAIAAAAC5UaW1lc3RhbXAgd2hlbiB0aGUgZG9jdW1lbnQgd2FzIGxhc3QgbW9kaWZpZWQuAAAAAAAJdGltZXN0YW1wAAAAAAAABgAAACtUaGUgVVJJIHdoZXJlIHRoZSBkb2N1bWVudCBjYW4gYmUgYWNjZXNzZWQuAAAAAAN1cmkAAAAAEA==",
        "AAAAAgAAACVTdG9yYWdlIGtleXMgZm9yIGRvY3VtZW50IG1hbmFnZW1lbnQuAAAAAAAAAAAAABJEb2N1bWVudFN0b3JhZ2VLZXkAAAAAAAMAAAABAAAAJ01hcHMgZG9jdW1lbnQgbmFtZSB0byBpdHMgZ2xvYmFsIGluZGV4LgAAAAAFSW5kZXgAAAAAAAABAAAD7gAAACAAAAABAAAAOU1hcHMgYnVja2V0IGluZGV4IHRvIGEgdmVjdG9yIG9mIChuYW1lLCBkb2N1bWVudCkgdHVwbGVzLgAAAAAAAAZCdWNrZXQAAAAAAAEAAAAEAAAAAAAAABlUb3RhbCBjb3VudCBvZiBkb2N1bWVudHMuAAAAAAAABUNvdW50AAAA",
        "AAAABAAAAC9FcnJvciBjb2RlcyBmb3IgZG9jdW1lbnQgbWFuYWdlbWVudCBvcGVyYXRpb25zLgAAAAAAAAAADURvY3VtZW50RXJyb3IAAAAAAAADAAAAJVRoZSBzcGVjaWZpZWQgZG9jdW1lbnQgd2FzIG5vdCBmb3VuZC4AAAAAAAAQRG9jdW1lbnROb3RGb3VuZAAAAXwAAAAtTWF4aW11bSBudW1iZXIgb2YgZG9jdW1lbnRzIGhhcyBiZWVuIHJlYWNoZWQuAAAAAAAAE01heERvY3VtZW50c1JlYWNoZWQAAAABfQAAACtUaGUgVVJJIGV4Y2VlZHMgdGhlIG1heGltdW0gYWxsb3dlZCBsZW5ndGguAAAAAApVcmlUb29Mb25nAAAAAAF+",
        "AAAABQAAAD1FdmVudCBlbWl0dGVkIHdoZW4gYSBkb2N1bWVudCBpcyB1cGRhdGVkIChhZGRlZCBvciBtb2RpZmllZCkuAAAAAAAAAAAAAA9Eb2N1bWVudFVwZGF0ZWQAAAAAAQAAABBkb2N1bWVudF91cGRhdGVkAAAABAAAAAAAAAAEbmFtZQAAA+4AAAAgAAAAAQAAAAAAAAADdXJpAAAAABAAAAAAAAAAAAAAAA1kb2N1bWVudF9oYXNoAAAAAAAD7gAAACAAAAAAAAAAAAAAAAl0aW1lc3RhbXAAAAAAAAAGAAAAAAAAAAI=",
        "AAAABQAAAClFdmVudCBlbWl0dGVkIHdoZW4gYSBkb2N1bWVudCBpcyByZW1vdmVkLgAAAAAAAAAAAAAPRG9jdW1lbnRSZW1vdmVkAAAAAAEAAAAQZG9jdW1lbnRfcmVtb3ZlZAAAAAEAAAAAAAAABG5hbWUAAAPuAAAAIAAAAAEAAAAC",
        "AAAAAQAAACNSZXByZXNlbnRzIGEgY2xhaW0gc3RvcmVkIG9uLWNoYWluLgAAAAAAAAAABUNsYWltAAAAAAAABgAAAA5UaGUgY2xhaW0gZGF0YQAAAAAABGRhdGEAAAAOAAAAH1RoZSBhZGRyZXNzIG9mIHRoZSBjbGFpbSBpc3N1ZXIAAAAABmlzc3VlcgAAAAAAEwAAABlUaGUgc2lnbmF0dXJlIHNjaGVtZSB1c2VkAAAAAAAABnNjaGVtZQAAAAAABAAAABtUaGUgY3J5cHRvZ3JhcGhpYyBzaWduYXR1cmUAAAAACXNpZ25hdHVyZQAAAAAAAA4AAAAkVGhlIGNsYWltIHRvcGljIChudW1lcmljIGlkZW50aWZpZXIpAAAABXRvcGljAAAAAAAABAAAACdPcHRpb25hbCBVUkkgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24AAAAAA3VyaQAAAAAQ",
        "AAAAAgAAADpTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBJZGVudGl0eSBDbGFpbXMuAAAAAAAAAAAAEENsYWltc1N0b3JhZ2VLZXkAAAACAAAAAQAAABtNYXBzIGNsYWltIElEIHRvIGNsYWltIGRhdGEAAAAABUNsYWltAAAAAAAAAQAAA+4AAAAgAAAAAQAAACFNYXBzIHRvcGljIHRvIHZlY3RvciBvZiBjbGFpbSBJRHMAAAAAAAANQ2xhaW1zQnlUb3BpYwAAAAAAAAEAAAAE",
        "AAAABAAAAAAAAAAAAAAAC0NsYWltc0Vycm9yAAAAAAIAAAAZQ2xhaW0gIElEIGRvZXMgbm90IGV4aXN0LgAAAAAAAA1DbGFpbU5vdEZvdW5kAAAAAAABVAAAAGdDbGFpbSBJc3N1ZXIgY2Fubm90IHZhbGlkYXRlIHRoZSBjbGFpbSAocmV2b2NhdGlvbiwgc2lnbmF0dXJlIG1pc21hdGNoLAp1bmF1dGhvcml6ZWQgc2lnbmluZyBrZXksIGV0Yy4pAAAAAA1DbGFpbU5vdFZhbGlkAAAAAAABVQ==",
        "AAAABQAAACRFdmVudCBlbWl0dGVkIHdoZW4gYSBjbGFpbSBpcyBhZGRlZC4AAAAAAAAACkNsYWltQWRkZWQAAAAAAAEAAAALY2xhaW1fYWRkZWQAAAAAAQAAAAAAAAAFY2xhaW0AAAAAAAfQAAAABUNsYWltAAAAAAAAAQAAAAI=",
        "AAAABQAAACZFdmVudCBlbWl0dGVkIHdoZW4gYSBjbGFpbSBpcyByZW1vdmVkLgAAAAAAAAAAAAxDbGFpbVJlbW92ZWQAAAABAAAADWNsYWltX3JlbW92ZWQAAAAAAAABAAAAAAAAAAVjbGFpbQAAAAAAB9AAAAAFQ2xhaW0AAAAAAAABAAAAAg==",
        "AAAABQAAACZFdmVudCBlbWl0dGVkIHdoZW4gYSBjbGFpbSBpcyBjaGFuZ2VkLgAAAAAAAAAAAAxDbGFpbUNoYW5nZWQAAAABAAAADWNsYWltX2NoYW5nZWQAAAAAAAABAAAAAAAAAAVjbGFpbQAAAAAAB9AAAAAFQ2xhaW0AAAAAAAABAAAAAg==",
        "AAAAAgAAACZSZXByZXNlbnRzIHRoZSB0eXBlIG9mIGlkZW50aXR5IGhvbGRlcgAAAAAAAAAAAAxJZGVudGl0eVR5cGUAAAACAAAAAAAAAAAAAAAKSW5kaXZpZHVhbAAAAAAAAAAAAAAAAAAMT3JnYW5pemF0aW9u",
        "AAAAAgAAAGNSZXByZXNlbnRzIGRpZmZlcmVudCB0eXBlcyBvZiBjb3VudHJ5IHJlbGF0aW9uc2hpcHMgZm9yIGluZGl2aWR1YWxzCklTTyAzMTY2LTEgbnVtZXJpYyBjb3VudHJ5IGNvZGUAAAAAAAAAABlJbmRpdmlkdWFsQ291bnRyeVJlbGF0aW9uAAAAAAAABQAAAAEAAAAUQ291bnRyeSBvZiByZXNpZGVuY2UAAAAJUmVzaWRlbmNlAAAAAAAAAQAAAAQAAAABAAAAFkNvdW50cnkgb2YgY2l0aXplbnNoaXAAAAAAAAtDaXRpemVuc2hpcAAAAAABAAAABAAAAAEAAAAdQ291bnRyeSB3aGVyZSBmdW5kcyBvcmlnaW5hdGUAAAAAAAANU291cmNlT2ZGdW5kcwAAAAAAAAEAAAAEAAAAAQAAAClUYXggcmVzaWRlbmN5IChjYW4gZGlmZmVyIGZyb20gcmVzaWRlbmNlKQAAAAAAAAxUYXhSZXNpZGVuY3kAAAABAAAABAAAAAEAAAApQ3VzdG9tIGNvdW50cnkgdHlwZSBmb3IgZnV0dXJlIGV4dGVuc2lvbnMAAAAAAAAGQ3VzdG9tAAAAAAACAAAAEQAAAAQ=",
        "AAAAAgAAAEVSZXByZXNlbnRzIGRpZmZlcmVudCB0eXBlcyBvZiBjb3VudHJ5IHJlbGF0aW9uc2hpcHMgZm9yIG9yZ2FuaXphdGlvbnMAAAAAAAAAAAAAG09yZ2FuaXphdGlvbkNvdW50cnlSZWxhdGlvbgAAAAAFAAAAAQAAACVDb3VudHJ5IG9mIGluY29ycG9yYXRpb24vcmVnaXN0cmF0aW9uAAAAAAAADUluY29ycG9yYXRpb24AAAAAAAABAAAABAAAAAEAAAAlQ291bnRyaWVzIHdoZXJlIG9yZ2FuaXphdGlvbiBvcGVyYXRlcwAAAAAAABVPcGVyYXRpbmdKdXJpc2RpY3Rpb24AAAAAAAABAAAABAAAAAEAAAAQVGF4IGp1cmlzZGljdGlvbgAAAA9UYXhKdXJpc2RpY3Rpb24AAAAAAQAAAAQAAAABAAAAHUNvdW50cnkgd2hlcmUgZnVuZHMgb3JpZ2luYXRlAAAAAAAADVNvdXJjZU9mRnVuZHMAAAAAAAABAAAABAAAAAEAAAApQ3VzdG9tIGNvdW50cnkgdHlwZSBmb3IgZnV0dXJlIGV4dGVuc2lvbnMAAAAAAAAGQ3VzdG9tAAAAAAACAAAAEQAAAAQ=",
        "AAAAAgAAAExVbmlmaWVkIGNvdW50cnkgcmVsYXRpb25zaGlwIHRoYXQgY2FuIGJlIGVpdGhlciBpbmRpdmlkdWFsIG9yIG9yZ2FuaXphdGlvbmFsAAAAAAAAAA9Db3VudHJ5UmVsYXRpb24AAAAAAgAAAAEAAAAAAAAACkluZGl2aWR1YWwAAAAAAAEAAAfQAAAAGUluZGl2aWR1YWxDb3VudHJ5UmVsYXRpb24AAAAAAAABAAAAAAAAAAxPcmdhbml6YXRpb24AAAABAAAH0AAAABtPcmdhbml6YXRpb25Db3VudHJ5UmVsYXRpb24A",
        "AAAAAQAAAEhBIGNvdW50cnkgZGF0YSBjb250YWluaW5nIHRoZSBjb3VudHJ5IHJlbGF0aW9uc2hpcCBhbmQgb3B0aW9uYWwgbWV0YWRhdGEAAAAAAAAAC0NvdW50cnlEYXRhAAAAAAIAAAAcVHlwZSBvZiBjb3VudHJ5IHJlbGF0aW9uc2hpcAAAAAdjb3VudHJ5AAAAB9AAAAAPQ291bnRyeVJlbGF0aW9uAAAAADRPcHRpb25hbCBtZXRhZGF0YSAoZS5nLiwgdmlzYSB0eXBlLCB2YWxpZGl0eSBwZXJpb2QpAAAACG1ldGFkYXRhAAAD6AAAA+wAAAARAAAAEA==",
        "AAAAAQAAAENDb21wbGV0ZSBpZGVudGl0eSBwcm9maWxlIGNvbnRhaW5pbmcgaWRlbnRpdHkgdHlwZSBhbmQgY291bnRyeSBkYXRhAAAAAAAAAAAPSWRlbnRpdHlQcm9maWxlAAAAAAIAAAAAAAAACWNvdW50cmllcwAAAAAAA+oAAAfQAAAAC0NvdW50cnlEYXRhAAAAAAAAAAANaWRlbnRpdHlfdHlwZQAAAAAAB9AAAAAMSWRlbnRpdHlUeXBl",
        "AAAAAgAAAERTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBJZGVudGl0eSBTdG9yYWdlIFJlZ2lzdHJ5LgAAAAAAAAANSVJTU3RvcmFnZUtleQAAAAAAAAMAAAABAAAAKE1hcHMgYWNjb3VudCBhZGRyZXNzIHRvIGlkZW50aXR5IGFkZHJlc3MAAAAISWRlbnRpdHkAAAABAAAAEwAAAAEAAAAwTWFwcyBhbiBhY2NvdW50IHRvIGl0cyBjb21wbGV0ZSBpZGVudGl0eSBwcm9maWxlAAAAD0lkZW50aXR5UHJvZmlsZQAAAAABAAAAEwAAAAEAAAAuTWFwcyBvbGQgYWNjb3VudCB0byBuZXcgYWNjb3VudCBhZnRlciByZWNvdmVyeQAAAAAAC1JlY292ZXJlZFRvAAAAAAEAAAAT",
        "AAAABAAAADVFcnJvciBjb2RlcyBmb3IgdGhlIElkZW50aXR5IFJlZ2lzdHJ5IFN0b3JhZ2Ugc3lzdGVtLgAAAAAAAAAAAAAISVJTRXJyb3IAAAAGAAAAMUFuIGlkZW50aXR5IGFscmVhZHkgZXhpc3RzIGZvciB0aGUgZ2l2ZW4gYWNjb3VudC4AAAAAAAARSWRlbnRpdHlPdmVyd3JpdGUAAAAAAAFAAAAAKE5vIGlkZW50aXR5IGZvdW5kIGZvciB0aGUgZ2l2ZW4gYWNjb3VudC4AAAAQSWRlbnRpdHlOb3RGb3VuZAAAAUEAAAAuQ291bnRyeSBkYXRhIG5vdCBmb3VuZCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LgAAAAAAE0NvdW50cnlEYXRhTm90Rm91bmQAAAABQgAAAC9JZGVudGl0eSBjYW4ndCBiZSB3aXRoIGVtcHR5IGNvdW50cnkgZGF0YSBsaXN0LgAAAAAQRW1wdHlDb3VudHJ5TGlzdAAAAUMAAAA3VGhlIG1heGltdW0gbnVtYmVyIG9mIGNvdW50cnkgZW50cmllcyBoYXMgYmVlbiByZWFjaGVkLgAAAAAYTWF4Q291bnRyeUVudHJpZXNSZWFjaGVkAAABRAAAAC5BY2NvdW50IGhhcyBiZWVuIHJlY292ZXJlZCBhbmQgY2Fubm90IGJlIHVzZWQuAAAAAAAQQWNjb3VudFJlY292ZXJlZAAAAUU=",
        "AAAABQAAADhFdmVudCBlbWl0dGVkIHdoZW4gYW4gaWRlbnRpdHkgaXMgc3RvcmVkIGZvciBhbiBhY2NvdW50LgAAAAAAAAAOSWRlbnRpdHlTdG9yZWQAAAAAAAEAAAAPaWRlbnRpdHlfc3RvcmVkAAAAAAIAAAAAAAAAB2FjY291bnQAAAAAEwAAAAEAAAAAAAAACGlkZW50aXR5AAAAEwAAAAEAAAAC",
        "AAAABQAAADpFdmVudCBlbWl0dGVkIHdoZW4gYW4gaWRlbnRpdHkgaXMgcmVtb3ZlZCBmcm9tIGFuIGFjY291bnQuAAAAAAAAAAAAEElkZW50aXR5VW5zdG9yZWQAAAABAAAAEWlkZW50aXR5X3Vuc3RvcmVkAAAAAAAAAgAAAAAAAAAHYWNjb3VudAAAAAATAAAAAQAAAAAAAAAIaWRlbnRpdHkAAAATAAAAAQAAAAI=",
        "AAAABQAAADpFdmVudCBlbWl0dGVkIHdoZW4gYW4gaWRlbnRpdHkgaXMgbW9kaWZpZWQgZm9yIGFuIGFjY291bnQuAAAAAAAAAAAAEElkZW50aXR5TW9kaWZpZWQAAAABAAAAEWlkZW50aXR5X21vZGlmaWVkAAAAAAAAAgAAAAAAAAAMb2xkX2lkZW50aXR5AAAAEwAAAAEAAAAAAAAADG5ld19pZGVudGl0eQAAABMAAAABAAAAAg==",
        "AAAABQAAAD5FdmVudCBlbWl0dGVkIHdoZW4gYW4gaWRlbnRpdHkgaXMgcmVjb3ZlcmVkIGZvciBhIG5ldyBhY2NvdW50LgAAAAAAAAAAABFJZGVudGl0eVJlY292ZXJlZAAAAAAAAAEAAAASaWRlbnRpdHlfcmVjb3ZlcmVkAAAAAAACAAAAAAAAAAtvbGRfYWNjb3VudAAAAAATAAAAAQAAAAAAAAALbmV3X2FjY291bnQAAAAAEwAAAAEAAAAC",
        "AAAABQAAACpFdmVudCBlbWl0dGVkIGZvciBjb3VudHJ5IGRhdGEgb3BlcmF0aW9ucy4AAAAAAAAAAAAQQ291bnRyeURhdGFBZGRlZAAAAAEAAAASY291bnRyeV9kYXRhX2FkZGVkAAAAAAACAAAAAAAAAAdhY2NvdW50AAAAABMAAAABAAAAAAAAAAxjb3VudHJ5X2RhdGEAAAfQAAAAC0NvdW50cnlEYXRhAAAAAAEAAAAC",
        "AAAABQAAAAAAAAAAAAAAEkNvdW50cnlEYXRhUmVtb3ZlZAAAAAAAAQAAABRjb3VudHJ5X2RhdGFfcmVtb3ZlZAAAAAIAAAAAAAAAB2FjY291bnQAAAAAEwAAAAEAAAAAAAAADGNvdW50cnlfZGF0YQAAB9AAAAALQ291bnRyeURhdGEAAAAAAQAAAAI=",
        "AAAABQAAAAAAAAAAAAAAE0NvdW50cnlEYXRhTW9kaWZpZWQAAAAAAQAAABVjb3VudHJ5X2RhdGFfbW9kaWZpZWQAAAAAAAACAAAAAAAAAAdhY2NvdW50AAAAABMAAAABAAAAAAAAAAxjb3VudHJ5X2RhdGEAAAfQAAAAC0NvdW50cnlEYXRhAAAAAAEAAAAC",
        "AAAAAgAAADVTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBgUldBYCB0b2tlbgAAAAAAAAAAAAAaSWRlbnRpdHlWZXJpZmllclN0b3JhZ2VLZXkAAAAAAAIAAAAAAAAAKUNsYWltIFRvcGljcyBhbmQgSXNzdWVycyBjb250cmFjdCBhZGRyZXNzAAAAAAAAFUNsYWltVG9waWNzQW5kSXNzdWVycwAAAAAAAAAAAAAqSWRlbnRpdHkgUmVnaXN0cnkgU3RvcmFnZSBjb250cmFjdCBhZGRyZXNzAAAAAAAXSWRlbnRpdHlSZWdpc3RyeVN0b3JhZ2UA",
        "AAAAAgAAADVTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBgUldBYCB0b2tlbgAAAAAAAAAAAAANUldBU3RvcmFnZUtleQAAAAAAAAYAAAABAAAAP0Zyb3plbiBzdGF0dXMgb2YgYW4gYWRkcmVzcyAodHJ1ZSA9IGZyb3plbiwgZmFsc2UgPSBub3QgZnJvemVuKQAAAAANQWRkcmVzc0Zyb3plbgAAAAAAAAEAAAATAAAAAQAAAC5BbW91bnQgb2YgdG9rZW5zIGZyb3plbiBmb3IgYSBzcGVjaWZpYyBhZGRyZXNzAAAAAAAMRnJvemVuVG9rZW5zAAAAAQAAABMAAAAAAAAAG0NvbXBsaWFuY2UgY29udHJhY3QgYWRkcmVzcwAAAAAKQ29tcGxpYW5jZQAAAAAAAAAAABpPbmNoYWluSUQgY29udHJhY3QgYWRkcmVzcwAAAAAACU9uY2hhaW5JZAAAAAAAAAAAAAAUVmVyc2lvbiBvZiB0aGUgdG9rZW4AAAAHVmVyc2lvbgAAAAAAAAAAIklkZW50aXR5IFZlcmlmaWVyIGNvbnRyYWN0IGFkZHJlc3MAAAAAABBJZGVudGl0eVZlcmlmaWVy",
        "AAAAAgAAARxTdG9yYWdlIGtleXMgZm9yIHRoZSB0b2tlbiBiaW5kZXIgc3lzdGVtLgoKLSBUb2tlbnMgYXJlIHN0b3JlZCBpbiBidWNrZXRzIG9mIDEwMCBhZGRyZXNzZXMgZWFjaAotIEVhY2ggYnVja2V0IGlzIGEgYFZlYzxBZGRyZXNzPmAgc3RvcmVkIHVuZGVyIGl0cyBidWNrZXQgaW5kZXgKLSBUb3RhbCBjb3VudCBpcyB0cmFja2VkIHNlcGFyYXRlbHkKLSBXaGVuIGEgdG9rZW4gaXMgdW5ib3VuZCwgdGhlIGxhc3QgdG9rZW4gaXMgbW92ZWQgdG8gZmlsbCB0aGUgZ2FwCihzd2FwLXJlbW92ZSBwYXR0ZXJuKQAAAAAAAAAVVG9rZW5CaW5kZXJTdG9yYWdlS2V5AAAAAAAAAgAAAAEAAABFTWFwcyBidWNrZXQgaW5kZXggdG8gYSB2ZWN0b3Igb2YgdG9rZW4gYWRkcmVzc2VzIChtYXggMTAwIHBlciBidWNrZXQpAAAAAAAAC1Rva2VuQnVja2V0AAAAAAEAAAAEAAAAAAAAABtUb3RhbCBjb3VudCBvZiBib3VuZCB0b2tlbnMAAAAAClRvdGFsQ291bnQAAA==",
        "AAAABAAAAChFcnJvciBjb2RlcyBmb3IgdGhlIFRva2VuIEJpbmRlciBzeXN0ZW0uAAAAAAAAABBUb2tlbkJpbmRlckVycm9yAAAABQAAADtUaGUgc3BlY2lmaWVkIHRva2VuIHdhcyBub3QgZm91bmQgaW4gdGhlIGJvdW5kIHRva2VucyBsaXN0LgAAAAANVG9rZW5Ob3RGb3VuZAAAAAAAAUoAAAAwQXR0ZW1wdGVkIHRvIGJpbmQgYSB0b2tlbiB0aGF0IGlzIGFscmVhZHkgYm91bmQuAAAAEVRva2VuQWxyZWFkeUJvdW5kAAAAAAABSwAAADNUb3RhbCB0b2tlbiBjYXBhY2l0eSAoTUFYX1RPS0VOUykgaGFzIGJlZW4gcmVhY2hlZC4AAAAAEE1heFRva2Vuc1JlYWNoZWQAAAFMAAAAGUJhdGNoIGJpbmQgc2l6ZSBleGNlZWRlZC4AAAAAAAARQmluZEJhdGNoVG9vTGFyZ2UAAAAAAAFNAAAAHlRoZSBiYXRjaCBjb250YWlucyBkdXBsaWNhdGVzLgAAAAAAE0JpbmRCYXRjaER1cGxpY2F0ZXMAAAABTg==",
        "AAAABQAAADRFdmVudCBlbWl0dGVkIHdoZW4gYSB0b2tlbiBpcyBib3VuZCB0byB0aGUgY29udHJhY3QuAAAAAAAAAApUb2tlbkJvdW5kAAAAAAABAAAAC3Rva2VuX2JvdW5kAAAAAAEAAAAAAAAABXRva2VuAAAAAAAAEwAAAAEAAAAC",
        "AAAABQAAADhFdmVudCBlbWl0dGVkIHdoZW4gYSB0b2tlbiBpcyB1bmJvdW5kIGZyb20gdGhlIGNvbnRyYWN0LgAAAAAAAAAMVG9rZW5VbmJvdW5kAAAAAQAAAA10b2tlbl91bmJvdW5kAAAAAAAAAQAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAQAAAAI=",
        "AAAABAAAAAAAAAAAAAAACFJXQUVycm9yAAAADgAAAEVJbmRpY2F0ZXMgYW4gZXJyb3IgcmVsYXRlZCB0byBpbnN1ZmZpY2llbnQgYmFsYW5jZSBmb3IgdGhlIG9wZXJhdGlvbi4AAAAAAAATSW5zdWZmaWNpZW50QmFsYW5jZQAAAAEsAAAALkluZGljYXRlcyBhbiBlcnJvciB3aGVuIGFuIGlucHV0IG11c3QgYmUgPj0gMC4AAAAAAAxMZXNzVGhhblplcm8AAAEtAAAAPkluZGljYXRlcyB0aGUgYWRkcmVzcyBpcyBmcm96ZW4gYW5kIGNhbm5vdCBwZXJmb3JtIG9wZXJhdGlvbnMuAAAAAAANQWRkcmVzc0Zyb3plbgAAAAAAAS4AAAA9SW5kaWNhdGVzIGluc3VmZmljaWVudCBmcmVlIHRva2VucyAoZHVlIHRvIHBhcnRpYWwgZnJlZXppbmcpLgAAAAAAABZJbnN1ZmZpY2llbnRGcmVlVG9rZW5zAAAAAAEvAAAAKUluZGljYXRlcyBhbiBpZGVudGl0eSBjYW5ub3QgYmUgdmVyaWZpZWQuAAAAAAAAGklkZW50aXR5VmVyaWZpY2F0aW9uRmFpbGVkAAAAAAEwAAAAQUluZGljYXRlcyB0aGUgdHJhbnNmZXIgZG9lcyBub3QgY29tcGx5IHdpdGggdGhlIGNvbXBsaWFuY2UgcnVsZXMuAAAAAAAAFFRyYW5zZmVyTm90Q29tcGxpYW50AAABMQAAAEdJbmRpY2F0ZXMgdGhlIG1pbnQgb3BlcmF0aW9uIGRvZXMgbm90IGNvbXBseSB3aXRoIHRoZSBjb21wbGlhbmNlIHJ1bGVzLgAAAAAQTWludE5vdENvbXBsaWFudAAAATIAAAAtSW5kaWNhdGVzIHRoZSBjb21wbGlhbmNlIGNvbnRyYWN0IGlzIG5vdCBzZXQuAAAAAAAAEENvbXBsaWFuY2VOb3RTZXQAAAEzAAAAJEluZGljYXRlcyB0aGUgb25jaGFpbiBJRCBpcyBub3Qgc2V0LgAAAA9PbmNoYWluSWROb3RTZXQAAAABNAAAACFJbmRpY2F0ZXMgdGhlIHZlcnNpb24gaXMgbm90IHNldC4AAAAAAAANVmVyc2lvbk5vdFNldAAAAAAAATUAAAA7SW5kaWNhdGVzIHRoZSBjbGFpbSB0b3BpY3MgYW5kIGlzc3VlcnMgY29udHJhY3QgaXMgbm90IHNldC4AAAAAG0NsYWltVG9waWNzQW5kSXNzdWVyc05vdFNldAAAAAE2AAAAPEluZGljYXRlcyB0aGUgaWRlbnRpdHkgcmVnaXN0cnkgc3RvcmFnZSBjb250cmFjdCBpcyBub3Qgc2V0LgAAAB1JZGVudGl0eVJlZ2lzdHJ5U3RvcmFnZU5vdFNldAAAAAAAATcAAAA0SW5kaWNhdGVzIHRoZSBpZGVudGl0eSB2ZXJpZmllciBjb250cmFjdCBpcyBub3Qgc2V0LgAAABZJZGVudGl0eVZlcmlmaWVyTm90U2V0AAAAAAE4AAAAREluZGljYXRlcyB0aGUgb2xkIGFjY291bnQgYW5kIG5ldyBhY2NvdW50IGhhdmUgZGlmZmVyZW50IGlkZW50aXRpZXMuAAAAEElkZW50aXR5TWlzbWF0Y2gAAAE5",
        "AAAABQAAAC9FdmVudCBlbWl0dGVkIHdoZW4gdG9rZW4gb25jaGFpbiBJRCBpcyB1cGRhdGVkLgAAAAAAAAAAFVRva2VuT25jaGFpbklkVXBkYXRlZAAAAAAAAAEAAAAYdG9rZW5fb25jaGFpbl9pZF91cGRhdGVkAAAAAQAAAAAAAAAKb25jaGFpbl9pZAAAAAAAEwAAAAEAAAAC",
        "AAAABQAAACxFdmVudCBlbWl0dGVkIHdoZW4gYSByZWNvdmVyeSBpcyBzdWNjZXNzZnVsLgAAAAAAAAAPUmVjb3ZlcnlTdWNjZXNzAAAAAAEAAAAQcmVjb3Zlcnlfc3VjY2VzcwAAAAIAAAAAAAAAC29sZF9hY2NvdW50AAAAABMAAAABAAAAAAAAAAtuZXdfYWNjb3VudAAAAAATAAAAAQAAAAI=",
        "AAAABQAAADRFdmVudCBlbWl0dGVkIHdoZW4gYW4gYWRkcmVzcyBpcyBmcm96ZW4gb3IgdW5mcm96ZW4uAAAAAAAAAA1BZGRyZXNzRnJvemVuAAAAAAAAAQAAAA5hZGRyZXNzX2Zyb3plbgAAAAAAAgAAAAAAAAAMdXNlcl9hZGRyZXNzAAAAEwAAAAEAAAAAAAAACWlzX2Zyb3plbgAAAAAAAAEAAAABAAAAAg==",
        "AAAABQAAACVFdmVudCBlbWl0dGVkIHdoZW4gdG9rZW5zIGFyZSBmcm96ZW4uAAAAAAAAAAAAAAxUb2tlbnNGcm96ZW4AAAABAAAADXRva2Vuc19mcm96ZW4AAAAAAAACAAAAAAAAAAx1c2VyX2FkZHJlc3MAAAATAAAAAQAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAI=",
        "AAAABQAAACdFdmVudCBlbWl0dGVkIHdoZW4gdG9rZW5zIGFyZSB1bmZyb3plbi4AAAAAAAAAAA5Ub2tlbnNVbmZyb3plbgAAAAAAAQAAAA90b2tlbnNfdW5mcm96ZW4AAAAAAgAAAAAAAAAMdXNlcl9hZGRyZXNzAAAAEwAAAAEAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAC",
        "AAAABQAAACVFdmVudCBlbWl0dGVkIHdoZW4gdG9rZW5zIGFyZSBtaW50ZWQuAAAAAAAAAAAAAARNaW50AAAAAQAAAARtaW50AAAAAgAAAAAAAAACdG8AAAAAABMAAAABAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAAg==",
        "AAAABQAAACVFdmVudCBlbWl0dGVkIHdoZW4gdG9rZW5zIGFyZSBidXJuZWQuAAAAAAAAAAAAAARCdXJuAAAAAQAAAARidXJuAAAAAgAAAAAAAAAEZnJvbQAAABMAAAABAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAAg==",
        "AAAABQAAAC5FdmVudCBlbWl0dGVkIHdoZW4gY29tcGxpYW5jZSBjb250cmFjdCBpcyBzZXQuAAAAAAAAAAAADUNvbXBsaWFuY2VTZXQAAAAAAAABAAAADmNvbXBsaWFuY2Vfc2V0AAAAAAABAAAAAAAAAApjb21wbGlhbmNlAAAAAAATAAAAAQAAAAI=",
        "AAAABQAAADxFdmVudCBlbWl0dGVkIHdoZW4gY2xhaW0gdG9waWNzIGFuZCBpc3N1ZXJzIGNvbnRyYWN0IGlzIHNldC4AAAAAAAAAGENsYWltVG9waWNzQW5kSXNzdWVyc1NldAAAAAEAAAAcY2xhaW1fdG9waWNzX2FuZF9pc3N1ZXJzX3NldAAAAAEAAAAAAAAAGGNsYWltX3RvcGljc19hbmRfaXNzdWVycwAAABMAAAABAAAAAg==",
        "AAAABQAAADVFdmVudCBlbWl0dGVkIHdoZW4gaWRlbnRpdHkgdmVyaWZpZXIgY29udHJhY3QgaXMgc2V0LgAAAAAAAAAAAAATSWRlbnRpdHlWZXJpZmllclNldAAAAAABAAAAFWlkZW50aXR5X3ZlcmlmaWVyX3NldAAAAAAAAAEAAAAAAAAAEWlkZW50aXR5X3ZlcmlmaWVyAAAAAAAAEwAAAAEAAAAC",
        "AAAAAgAAAD1TdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgdmF1bHQgZXh0ZW5zaW9uAAAAAAAAAAAAAA9WYXVsdFN0b3JhZ2VLZXkAAAAAAgAAAAAAAAAyU3RvcmVzIHRoZSBhZGRyZXNzIG9mIHRoZSB2YXVsdCdzIHVuZGVybHlpbmcgYXNzZXQAAAAAAAxBc3NldEFkZHJlc3MAAAAAAAAAL1N0b3JlcyB0aGUgdmlydHVhbCBkZWNpbWFscyBvZmZzZXQgb2YgdGhlIHZhdWx0AAAAABVWaXJ0dWFsRGVjaW1hbHNPZmZzZXQAAAA=",
        "AAAABAAAAAAAAAAAAAAAD1ZhdWx0VG9rZW5FcnJvcgAAAAALAAAANkluZGljYXRlcyBhY2Nlc3MgdG8gdW5pbml0aWFsaXplZCB2YXVsdCBhc3NldCBhZGRyZXNzLgAAAAAAF1ZhdWx0QXNzZXRBZGRyZXNzTm90U2V0AAAAAZAAAAAySW5kaWNhdGVzIHRoYXQgdmF1bHQgYXNzZXQgYWRkcmVzcyBpcyBhbHJlYWR5IHNldC4AAAAAABtWYXVsdEFzc2V0QWRkcmVzc0FscmVhZHlTZXQAAAABkQAAADxJbmRpY2F0ZXMgdGhhdCB2YXVsdCB2aXJ0dWFsIGRlY2ltYWxzIG9mZnNldCBpcyBhbHJlYWR5IHNldC4AAAAkVmF1bHRWaXJ0dWFsRGVjaW1hbHNPZmZzZXRBbHJlYWR5U2V0AAABkgAAADdJbmRpY2F0ZXMgdGhlIGFtb3VudCBpcyBub3QgYSB2YWxpZCB2YXVsdCBhc3NldHMgdmFsdWUuAAAAABhWYXVsdEludmFsaWRBc3NldHNBbW91bnQAAAGTAAAAN0luZGljYXRlcyB0aGUgYW1vdW50IGlzIG5vdCBhIHZhbGlkIHZhdWx0IHNoYXJlcyB2YWx1ZS4AAAAAGFZhdWx0SW52YWxpZFNoYXJlc0Ftb3VudAAAAZQAAABBQXR0ZW1wdGVkIHRvIGRlcG9zaXQgbW9yZSBhc3NldHMgdGhhbiB0aGUgbWF4IGFtb3VudCBmb3IgYWRkcmVzcy4AAAAAAAAXVmF1bHRFeGNlZWRlZE1heERlcG9zaXQAAAABlQAAAD5BdHRlbXB0ZWQgdG8gbWludCBtb3JlIHNoYXJlcyB0aGFuIHRoZSBtYXggYW1vdW50IGZvciBhZGRyZXNzLgAAAAAAFFZhdWx0RXhjZWVkZWRNYXhNaW50AAABlgAAAEJBdHRlbXB0ZWQgdG8gd2l0aGRyYXcgbW9yZSBhc3NldHMgdGhhbiB0aGUgbWF4IGFtb3VudCBmb3IgYWRkcmVzcy4AAAAAABhWYXVsdEV4Y2VlZGVkTWF4V2l0aGRyYXcAAAGXAAAAQEF0dGVtcHRlZCB0byByZWRlZW0gbW9yZSBzaGFyZXMgdGhhbiB0aGUgbWF4IGFtb3VudCBmb3IgYWRkcmVzcy4AAAAWVmF1bHRFeGNlZWRlZE1heFJlZGVlbQAAAAABmAAAACpNYXhpbXVtIG51bWJlciBvZiBkZWNpbWFscyBvZmZzZXQgZXhjZWVkZWQAAAAAAB5WYXVsdE1heERlY2ltYWxzT2Zmc2V0RXhjZWVkZWQAAAAAAZkAAAAxSW5kaWNhdGVzIG92ZXJmbG93IGR1ZSB0byBtYXRoZW1hdGljYWwgb3BlcmF0aW9ucwAAAAAAAAxNYXRoT3ZlcmZsb3cAAAGa",
        "AAAABQAAAEJFdmVudCBlbWl0dGVkIHdoZW4gdW5kZXJseWluZyBhc3NldHMgYXJlIGRlcG9zaXRlZCBpbnRvIHRoZSB2YXVsdC4AAAAAAAAAAAAHRGVwb3NpdAAAAAABAAAAB2RlcG9zaXQAAAAABQAAAAAAAAAIb3BlcmF0b3IAAAATAAAAAQAAAAAAAAAEZnJvbQAAABMAAAABAAAAAAAAAAhyZWNlaXZlcgAAABMAAAABAAAAAAAAAAZhc3NldHMAAAAAAAsAAAAAAAAAAAAAAAZzaGFyZXMAAAAAAAsAAAAAAAAAAg==",
        "AAAABQAAAENFdmVudCBlbWl0dGVkIHdoZW4gc2hhcmVzIGFyZSBleGNoYW5nZWQgYmFjayBmb3IgdW5kZXJseWluZyBhc3NldHMuAAAAAAAAAAAIV2l0aGRyYXcAAAABAAAACHdpdGhkcmF3AAAABQAAAAAAAAAIb3BlcmF0b3IAAAATAAAAAQAAAAAAAAAIcmVjZWl2ZXIAAAATAAAAAQAAAAAAAAAFb3duZXIAAAAAAAATAAAAAQAAAAAAAAAGYXNzZXRzAAAAAAALAAAAAAAAAAAAAAAGc2hhcmVzAAAAAAALAAAAAAAAAAI=" ]),
      options
    )
  }
  public readonly fromJSON = {
    total_supply: this.txFromJSON<i128>,
        balance: this.txFromJSON<i128>,
        allowance: this.txFromJSON<i128>,
        transfer: this.txFromJSON<null>,
        transfer_from: this.txFromJSON<null>,
        approve: this.txFromJSON<null>,
        decimals: this.txFromJSON<u32>,
        name: this.txFromJSON<string>,
        symbol: this.txFromJSON<string>,
        allowed: this.txFromJSON<boolean>,
        allow_user: this.txFromJSON<null>,
        disallow_user: this.txFromJSON<null>,
        has_role: this.txFromJSON<Option<u32>>,
        get_role_member_count: this.txFromJSON<u32>,
        get_role_member: this.txFromJSON<string>,
        get_role_admin: this.txFromJSON<Option<string>>,
        get_admin: this.txFromJSON<Option<string>>,
        grant_role: this.txFromJSON<null>,
        revoke_role: this.txFromJSON<null>,
        renounce_role: this.txFromJSON<null>,
        renounce_admin: this.txFromJSON<null>,
        transfer_admin_role: this.txFromJSON<null>,
        accept_admin_transfer: this.txFromJSON<null>,
        set_role_admin: this.txFromJSON<null>,
        burn: this.txFromJSON<null>,
        burn_from: this.txFromJSON<null>
  }
}