"use client";

import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { ContractAbi } from "../../../indexer/abis/ContractAbi";

import { BLEU_NFT_ADDRESS } from "./env";

/**
 * Hook que lê do contrato a contagem de tokens staked (`userStakeCount(address)`).
 */
export function useUserStakeCount() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [stakeCount, setStakeCount] = useState<number>(0);

  useEffect(() => {
    if (!address) {
      setStakeCount(0);
      return;
    }
    let cancelled = false;

    async function fetchStakeCount() {
      try {
        if (!address || !publicClient) {
          setStakeCount(0);
          return;
        }
        const count = (await publicClient.readContract({
          address: BLEU_NFT_ADDRESS,
          abi: ContractAbi,
          functionName: "userStakeCount",
          args: [address],
        })) as bigint;

        if (!cancelled) {
          setStakeCount(Number(count));
        }
      } catch (err) {
        console.error("Erro ao ler userStakeCount:", err);
        setStakeCount(0);
      }
    }

    fetchStakeCount();
    return () => {
      cancelled = true;
    };
  }, [address, publicClient]);

  return stakeCount;
}
