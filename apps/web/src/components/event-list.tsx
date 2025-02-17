"use client";

import React from "react";
import { useNftEvents } from "../hook/useNftEvents";
import { formatDate } from "../lib/utils";

export function EventsList() {
  const { loading, nftEvents } = useNftEvents(5000);

  return (
    <div className=" p-4 rounded-md max-w-md">
      <h2 className="text-lg font-bold mb-2">Events</h2>
      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <ul className="max-h-80 overflow-auto text-sm">
          {nftEvents.map((evt) => (
            <li key={evt.id} className="mb-1">
              <strong>{evt.eventType}</strong> - Token #{evt.tokenId} - Owner: -
              Date: {formatDate(evt.timestamp)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
