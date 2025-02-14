"use client";

import React from "react";
import { useAllEvents } from "@/hook/useAllEvents";

export function EventsList() {
  const { events, loading } = useAllEvents(5000); // poll a cada 5s

  return (
    <div className="border p-4 rounded-md w-full max-w-md">
      <h2 className="text-lg font-semibold mb-2">Eventos em tempo real</h2>
      {loading && <p className="text-sm text-gray-500">Carregando...</p>}
      <ul className="max-h-80 overflow-auto text-sm">
        {events.map((evt) => (
          <li key={evt.id}>
            <strong>{evt.eventType}</strong> - Token#{evt.tokenId} - Owner:{" "}
            {evt.owner} - ts: {evt.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
}
