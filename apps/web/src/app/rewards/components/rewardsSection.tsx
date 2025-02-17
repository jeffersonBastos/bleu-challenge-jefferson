"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { usePendingRewards } from "@/hook/usePendingReward";

interface RewardsSectionProps {
  stakedCount: number;
  onClaim: () => Promise<void>;
}

export function RewardsSection({ stakedCount, onClaim }: RewardsSectionProps) {
  const { pendingRewards, loading } = usePendingRewards(stakedCount);

  return (
    <div className="border p-4 rounded-md w-full max-w-sm mb-4">
      <h2 className="font-semibold mb-2">Rewards</h2>
      <div className="flex flex-col gap-2">
        <p>
          Pending Rewards:{" "}
          {loading ? "Loading..." : `${Number(pendingRewards) / 1e18} BREW`}
        </p>
        <Button onClick={onClaim} disabled={loading || pendingRewards === "0"}>
          Claim Rewards
        </Button>
      </div>
    </div>
  );
}
