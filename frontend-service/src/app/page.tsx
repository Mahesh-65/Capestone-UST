"use client";

import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "../lib/api";
import Link from "next/link";

export default function HomePage() {
  const { data } = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: async () => (await notificationsApi.get("/analytics/overview")).data
  });

  const counts = data?.counts ?? {};
  return (
    <section className="page-grid">
      <div className="card">
        <h2>Overview</h2>
        <p className="muted">Live service statistics</p>
        <div className="page-grid">
          {Object.keys(counts).map((k) => (
            <div key={k} className="card">
              <p className="muted" style={{ margin: 0 }}>{k}</p>
              <p className="stat-value" style={{ margin: "6px 0 0" }}>{counts[k]}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <h2>Quick Actions</h2>
        <p className="muted">Go directly to high-impact workflows.</p>
        <div className="list">
          <Link className="list-item" href="/find-players">Register players and set sports interests</Link>
          <Link className="list-item" href="/grounds">Create venues and book slots</Link>
          <Link className="list-item" href="/games">Create weekend or practice games</Link>
          <Link className="list-item" href="/billing">Split turf rent and track payments</Link>
        </div>
      </div>
      <div className="card">
        <h2>System Snapshot</h2>
        <pre className="mono">{JSON.stringify(data ?? {}, null, 2)}</pre>
      </div>
    </section>
  );
}
