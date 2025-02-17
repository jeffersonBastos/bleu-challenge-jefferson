"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";

import { RewardsSection } from "./components/rewardsSection";
import { useBleuNFT } from "../../hook/useBleuNFT";
import { useUser } from "../../hook/useUser";

const TOKENS_NEEDED_FOR_MASTERSTAKER = 5;

export default function DashboardPage() {
  const { user, refetchUser } = useUser();
  const { isConnected } = useAccount();
  const { claimRewards } = useBleuNFT();

  async function handleClaimRewards() {
    try {
      await claimRewards();
    } catch (err: any) {
      alert(`Error claiming rewards: ${err?.message ?? err}`);
      console.error(err);
    }
  }
  if (!isConnected) {
    return (
      <div className="p-4 flex justify-center">
        <p>Connect your wallet first.</p>
      </div>
    );
  }

  return (
    <div className="relative p-4 flex  flex-col gap-6 ml-auto mr-auto w-full max-w-xl">
      <RewardsSection
        stakedCount={user?.stakedCount || 0}
        onClaim={handleClaimRewards}
      />
    </div>
  );
}
