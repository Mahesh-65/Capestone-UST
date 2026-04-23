"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "../../lib/api";

export default function AdminPage() {
  const [note, setNote] = useState({ user_id: "", message: "", type: "booking-reminder" });
  const [lookupUserId, setLookupUserId] = useState("");
  const [result, setResult] = useState<any>(null);
  const { data, refetch } = useQuery({ queryKey: ["admin-analytics"], queryFn: async () => (await notificationsApi.get("/analytics/overview")).data });
  const { data: notes, refetch: refetchNotes } = useQuery({
    queryKey: ["notifications", lookupUserId],
    queryFn: async () => (lookupUserId ? (await notificationsApi.get(`/notifications/${lookupUserId}`)).data : [])
  });

  const sendNote = async () => {
    const res = await notificationsApi.post("/notifications", note);
    setResult(res.data);
    await refetchNotes();
    await refetch();
  };

  return (
    <section className="page-grid">
      <div className="card">
        <h2>Admin Dashboard</h2>
        <p className="muted">Platform analytics from cross-service aggregation.</p>
        <pre className="mono">{JSON.stringify(data ?? {}, null, 2)}</pre>
      </div>
      <div className="card stack">
        <h2>Send Notification</h2>
        <input placeholder="User ID" value={note.user_id} onChange={(e) => setNote({ ...note, user_id: e.target.value })} />
        <input placeholder="Type" value={note.type} onChange={(e) => setNote({ ...note, type: e.target.value })} />
        <textarea placeholder="Message" value={note.message} onChange={(e) => setNote({ ...note, message: e.target.value })} />
        <button className="primary-btn" onClick={sendNote}>Send</button>
      </div>
      <div className="card stack">
        <h2>User Notifications</h2>
        <input placeholder="Lookup User ID" value={lookupUserId} onChange={(e) => setLookupUserId(e.target.value)} />
        <button className="outline-btn" onClick={() => refetchNotes()}>Load</button>
        <div className="list">
          {(notes ?? []).map((n: any) => <div key={n.id} className="list-item">{n.type}: {n.message}</div>)}
        </div>
      </div>
      <div className="card">
        <h2>Last Action</h2>
        <pre className="mono">{JSON.stringify(result, null, 2)}</pre>
      </div>
    </section>
  );
}
