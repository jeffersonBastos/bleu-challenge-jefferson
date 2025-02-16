"use client";

import { useEffect, useState, useCallback } from "react";
import { PONDER_GRAPHQL_URL } from "./env";
import { useAccount } from "wagmi";
import { Token } from "../lib/types";

export function useUserTokens() {
  const { address: userAddress } = useAccount();
  const [tokens, setUserTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserTokens = useCallback(async () => {
    if (!userAddress) return;
    setLoading(true);
    try {
      const query = `
          query GetUserTokens($user: String!) {
            nftEvents(
              where: { user: $user, eventType: "Mint" }
              orderBy: "timestamp"
            ) {
              items {
                tokenId
                timestamp
              }
            }
            stakedNFTs(
              where: { user: $user }
              orderBy: "timestamp"
            ) {
              items {
                tokenId
                timestamp
              }
            }
          }
        `;
      const response = await fetch(PONDER_GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { user: userAddress } }),
      }).then((res) => res.json());

      const editedTokens: Token[] = [];

      const stakedItems: Token[] = response?.data?.stakedNFTs?.items || [];
      editedTokens.push(
        ...stakedItems.map((token) => ({ ...token, staked: true }))
      );

      const allTokens: Token[] = response?.data?.nftEvents?.items || [];
      const unstakedTokens = allTokens.filter(
        (token) => !stakedItems.some((tk) => tk.tokenId === token.tokenId)
      );
      editedTokens.push(
        ...unstakedTokens.map((token) => ({ ...token, staked: false }))
      );

      setUserTokens(editedTokens);
    } catch (error) {
      //TODO - handle error
      console.error("UseTokens Error", error);
    } finally {
      setLoading(false);
    }
  }, [userAddress]);

  useEffect(() => {
    fetchUserTokens();
  }, [userAddress, fetchUserTokens]);

  return { tokens, loading, refetchTokens: fetchUserTokens };
}
