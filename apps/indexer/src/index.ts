import { ponder } from "ponder:registry";
import {
  NftEvent,
  Attestation,
  RewardClaim,
  RewardTokenMint,
  User,
  StakedNFT,
} from "ponder:schema";
import { log, upsertUser } from "./utils/helpers";

// ------------------ Handle BleuNFT: Mint - Stake - Unstake------------------

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

  const existingUser = await db.find(User, { id: userAddress });

  const newTotal = existingUser
    ? existingUser.totalTokens + BigInt(1)
    : BigInt(1);
  await upsertUser(db, userAddress, { totalTokens: newTotal });

  log("Mint (NFT)", tokenId);
});

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
    timestamp: BigInt(event.block.timestamp),
  });

  const existingUser = await db.find(User, { id: userAddress });
  const newStakedCount = existingUser ? existingUser.stakedCount + 1 : 1;
  await upsertUser(db, userAddress, { stakedCount: newStakedCount });

  log("Staked", tokenId);
});

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
  const existingUser = await db.find(User, { id: userAddress });
  const newStakedCount = existingUser
    ? Math.max(existingUser.stakedCount - 1, 0)
    : 0;
  await upsertUser(db, userAddress, { stakedCount: newStakedCount });

  log("Unstaked", tokenId);
});

// ------------------ Handle MasterStakerRegistry:AttestationGranted------------------
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

// ------------------ Handle Rewards------------------

// (Optional) Handler for RewardClaim
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

  await upsertUser(db, userAddress, { rewardBalance: BigInt(0) });

  console.log(`Rewards claimed by: ${userAddress} amount: ${amount}`);
});

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

  const existingUser = await db.find(User, { id: userAddress });
  const newRewardBalance = existingUser
    ? existingUser.rewardBalance + BigInt(amount)
    : BigInt(amount);
  await upsertUser(db, userAddress, { rewardBalance: newRewardBalance });

  console.log(`Reward token minted to: ${userAddress} amount: ${amount}`);
});
