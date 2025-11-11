#[soroban_sdk::contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    /// The contract failed to transfer XLM to the guesser
    FailedToTransferToGuesser = 1,
    /// The guesser failed to transfer XLM to the contract
    FailedToTransferFromGuesser = 2,
    /// The contract has no balance to transfer to the guesser
    NoBalanceToTransfer = 3,
    
}
