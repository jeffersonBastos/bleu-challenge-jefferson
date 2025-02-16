"use client";

import { useEffect, useState, useCallback } from "react";
import { PONDER_GRAPHQL_URL } from "./env";
import { useAccount } from "wagmi";

export interface UserData {
  id: string;
  totalTokens: string;
  stakedCount: number;
  rewardBalance: string;
  currentAttestation?: string | null;
  updatedAt: string;
}

export function useUser() {
  const { address } = useAccount();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const query = `
          query GetUser($id: String!) {
            user(id: $id) {
              id
              totalTokens
              stakedCount
              rewardBalance
              currentAttestation
              updatedAt
            }
          }
        `;
      const response = await fetch(PONDER_GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: { id: address.toLowerCase() },
        }),
      }).then((res) => res.json());
      const userData: UserData | null = response?.data?.user || null;
      setUser(userData);
    } catch (error) {
      //TODO - handle error
      console.error("useUser Error:", error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchUser();
  }, [address, fetchUser]);

  return { user, loading, refetchUser: fetchUser };
}
