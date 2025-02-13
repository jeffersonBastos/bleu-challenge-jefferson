import { createConfig } from "ponder";
import { http } from "viem";
import BleuNFTJSON from "../contracts/out/BleuNFT.sol/BleuNFT.json";
import { ContractAbi } from "./abis/ContractAbi";

export default createConfig({
  networks: {
    anvil_localhost_testnet: {
      chainId: 31337,
      // This is Anvil's default RPC URL. Make sure you're running it.
      transport: http("http://localhost:8545"),
    },
  },
  contracts: {
    BleuNFT: {
      network: "anvil_localhost_testnet",
      // TODO: Replace with the actual abi of the contract
      // Note: You'll probably want to use a mergeAbis function to merge the abi with the erc721 abi
      abi: ContractAbi,
      // TODO: Replace with the actual address of the contract
      address: "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e",
      startBlock: 1,
    },
  },
});
