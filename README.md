# Scaffold Stellar Frontend

_Under active development._

Frontend template for projects created with `stellar scaffold …`.

## Requirements

Before getting started, make sure you’ve met the requirements listed in the [Soroban documentation](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup) and that the following tools are installed :

- [Rust](https://www.rust-lang.org/tools/install)
- [Cargo](https://doc.rust-lang.org/cargo/) (comes with Rust)
- [Node.js](https://nodejs.org/en/download/package-manager) (v22, or higher)
- npm: e.g. sudo apt install npm on Ubuntu
- [Stellar CLI](https://github.com/stellar/stellar-core)
- [Git](https://git-scm.com/downloads)

## Installation

### Development Setup

```bash
just setup && just build
```

### Direct Installation

To install the executables directly:

```bash
# Install stellar-scaffold-cli
cargo install stellar-scaffold-cli

# Install stellar-registry-cli
cargo install stellar-registry-cli
```

## Quick Start

1. Install the required CLI tools:

```bash
# Install stellar-scaffold CLI
cargo install stellar-scaffold-cli

# Install registry CLI (needed for deployments)
cargo install stellar-registry-cli
```

2. Initialize a new project:

```bash
stellar scaffold init my-project
cd my-project
```

3. Set up your development environment:

```bash
# Copy and configure environment variables
cp .env.example .env

# Install frontend dependencies
npm install
```

4. Start development environment:

```bash
npm run dev
```

5. For testnet/mainnet deployment:

```bash
# First publish your contract to the registry
stellar registry publish

# Then deploy an instance with constructor parameters
stellar registry deploy \
  --deployed-name my-contract \
  --published-name my-contract \
  -- \
  --param1 value1

# Can access the help docs with --help
stellar registry deploy \
  --deployed-name my-contract \
  --published-name my-contract \
  -- \
  --help

# Install the deployed contract locally
stellar registry install my-contract
```

## Scaffold Initial Project Structure

When you run `stellar scaffold init`, it creates a frontend-focused project structure with example contracts:

```
my-project/                      # Your initialized project
├── contracts/                   # Example smart contracts
├── packages/                    # Auto-generated TypeScript clients
├── src/                         # Frontend React application
│   ├── components/              # React components
│   ├── contracts/               # Contract interaction helpers
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Application entry point
├── target/                      # Build artifacts and WASM files
├── environments.toml            # Environment configurations
├── package.json                 # Frontend dependencies
└── .env                         # Local environment variables
```

This template provides a ready-to-use frontend application with example smart contracts and their TypeScript clients. You can use these as reference while building your own contracts and UI. The frontend is set up with Vite, React, and includes basic components for interacting with the contracts.
