"use client";

import { useEffect, useState } from "react";
import { PONDER_GRAPHQL_URL } from "./env";

export interface NftEventItem {
  id: string;
  eventType: string;
  user: string;
  tokenId: number;
  blockNumber: number;
  timestamp: string;
}

export function useNftEvents(pollIntervalMs = 5000) {
  const [nftEvents, setNftEvents] = useState<NftEventItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let intervalId: any;

    async function fetchNftEvents() {
      try {
        setLoading(true);
        const query = `
          query AllNftEvents {
            nftEvents(orderBy: "timestamp") {
              items {
                id
                eventType
                user
                tokenId
                blockNumber
                timestamp
              }
            }
          }
        `;
        const response = await fetch(PONDER_GRAPHQL_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        }).then((res) => res.json());

        const items: NftEventItem[] = response?.data?.nftEvents?.items || [];
        if (!cancelled) {
          setNftEvents(items);
        }
      } catch (err) {
        // TODO - handle error
        console.error("NftEvents Error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchNftEvents();
    intervalId = setInterval(fetchNftEvents, pollIntervalMs);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [pollIntervalMs]);

  return { nftEvents, loading };
}
