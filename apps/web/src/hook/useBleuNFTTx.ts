"use client";

import { useWalletClient } from "wagmi";
import { ContractAbi } from "../../../indexer/abis/ContractAbi";

import { BLEU_NFT_ADDRESS } from "./env";

/**
 * Hook que expõe funções de transação (mint, stake, unstake) no BleuNFT.
 */
export function useBleuNFTTx() {
  const { data: walletClient } = useWalletClient();

  /**
   * Mint – (no seu contrato, a assinatura é: function mint(address to))
   * Se seu contrato estivesse aceitando tokenId (ex: `mint(address to, uint256 tokenId)`), ajuste.
   */
  async function mint(to: `0x${string}`) {
    if (!walletClient) throw new Error("Carteira não conectada");
    const txHash = await walletClient.writeContract({
      address: BLEU_NFT_ADDRESS,
      abi: ContractAbi,
      functionName: "mint",
      args: [to],
    });
    return txHash;
  }

  /**
   * Stake – (function stake(uint256 tokenId))
   */
  async function stake(tokenId: bigint) {
    if (!walletClient) throw new Error("Carteira não conectada");
    const txHash = await walletClient.writeContract({
      address: BLEU_NFT_ADDRESS,
      abi: ContractAbi,
      functionName: "stake",
      args: [tokenId],
    });
    return txHash;
  }

  /**
   * Unstake – (function unstake(uint256 tokenId))
   */
  async function unstake(tokenId: bigint) {
    if (!walletClient) throw new Error("Carteira não conectada");
    const txHash = await walletClient.writeContract({
      address: BLEU_NFT_ADDRESS,
      abi: ContractAbi,
      functionName: "unstake",
      args: [tokenId],
    });
    return txHash;
  }

  return { mint, stake, unstake };
}
