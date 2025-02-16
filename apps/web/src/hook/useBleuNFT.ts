"use client";

import { useWalletClient } from "wagmi";
import { ContractAbi } from "../../../indexer/abis/ContractAbi";

import { BLEU_NFT_ADDRESS } from "./env";

export function useBleuNFT() {
  const { data: walletClient } = useWalletClient();

  async function mint(to: `0x${string}`) {
    if (!walletClient) throw new Error("Wallet not conected");
    const txHash = await walletClient.writeContract({
      address: BLEU_NFT_ADDRESS,
      abi: ContractAbi,
      functionName: "mint",
      args: [to],
    });
    return txHash;
  }

  async function stake(tokenId: bigint) {
    if (!walletClient) throw new Error("Wallet not conected");
    const txHash = await walletClient.writeContract({
      address: BLEU_NFT_ADDRESS,
      abi: ContractAbi,
      functionName: "stake",
      args: [tokenId],
    });
    return txHash;
  }

  async function unstake(tokenId: bigint) {
    if (!walletClient) throw new Error("Wallet not conected");
    const txHash = await walletClient.writeContract({
      address: BLEU_NFT_ADDRESS,
      abi: ContractAbi,
      functionName: "unstake",
      args: [tokenId],
    });
    return txHash;
  }

  async function claimRewards() {
    // not implemented
    return;
  }

  return { mint, stake, unstake, claimRewards };
}
