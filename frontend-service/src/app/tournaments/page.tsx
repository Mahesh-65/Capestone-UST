"use client";

import { useQuery } from "@tanstack/react-query";
import { tournamentsApi } from "../../lib/api";

export default function TournamentsPage() {
  const { data } = useQuery({ queryKey: ["tournaments"], queryFn: async () => (await tournamentsApi.get("/tournaments")).data });
  return (
    <div className="card">
      <h2 className="text-xl font-semibold">Tournaments</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {(data ?? []).map((t: any) => (
          <li key={t.id} className="rounded border border-zinc-700 p-2">{t.name} - {t.sport} - {t.teams?.length || 0}/{t.max_teams} teams</li>
        ))}
      </ul>
    </div>
  );
}
