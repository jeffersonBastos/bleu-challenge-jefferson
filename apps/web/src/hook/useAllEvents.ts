"use client";

import { useEffect, useState } from "react";

// Ajuste conforme seu endpoint Ponder
import { PONDER_GRAPHQL_URL } from "./env";

interface EventItem {
  id: string;
  eventType: string;
  owner: string;
  tokenId: string;
  timestamp: string;
}

/**
 * Hook que retorna todos os eventos (Staked, Unstaked, Mint etc) do Ponder,
 * atualizando a cada X segundos para simular "em tempo real".
 */
export function useAllEvents(pollIntervalMs = 5000) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let intervalId: any;
    let cancelled = false;

    async function fetchEvents() {
      try {
        setLoading(true);
        const query = `
          query AllEvents {
            eventss {
              items {
                id
                eventType
                owner
                tokenId
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

        const items: EventItem[] = resp?.data?.eventss?.items || [];
        if (!cancelled) {
          setEvents(items);
        }
      } catch (err) {
        console.error("Erro ao buscar todos os eventos:", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    // Primeira busca imediata
    fetchEvents();

    // Polling a cada X segundos
    intervalId = setInterval(() => {
      fetchEvents();
    }, pollIntervalMs);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [pollIntervalMs]);

  return { events, loading };
}
