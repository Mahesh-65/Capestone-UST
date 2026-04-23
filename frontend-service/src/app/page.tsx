"use client";

import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "../lib/api";

export default function HomePage() {
  const { data } = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: async () => (await notificationsApi.get("/analytics/overview")).data
  });
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="card">
        <h2 className="text-xl font-semibold">Platform Overview</h2>
        <pre className="mt-2 overflow-x-auto text-xs text-zinc-300">{JSON.stringify(data ?? {}, null, 2)}</pre>
      </div>
      <div className="card">
        <h2 className="text-xl font-semibold">Quick Start</h2>
        <p className="mt-2 text-zinc-300">Use the pages above to discover players, host games, book grounds, run tournaments, split bills, and place sports gear orders.</p>
      </div>
    </section>
  );
}
