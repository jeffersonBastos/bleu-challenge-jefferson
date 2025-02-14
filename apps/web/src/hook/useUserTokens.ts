"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { PONDER_GRAPHQL_URL } from "./env";

interface MintEvent {
  id: string;
  owner: string;
  tokenId: string;
  eventType: string; // deve ser "Mint"
  timestamp: string;
}

/**
 * Hook que retorna todos os tokenIds que o usuário recebeu em Mints.
 * (Simplesmente filtra eventType = "Mint" and owner = address)
 */
export function useUserTokens() {
  const { address } = useAccount();
  const [tokenIds, setTokenIds] = useState<string[]>([]);

  useEffect(() => {
    if (!address) {
      setTokenIds([]);
      return;
    }
    let cancelled = false;

    async function fetchTokens() {
      try {
        const query = `
          query GetMyMints {
            eventss(where: {
              owner: "${address}"
              eventType: "Mint"
            }) {
              items {
                id
                owner
                tokenId
                eventType
                timestamp
              }
            }
          }
        `;
        const resp = await fetch(PONDER_GRAPHQL_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        }).then((r) => r.json());

        const events: MintEvent[] = resp?.data?.eventss?.items || [];
        const distinctTokenIds = [...new Set(events.map((e) => e.tokenId))];

        if (!cancelled) {
          setTokenIds(distinctTokenIds);
        }
      } catch (err) {
        console.error("Erro ao buscar tokens do usuário:", err);
        setTokenIds([]);
      }
    }

    fetchTokens();
    return () => {
      cancelled = true;
    };
  }, [address]);

  return tokenIds;
}
