"use client";

import { usePublicClient, useWalletClient } from "wagmi";
// import BLEU_NFT from "../../../contracts/out/BleuNFT.sol/BleuNFT.json";
import { ContractAbi } from "../../../indexer/abis/ContractAbi";

//TODO ajustar env
// const CONTRACT_ADDRESS = process.env.PUBLIC_BLEU_NFT_ADDRESS as `0x${string}`;
const CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3" as `0x${string}`;

console.log("\n\n ========= CONTRACT_ADDRESS ========= \n\n");
console.log(CONTRACT_ADDRESS);

export function useBleuNFT() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const abi = ContractAbi;

  // async function mint(to: `0x${string}`, tokenId: bigint) {
  //   if (!walletClient) throw new Error("Wallet not connected");

  //   const hash = await walletClient.writeContract({
  //     abi,
  //     address: CONTRACT_ADDRESS,
  //     functionName: "mint",
  //     args: [to, tokenId],
  //   });
  //   console.log("Mint tx hash:", hash);
  // }

  async function stake(tokenId: bigint) {
    try {
      console.log("RONAAAALDO =========== error");

      if (!walletClient) throw new Error("Wallet not connected");
      const hash = await walletClient.writeContract({
        abi,
        address: CONTRACT_ADDRESS,
        functionName: "stake",
        args: [tokenId],
      });
      console.log(" ========== Stake tx hash:", hash);
    } catch (error) {
      console.log("RONAAAALDO =========== error");
      console.log(error);
      console.log(" =========== ");
    }
  }

  async function unstake(tokenId: bigint) {
    if (!walletClient) throw new Error("Wallet not connected");
    const hash = await walletClient.writeContract({
      abi,
      address: CONTRACT_ADDRESS,
      functionName: "unstake",
      args: [tokenId],
    });
    console.log("Unstake tx hash:", hash);
  }

  return {
    stake,
    unstake,
  };
}
