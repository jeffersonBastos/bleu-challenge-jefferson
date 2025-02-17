"use client";

import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { ContractAbi } from "../../../indexer/abis/ContractAbi";
import { BLEU_NFT_ADDRESS } from "./env";

interface UsePendingRewardsReturn {
  pendingRewards: string;
  loading: boolean;
}

export function usePendingRewards(
  stakedCount: number
): UsePendingRewardsReturn {
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const [pendingRewards, setPendingRewards] = useState("0");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address || !publicClient) return;

    let cancelled = false;

    const checkRewards = async () => {
      try {
        setLoading(true);
        const lastClaimedBlock = await publicClient.readContract({
          address: BLEU_NFT_ADDRESS,
          abi: ContractAbi,
          functionName: "lastClaimedBlock",
          args: [address],
        });

        const currentBlock = await publicClient.getBlockNumber();
        const rewardPerBlock = BigInt("10000000000000000"); // 0.01 token per block
        const blockDelta = currentBlock - lastClaimedBlock;
        const rewards = blockDelta * BigInt(stakedCount) * rewardPerBlock;

        if (!cancelled) {
          setPendingRewards(rewards.toString());
        }
      } catch (error) {
        console.error("Error checking rewards:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    checkRewards();
    const interval = setInterval(checkRewards, 12000); // Check every ~block

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [address, publicClient, stakedCount]);

  return { pendingRewards, loading };
}
