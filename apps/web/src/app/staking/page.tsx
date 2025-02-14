"use client";

import { useBleuNFTTx } from "@/hook/useBleuNFTTx";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useStakingEvents } from "../../hook/useStakingEvents";

export default function StakingPage() {
  const { address } = useAccount();
  const { mint, stake, unstake } = useBleuNFTTx();
  const [tokenId, setTokenId] = useState("");
  const events = useStakingEvents();

  async function handleMint() {
    if (!address) return alert("Connect wallet first!");
    try {
      await mint(address as `0x${string}`);
      alert("Mint success!");
    } catch (err) {
      console.error(err);
      alert("Mint error, check console");
    }
  }

  async function handleStake() {
    try {
      await stake(BigInt(tokenId));
      alert("Stake success!");
    } catch (err) {
      console.error(err);
      alert("Stake error");
    }
  }

  async function handleUnstake() {
    try {
      await unstake(BigInt(tokenId));
      alert("Unstake success!");
    } catch (err) {
      console.error(err);
      alert("Unstake error");
    }
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Staking Page</h1>

      <div>
        <label>Token ID: </label>
        <input
          // className="border p-2"
          type="number"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <Button size={"default"} onClick={handleMint}>
          Mint
        </Button>
        <Button onClick={handleStake}>Stake</Button>
        <Button onClick={handleUnstake}>Unstake</Button>
      </div>

      {/* Parte do evento */}
      <h2 className="mt-6 text-lg font-semibold">Events</h2>
      <ul>
        {events.map((evt) => (
          <li key={evt.id}>
            {evt.eventType} - Owner: {evt.owner} - TokenID: {evt.tokenId} -{" "}
            {evt.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
}
