"use client";

import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { ContractAbi } from "../../../indexer/abis/ContractAbi";
import { BLEU_NFT_ADDRESS } from "./env";
export function useContractOwner() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [isContractOwner, setIsContractOwner] = useState(false);

  useEffect(() => {
    if (!address || !publicClient) {
      setIsContractOwner(false);
      return;
    }
    let cancelled = false;

    async function checkOwner() {
      try {
        if (!address || !publicClient) {
          setIsContractOwner(false);
          return;
        }
        const contractOwner = (await publicClient.readContract({
          address: BLEU_NFT_ADDRESS,
          abi: ContractAbi,
          functionName: "contractOwner",
        })) as string;

        if (!cancelled) {
          setIsContractOwner(
            contractOwner.toLowerCase() === address.toLowerCase()
          );
        }
      } catch (err) {
        console.error("Erro ao ler contractOwner:", err);
        setIsContractOwner(false);
      }
    }

    checkOwner();
    return () => {
      cancelled = true;
    };
  }, [address, publicClient]);

  return isContractOwner;
}
