"use client";

import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "../../lib/api";

export default function AdminPage() {
  const { data } = useQuery({ queryKey: ["admin-analytics"], queryFn: async () => (await notificationsApi.get("/analytics/overview")).data });
  return (
    <div className="card">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>
      <p className="mt-2 text-zinc-400">Platform analytics from cross-service aggregation.</p>
      <pre className="mt-3 overflow-x-auto text-xs">{JSON.stringify(data ?? {}, null, 2)}</pre>
    </div>
  );
}
