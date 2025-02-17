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

const TOKENS_NEEDED_FOR_MASTERSTAKER = 5;

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const isContractOwner = useContractOwner();
  const { user, refetchUser } = useUser();
  const { tokens, loading: tokensLoading, refetchTokens } = useUserTokens();
  const { stake, unstake } = useBleuNFT();

  const tokensToMasterStaker =
    TOKENS_NEEDED_FOR_MASTERSTAKER - (user?.stakedCount || 0);

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

  function fetchData() {
    console.log("fetchData");
    refetchTokens();
    refetchUser();
  }

  async function handleStake(
    tokenId: number,
    setLoading: (loading: boolean) => void
  ) {
    try {
      setLoading(true);
      await stake(BigInt(tokenId));
      fetchData();
      setFeedback({
        message: `Token ${tokenId} staked successfully!`,
        type: "success",
      });
    } catch (err: any) {
      setFeedback({
        message: `${err?.message ? err?.message : "Stake error"}`,
        type: "error",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUnstake(
    tokenId: number,
    setLoading: (loading: boolean) => void
  ) {
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
        message: `${err?.message ? err?.message : "Unstake error"}`,
        type: "error",
      });
      console.error(err);
    } finally {
      setLoading(false);
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
      {feedback && (
        <FeedbackOverlay message={feedback.message} type={feedback.type} />
      )}

      {/* Stake count and MasterStaker info */}
      <div className="flex  gap-1 flex-col items-start">
        <span>
          Staked tokens: <strong>{user?.stakedCount || 0}</strong>
        </span>
        {user?.currentAttestation ? (
          <span className="text-green-600">You are MasterStaker</span>
        ) : (
          <span className="text-gray-600">
            Stake{" "}
            <strong>
              {tokensToMasterStaker} more token
              {tokensToMasterStaker !== 1 ? "s" : ""}{" "}
            </strong>
            to become MasterStaker
          </span>
        )}
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
