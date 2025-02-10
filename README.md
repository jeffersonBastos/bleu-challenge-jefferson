# Bleu NFT Staking + Indexer Challenge

Welcome to the **Bleu** challenge! This monorepo contains a full-stack dapp implementation for NFT staking with event indexing.

## Project Structure

```
├── apps/
│   ├── contracts/       # Solidity smart contracts
│   ├── web/            # Next.js frontend
│   └── indexer/        # Ponder indexer
```

## Key Features

- **Smart Contract**: ERC721 NFT with staking capabilities
- **Frontend**: Next.js app with wallet integration
- **Indexer**: Ponder-based event indexing with GraphQL API

## Getting Started

### Prerequisites

- Node.js 20.9+ (with corepack enabled)

### Quick Start

```bash
# Enable corepack (if not already enabled)
corepack enable

# Enable pnpm (one-time setup)
corepack prepare pnpm@10.2.1 --activate

# Install dependencies
pnpm install

# Set up environment variables
pnpm setup:env

# Start all services in development mode
pnpm dev
```

### Development Commands

```bash
# Start individual services
pnpm dev:web        # Start frontend
pnpm dev:indexer    # Start indexer
pnpm dev:anvil      # Start local blockchain

# Build
pnpm build          # Build all packages
pnpm build:web      # Build frontend only
pnpm build:indexer  # Build indexer only
pnpm build:contracts # Build contracts only

# Test
pnpm test           # Run all tests
pnpm test:web       # Run frontend tests
pnpm test:indexer   # Run indexer tests
pnpm test:contracts # Run contract tests

# Linting & Formatting
pnpm check         # Check code style and format
pnpm typecheck     # Run type checking

# Clean
pnpm clean         # Clean all build artifacts
```

### Smart Contracts

```bash
# Build contracts
pnpm contracts:build

# Run contract tests
pnpm contracts:test

# Deploy to local network
pnpm contracts:deploy

# Deploy to testnet (Sepolia)
pnpm contracts:deploy:testnet
```

See [apps/contracts/README.md](apps/contracts/README.md) for contract-specific documentation.

## Frontend

The Next.js frontend features:

- Wallet connection (via ConnectKit)
- NFT minting interface
- Staking management
- Real-time updates via GraphQL

See [apps/web/README.md](apps/web/README.md) for frontend-specific documentation.

## Indexer

The Ponder indexer:

- Indexes NFT transfers and staking events
- Provides GraphQL API for querying NFT states
- Supports filtering and pagination

See [apps/indexer/README.md](apps/indexer/README.md) for indexer-specific documentation.

## GraphQL API

Query examples:

```graphql
# Get all staked NFTs
query GetStakedNFTs {
  nfts(where: { staked: true }) {
    id
    owner
    stakedAt
  }
}

# Get recent staking events
query GetStakingEvents {
  stakingEvents(orderBy: timestamp, orderDirection: desc, first: 10) {
    id
    tokenId
    eventType
    timestamp
  }
}
```

## Testing & Linting

```bash
# Run all tests
pnpm test

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type checking
pnpm typecheck
```

## Build

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build:web
pnpm build:indexer
pnpm build:contracts
```

## Deployment

The project can be deployed to:

- Smart Contracts: Sepolia testnet
- Frontend: Vercel
- Indexer: Your preferred hosting

```bash
# Deploy frontend to Vercel
pnpm deploy:web

# Deploy contracts to testnet
pnpm deploy:contracts

# Deploy indexer
pnpm deploy:indexer
```

See individual package READMEs for specific deployment instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
