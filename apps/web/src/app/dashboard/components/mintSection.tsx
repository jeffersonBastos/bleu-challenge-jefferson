"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useBleuNFTTx } from "@/hook//useBleuNFTTx";

type MintSectionProps = {
  isContractOwner: boolean;
};

export function MintSection({ isContractOwner }: MintSectionProps) {
  const { mint } = useBleuNFTTx();
  const [toAddress, setToAddress] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isContractOwner) {
    return null; // se não for owner, não mostra nada
  }

  async function handleMint() {
    try {
      if (!toAddress) return alert("Preencha o endereço de destino");
      setLoading(true);
      const tx = await mint(toAddress as `0x${string}`);
      console.log("Mint TX:", tx);
      alert("Mint realizado com sucesso!");
    } catch (err: any) {
      console.error(err);
      alert(`Erro no Mint: ${err.message ?? err}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border p-4 rounded-md w-full max-w-sm">
      <h2 className="text-lg font-semibold mb-2">Mint Token</h2>
      <div className="flex flex-col gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Endereço 0x..."
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
