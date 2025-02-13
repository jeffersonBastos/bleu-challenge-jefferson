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
      address: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
      startBlock: 1,
    },
    MasterStakerRegistry: {
      network: "anvil_localhost_testnet",
      abi: MasterStakerAbi,
      address: "0x0B306BF915C4d645ff596e518fAf3F9669b97016",
      startBlock: 1,
    },
  },
});
