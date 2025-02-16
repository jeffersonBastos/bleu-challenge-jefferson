import { onchainTable } from "ponder";

// Central table for user information
export const User = onchainTable("User", (t) => ({
  id: t.hex().primaryKey(),
  totalTokens: t.bigint().notNull(),
  stakedCount: t.integer().notNull(),
  rewardBalance: t.bigint().notNull(),
  currentAttestation: t.text(),
  updatedAt: t.bigint().notNull(),
}));

// Table for each staked NFT
export const StakedNFT = onchainTable("StakedNFT", (t) => ({
  tokenId: t.integer().primaryKey(),
  user: t.hex().notNull(), // User address (can be related to the User table)
  timestamp: t.bigint().notNull(),
}));

// Table for reward claim records
export const RewardClaim = onchainTable("RewardClaim", (t) => ({
  id: t.text().primaryKey(),
  user: t.hex().notNull(),
  amount: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  timestamp: t.bigint().notNull(),
}));

// Table for attestations (e.g., MasterStaker)
export const Attestation = onchainTable("Attestation", (t) => ({
  id: t.text().primaryKey(),
  user: t.hex().notNull(),
  attestationType: t.text().notNull(),
  createdAtTimestamp: t.bigint().notNull(),
}));

// Table for all NFT events (Mint, Staked, Unstaked, etc.)
export const NftEvent = onchainTable("NftEvent", (t) => ({
  id: t.text().primaryKey(),
  eventType: t.text().notNull(),
  user: t.hex().notNull(),
  tokenId: t.integer().notNull(),
  blockNumber: t.bigint().notNull(),
  timestamp: t.bigint().notNull(),
}));

// // Table for the Token contract (if it's necessary to index other tokens)
// export const Token = onchainTable("Token", (t) => ({
//   id: t.text().primaryKey(),
//   address: t.hex().notNull(),
//   name: t.text().notNull(),
//   createdAtTimestamp: t.bigint().notNull(),
// }));

// Table for mint events of BleuRewardToken
export const RewardTokenMint = onchainTable("RewardTokenMint", (t) => ({
  id: t.text().primaryKey(),
  user: t.hex().notNull(),
  amount: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  timestamp: t.bigint().notNull(),
}));
