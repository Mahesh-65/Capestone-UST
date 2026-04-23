"use client";

import { useQuery } from "@tanstack/react-query";
import { venuesApi } from "../../lib/api";

export default function GroundsPage() {
  const { data } = useQuery({ queryKey: ["venues"], queryFn: async () => (await venuesApi.get("/venues")).data });
  return (
    <div className="card">
      <h2 className="text-xl font-semibold">Grounds & Turfs</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {(data ?? []).map((v: any) => (
          <li key={v.id} className="rounded border border-zinc-700 p-2">{v.name} - {v.sport} - {v.area} - Rs {v.price_per_hour}/hr</li>
        ))}
      </ul>
    </div>
  );
}
