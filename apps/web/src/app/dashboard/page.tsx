"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";

import { useContractOwner } from "@/hook/useContractOwner";
import { useUserTokens } from "@/hook/useUserTokens";
import { useBleuNFT } from "@/hook/useBleuNFT";
import { useUser } from "../../hook/useUser";

import { MintSection } from "./components/mint-section";
import { TokenCard } from "./components/token-card";
import FeedbackOverlay from "../../components/feedback-overlay";
// import { RewardsSection } from "./components/rewardsSection";

const TOKENS_NEEDED_FOR_MASTERSTAKER = 5;

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const isContractOwner = useContractOwner();
  const { user, refetchUser } = useUser();
  const { tokens, loading: tokensLoading, refetchTokens } = useUserTokens();
  const { stake, unstake, claimRewards } = useBleuNFT();

  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const fetchData = useCallback(() => {
    refetchTokens();
    refetchUser();
  }, [refetchTokens, refetchUser]);

  const handleStake = useCallback(
    async (tokenId: number, setLoading: (loading: boolean) => void) => {
      try {
        setLoading(true);
        await stake(BigInt(tokenId));
        setFeedback({
          message: `Token ${tokenId} staked successfully!`,
          type: "success",
        });
        fetchData();
      } catch (err: any) {
        setFeedback({
          message: `Stake error: ${err?.message ?? err}`,
          type: "error",
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [stake, fetchData]
  );

  const handleUnstake = useCallback(
    async (tokenId: number, setLoading: (loading: boolean) => void) => {
      try {
        setLoading(true);
        await unstake(BigInt(tokenId));
        setFeedback({
          message: `Token ${tokenId} unstaked successfully!`,
          type: "success",
        });
        fetchData();
      } catch (err: any) {
        setFeedback({
          message: `Unstake error: ${err?.message ?? err}`,
          type: "error",
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [unstake, fetchData]
  );

  const tokensToMasterStaker =
    TOKENS_NEEDED_FOR_MASTERSTAKER - (user?.stakedCount || 0);

  // async function handleClaimRewards() {
  //   try {
  //     await claimRewards();
  //   } catch (err: any) {
  //     alert(`Error claiming rewards: ${err?.message ?? err}`);
  //     console.error(err);
  //   }
  // }

  if (!isConnected) {
    return (
      <div className="p-4 flex justify-center">
        <p>Connect your wallet first.</p>
      </div>
    );
  }

  return (
    <div className="relative p-4 flex flex-col gap-6">
      {feedback && (
        <FeedbackOverlay message={feedback.message} type={feedback.type} />
      )}

      <div className="flex flex-col gap-4">
        {/* Stake count and MasterStaker info */}
        <div className="flex items-center gap-4">
          <span className="text-sm">
            Staked tokens: <strong>{user?.stakedCount || 0}</strong>
          </span>
          {user?.currentAttestation ? (
            <span className="text-green-600">You are MasterStaker</span>
          ) : (
            <span className="text-gray-600">
              Stake {tokensToMasterStaker} more token
              {tokensToMasterStaker !== 1 ? "s" : ""} to become MasterStaker
            </span>
          )}
        </div>

        {/* <RewardsSection
          stakedCount={user?.stakedCount || 0}
          onClaim={handleClaimRewards}
        /> */}
      </div>

      {/* If you own the contract, display Mint block */}
      <MintSection
        isContractOwner={isContractOwner}
        refetchTokens={refetchTokens}
      />

      {/* List of user tokens */}
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-lg">Your BleuNFTs Tokens</h2>
        {tokensLoading ? (
          <p className="text-sm text-gray-500">Loading tokens...</p>
        ) : !tokens?.length ? (
          <p className="text-sm text-gray-500">You do not own any tokens.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {tokens.map((token) => (
              <TokenCard
                key={token.tokenId}
                token={token}
                onStake={handleStake}
                onUnstake={handleUnstake}
                isMasterStaker={!!user?.currentAttestation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
