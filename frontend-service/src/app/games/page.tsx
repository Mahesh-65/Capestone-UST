"use client";

import { useQuery } from "@tanstack/react-query";
import { gamesApi } from "../../lib/api";

export default function GamesPage() {
  const { data } = useQuery({ queryKey: ["games"], queryFn: async () => (await gamesApi.get("/games")).data });
  return (
    <div className="card">
      <h2 className="text-xl font-semibold">Games</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {(data ?? []).map((g: any) => (
          <li key={g.id} className="rounded border border-zinc-700 p-2">{g.title} - {g.sport} - {g.area} ({g.players?.length || 0}/{g.max_players})</li>
        ))}
      </ul>
    </div>
  );
}
