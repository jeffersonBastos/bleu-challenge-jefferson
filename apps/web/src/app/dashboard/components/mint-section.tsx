"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useBleuNFT } from "@/hook/useBleuNFT";
import { useUserTokens } from "../../../hook/useUserTokens";

type MintSectionProps = {
  isContractOwner: boolean;
  refetchTokens: () => Promise<void>;
};

export function MintSection({
  isContractOwner,
  refetchTokens,
}: MintSectionProps) {
  const { mint } = useBleuNFT();
  const [toAddress, setToAddress] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isContractOwner) {
    return null;
  }

  async function handleMint() {
    try {
      if (!toAddress) return alert("Fill in the destination address");
      setLoading(true);
      const tx = await mint(toAddress as `0x${string}`);
      //TODO - handle successfully message
      alert("Mint completed successfully!");
      await refetchTokens();
    } catch (err) {
      //TODO - handle error
      console.log(err);
      alert(`Mint Error: ${err}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border p-4 rounded-md">
      <h2 className="text-lg font-semibold mb-2">Mint Token</h2>
      <div className="flex flex-col gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Address 0x..."
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
        />
        <Button onClick={handleMint} disabled={loading}>
          {loading ? "Minting..." : "Mint"}
        </Button>
      </div>
    </div>
  );
}
