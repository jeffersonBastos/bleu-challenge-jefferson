import { parse } from "path";
import { ponder } from "ponder:registry";
import {
  NftEvent,
  Attestation,
  RewardClaim,
  RewardTokenMint,
  User,
  StakedNFT,
} from "ponder:schema";

// Função auxiliar para logs
function logs(eventType: string, tokenId: string) {
  console.log("\n=============================================\n");
  console.log(`${eventType} completed successfully. tokenId: ${tokenId}`);
  console.log("=============================================");
}

async function upsertUser(
  db: any,
  userAddress: string,
  updates: Partial<{
    totalTokens: bigint;
    stakedCount: number;
    rewardBalance: bigint;
    currentAttestation: string;
  }>
) {
  const now = BigInt(Date.now());
  const existing = await db.find(User, { id: userAddress });

  if (existing) {
    return db
      .update(User, { id: userAddress })
      .set({ ...updates, updatedAt: now });
  } else {
    return db.insert(User).values({
      id: userAddress,
      totalTokens: updates.totalTokens || BigInt(0),
      stakedCount: updates.stakedCount || 0,
      rewardBalance: updates.rewardBalance || BigInt(0),
      currentAttestation: updates.currentAttestation || null,
      updatedAt: now,
    });
  }
}

// ------------------ Handlers Existentes ------------------

// Handler para o evento Mint do BleuNFT
ponder.on("BleuNFT:Mint", async ({ event, context }) => {
  const { db } = context;
  const tokenId = event.args.tokenId.toString();
  const userAddress = event.args.to;

  await db.insert(NftEvent).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    eventType: "Mint",
    user: userAddress,
    tokenId: parseInt(tokenId),
    blockNumber: event.block.number,
    timestamp: BigInt(event.block.timestamp),
  });

  // Atualiza totalTokens do usuário (supondo que totalTokens representa, por exemplo, a quantidade de NFTs)
  const existingUser = await db.find(User, { id: userAddress });

  const newTotal = existingUser
    ? existingUser.totalTokens + BigInt(1)
    : BigInt(1);
  await upsertUser(db, userAddress, { totalTokens: newTotal });

  logs("Mint (NFT)", tokenId);
});

// Handler para o evento de Stake
ponder.on("BleuNFT:Staked", async ({ event, context }) => {
  const { db } = context;
  const tokenId = event.args.tokenId.toString();
  const userAddress = event.args.owner;

  await db.insert(NftEvent).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    eventType: "Staked",
    user: userAddress,
    tokenId: parseInt(tokenId),
    blockNumber: event.block.number,
    timestamp: BigInt(event.block.timestamp),
  });

  await db.insert(StakedNFT).values({
    tokenId: parseInt(tokenId),
    user: userAddress,
    stakeTimestamp: BigInt(event.block.timestamp),
  });

  const existingUser = await db.find(User, { id: userAddress });
  const newStakedCount = existingUser ? existingUser.stakedCount + 1 : 1;
  await upsertUser(db, userAddress, { stakedCount: newStakedCount });

  logs("Staked", tokenId);
});

// Handler para o evento de Unstake
ponder.on("BleuNFT:Unstaked", async ({ event, context }) => {
  const { db } = context;
  const tokenId = event.args.tokenId.toString();
  const userAddress = event.args.owner;

  await db.insert(NftEvent).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    eventType: "Unstaked",
    user: userAddress,
    tokenId: parseInt(tokenId),
    blockNumber: event.block.number,
    timestamp: BigInt(event.block.timestamp),
  });

  await db.delete(StakedNFT, { tokenId: parseInt(tokenId) });
  // { where: { id: stakedRecord.id } }
  const existingUser = await db.find(User, { id: userAddress });
  const newStakedCount = existingUser
    ? Math.max(existingUser.stakedCount - 1, 0)
    : 0;
  await upsertUser(db, userAddress, { stakedCount: newStakedCount });

  logs("Unstaked", tokenId);
});

// Handler para o evento AttestationGranted (MasterStaker)
ponder.on(
  "MasterStakerRegistry:AttestationGranted",
  async ({ event, context }) => {
    const { db } = context;
    const userAddress = event.args.user;

    await db.insert(Attestation).values({
      id: `${event.transaction.hash}-${event.log.logIndex}`,
      user: userAddress,
      attestationType: "MasterStaker",
      createdAtTimestamp: BigInt(event.block.timestamp),
    });

    await upsertUser(db, userAddress, { currentAttestation: "MasterStaker" });

    console.log(`Successfully granted Attestation to: ${userAddress}`);
  }
);

// (Opcional) Handler para RewardClaim se você quiser manter essa lógica separada
ponder.on("BleuNFT:RewardsClaimed", async ({ event, context }) => {
  const { db } = context;
  const userAddress = event.args.user;
  const amount = event.args.amount.toString();

  await db.insert(RewardClaim).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    user: userAddress,
    amount: BigInt(amount),
    blockNumber: event.block.number,
    timestamp: BigInt(event.block.timestamp),
  });

  // Exemplo: se desejar, pode ajustar o rewardBalance aqui (por exemplo, zerando após a reivindicação)
  await upsertUser(db, userAddress, { rewardBalance: BigInt(0) });

  console.log(`Rewards claimed by: ${userAddress} amount: ${amount}`);
});

// ------------------  HandlerBleuRewardToken ------------------

ponder.on("BleuRewardToken:Mint", async ({ event, context }) => {
  const { db } = context;
  const userAddress = event.args.to;
  const amount = event.args.amount.toString();

  await db.insert(RewardTokenMint).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    user: userAddress,
    amount: BigInt(amount),
    blockNumber: event.block.number,
    timestamp: BigInt(event.block.timestamp),
  });

  // Atualiza o saldo de reward do usuário na tabela User
  const existingUser = await db.find(User, { id: userAddress });
  const newRewardBalance = existingUser
    ? existingUser.rewardBalance + BigInt(amount)
    : BigInt(amount);
  await upsertUser(db, userAddress, { rewardBalance: newRewardBalance });

  console.log(`Reward token minted to: ${userAddress} amount: ${amount}`);
});
