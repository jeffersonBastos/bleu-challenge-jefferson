"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Token } from "../../../lib/types";

const STAKE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface TokenCardProps {
  token: Token;
  onStake: (tokenId: number, setLoading: (loading: boolean) => void) => void;
  onUnstake: (tokenId: number, setLoading: (loading: boolean) => void) => void;
  isMasterStaker: boolean;
}

export function TokenCard({
  token,
  onStake,
  onUnstake,
  isMasterStaker,
}: TokenCardProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token.staked) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - Number(token.timestamp);
        const remaining = Math.max(0, STAKE_DURATION - elapsed);
        setTimeLeft(remaining);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const canUnstake = token.staked && timeLeft === 0 && isMasterStaker;
  const buttonDisabled = isLoading || (token.staked && !canUnstake);


  return (
    <div
      className={`border p-3 rounded-md flex items-center justify-between }`}
    >
      <div className="flex flex-col">
        <p className="font-semibold">Token #{token.tokenId}</p>

        {token.staked && timeLeft > 0 && (
          <p>Time remaining: {Math.ceil(timeLeft / 1000)}s</p>
        )}
      </div>
      <Button
        variant="secondary"
        onClick={() =>
          token.staked
            ? onUnstake(token.tokenId, setIsLoading)
            : onStake(token.tokenId, setIsLoading)
        }
        disabled={buttonDisabled}
        className={buttonDisabled ? "opacity-50" : ""}
      >
        {isLoading ? "..." : token.staked ? "UNSTAKE" : "STAKE"}
      </Button>
    </div>
  );
}
