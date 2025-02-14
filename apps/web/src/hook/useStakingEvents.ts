"use client";
import { useEffect, useState } from "react";

const PONDER_URL = "http://localhost:42069/graphql";

export function useStakingEvents() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const query = `
    query GetAllstakeEvents {
      eventss {
        items {
          id
          eventType
          owner
          tokenId
          timestamp
        }
        # totalCount
        # pageInfo {
        #   hasNextPage
        #   hasPreviousPage
        #   startCursor
        #   endCursor
        # }
      }
    }
    `;
    fetch(PONDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("\n\n =========== data ===========\n\n");
        console.log(data);
        console.log("\n\n ======================\n\n");

        setEvents(data.data.eventss.items);
      })
      .catch(console.error);
  }, []);

  return events;
}
