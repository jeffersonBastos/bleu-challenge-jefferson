import { onchainTable } from "ponder";

// Tabela central para informações do usuário
export const User = onchainTable("User", (t) => ({
  id: t.hex().primaryKey(), // Endereço da carteira
  totalTokens: t.bigint().notNull(), // Total de tokens do BleuNFT (ex.: NFTs ou outro)
  stakedCount: t.integer().notNull(), // Número de NFTs em stake
  rewardBalance: t.bigint().notNull(), // Saldo de tokens de reward (do BleuRewardToken)
  currentAttestation: t.text(), // Ex.: "MasterStaker" ou nulo
  updatedAt: t.bigint().notNull(), // Última atualização (timestamp)
}));

// Tabela para cada NFT em stake
export const StakedNFT = onchainTable("StakedNFT", (t) => ({
  tokenId: t.integer().primaryKey(),
  user: t.hex().notNull(), // Endereço do usuário (relacionado à tabela User)
  stakeTimestamp: t.bigint().notNull(), // Timestamp de quando o NFT foi staked
}));

// Tabela para registros de reivindicação de reward (se usado)
export const RewardClaim = onchainTable("RewardClaim", (t) => ({
  id: t.text().primaryKey(),
  user: t.hex().notNull(),
  amount: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  timestamp: t.bigint().notNull(),
}));

// Tabela para attestations (ex.: MasterStaker)
export const Attestation = onchainTable("Attestation", (t) => ({
  id: t.text().primaryKey(),
  user: t.hex().notNull(),
  attestationType: t.text().notNull(),
  createdAtTimestamp: t.bigint().notNull(),
}));

// Tabela para eventos de NFTs (Mint, Staked, Unstaked, etc.)
export const NftEvent = onchainTable("NftEvent", (t) => ({
  id: t.text().primaryKey(),
  eventType: t.text().notNull(), // Ex.: "Mint", "Staked", "Unstaked", etc.
  user: t.hex().notNull(),
  tokenId: t.integer().notNull(),
  blockNumber: t.bigint().notNull(),
  timestamp: t.bigint().notNull(),
}));

// // Tabela para o contrato Token (caso seja necessário indexar outros tokens)
// export const Token = onchainTable("Token", (t) => ({
//   id: t.text().primaryKey(),
//   address: t.hex().notNull(),
//   name: t.text().notNull(),
//   createdAtTimestamp: t.bigint().notNull(),
// }));

// Nova tabela para eventos de mint do BleuRewardToken
export const RewardTokenMint = onchainTable("RewardTokenMint", (t) => ({
  id: t.text().primaryKey(), // Ex.: transactionHash-logIndex
  user: t.hex().notNull(), // Endereço do destinatário
  amount: t.bigint().notNull(), // Quantidade de tokens mintados
  blockNumber: t.bigint().notNull(),
  timestamp: t.bigint().notNull(),
}));
