"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

type TokenCardProps = {
  tokenId: string;
  onStake: (tokenId: string, setLoading: (b: boolean) => void) => void;
  onUnstake: (tokenId: string, setLoading: (b: boolean) => void) => void;
};

export function TokenCard({ tokenId, onStake, onUnstake }: TokenCardProps) {
  // loading individual
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="border p-3 rounded-md flex items-center justify-between">
      <div>
        <p className="font-semibold">Token #{tokenId}</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() => onStake(tokenId, setIsLoading)}
          disabled={isLoading}
        >
          {isLoading ? "..." : "Stake"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => onUnstake(tokenId, setIsLoading)}
          disabled={isLoading}
        >
          {isLoading ? "..." : "Unstake"}
        </Button>
      </div>
    </div>
  );
}
