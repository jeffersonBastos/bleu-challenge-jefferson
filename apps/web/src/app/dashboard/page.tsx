"use client";

import React from "react";
import { useAccount } from "wagmi";

import { useContractOwner } from "@/hook/useContractOwner";
import { useMasterStaker } from "@/hook/useMasterStaker";
import { useUserStakeCount } from "@/hook/useUserStakeCount";
import { useUserTokens } from "@/hook/useUserTokens";
import { useBleuNFTTx } from "@/hook/useBleuNFTTx";

import { MintSection } from "./components/mintSection";
import { TokenCard } from "./components/tokenCard";
import { EventsList } from "./components/eventsList";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();

  const isContractOwner = useContractOwner();
  const isMasterStaker = useMasterStaker();
  const stakeCount = useUserStakeCount();
  const myTokenIds = useUserTokens();

  // Hook com funções de transação
  const { stake, unstake } = useBleuNFTTx();

  // Funções repassadas aos <TokenCard />
  async function handleStake(
    tokenId: string,
    setLoading: (b: boolean) => void
  ) {
    try {
      setLoading(true);
      await stake(BigInt(tokenId));
      alert(`Token ${tokenId} staked com sucesso!`);
    } catch (err: any) {
      alert(`Erro no stake: ${err?.message ?? err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUnstake(
    tokenId: string,
    setLoading: (b: boolean) => void
  ) {
    try {
      setLoading(true);
      await unstake(BigInt(tokenId));
      alert(`Token ${tokenId} unstaked com sucesso!`);
    } catch (err: any) {
      alert(`Erro no unstake: ${err?.message ?? err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!isConnected) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p>Conecte sua carteira primeiro.</p>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-6">
      <h1 className="text-xl font-bold">Dashboard</h1>

      {/* Info de stake count e MasterStaker */}
      <div className="flex items-center gap-4">
        <span className="text-sm">
          Staked tokens: <strong>{stakeCount}</strong>
        </span>
        {isMasterStaker ? (
          <span className="text-green-600">Você é MasterStaker</span>
        ) : (
          <span className="text-red-500">Você não é MasterStaker</span>
        )}
      </div>

      {/* Se for dono do contrato, exibe bloco de Mint */}
      <MintSection isContractOwner={isContractOwner} />

      {/* Lista dos tokens do usuário */}
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold text-lg">Seus Tokens (Mintados)</h2>
        {myTokenIds.length === 0 ? (
          <p className="text-sm text-gray-500">
            Você não possui nenhum token (Mint).
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {myTokenIds.map((tokenId) => (
              <TokenCard
                key={tokenId}
                tokenId={tokenId}
                onStake={handleStake}
                onUnstake={handleUnstake}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lista de todos os eventos (em tempo real) */}
      <div className="mt-4">
        <EventsList />
      </div>
    </div>
  );
}
