import { createConfig } from "ponder";
import { http } from "viem";
import { ContractAbi } from "./abis/ContractAbi";
import { MasterStakerAbi } from "./abis/MasterStakerAbi";

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
      address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      startBlock: 1,
    },
    MasterStakerRegistry: {
      network: "anvil_localhost_testnet",
      abi: MasterStakerAbi,
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      startBlock: 1,
    },
  },
});
