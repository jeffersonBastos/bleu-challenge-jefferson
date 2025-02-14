"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { PONDER_GRAPHQL_URL } from "./env";

/**
 * Hook que verifica se o usuário conectado possui attestation (MasterStaker).
 * Busca no Ponder (tabela `attestations`).
 */
export function useMasterStaker() {
  const { address } = useAccount();
  const [isMasterStaker, setIsMasterStaker] = useState(false);

  useEffect(() => {
    if (!address) {
      setIsMasterStaker(false);
      return;
    }
    let cancelled = false;

    async function checkAttestation() {
      try {
        const query = `
          query CheckAttestation {
            attestations(where: { user: "${address}" }) {
              items {
                id
                user
              }
            }
          }
        `;
        const resp = await fetch(PONDER_GRAPHQL_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        }).then((res) => res.json());

        const attItems = resp?.data?.attestations?.items || [];
        if (!cancelled) {
          setIsMasterStaker(attItems.length > 0);
        }
      } catch (err) {
        console.error("Erro ao buscar attestation:", err);
        setIsMasterStaker(false);
      }
    }

    checkAttestation();
    return () => {
      cancelled = true;
    };
  }, [address]);

  return isMasterStaker;
}
