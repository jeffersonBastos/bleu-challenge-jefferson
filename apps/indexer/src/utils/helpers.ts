import { User } from "ponder:schema";

export async function upsertUser(
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

export function log(eventType: string, tokenId: string) {
  console.log("\n=============================================\n");
  console.log(`${eventType} completed successfully. tokenId: ${tokenId}`);
  console.log("=============================================");
}
