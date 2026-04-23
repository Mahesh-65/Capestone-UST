"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../../lib/api";

export default function ProfilePage() {
  const [selectedUser, setSelectedUser] = useState("");
  const [update, setUpdate] = useState({ availability: "", location: "", rating: 0 });
  const [result, setResult] = useState<any>(null);
  const { data, refetch } = useQuery({ queryKey: ["profiles"], queryFn: async () => (await usersApi.get("/users")).data });
  const current = (data ?? []).find((u: any) => u.id === selectedUser) || data?.[0];

  const updateProfile = async () => {
    if (!selectedUser) return;
    const res = await usersApi.put(`/users/${selectedUser}`, update);
    setResult(res.data);
    await refetch();
  };

  return (
    <section className="page-grid">
      <div className="card stack">
        <h2>Profile Editor</h2>
        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">Select user</option>
          {(data ?? []).map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <input placeholder="Availability" value={update.availability} onChange={(e) => setUpdate({ ...update, availability: e.target.value })} />
        <input placeholder="Location" value={update.location} onChange={(e) => setUpdate({ ...update, location: e.target.value })} />
        <input type="number" placeholder="Rating" value={update.rating} onChange={(e) => setUpdate({ ...update, rating: Number(e.target.value) })} />
        <button className="primary-btn" onClick={updateProfile}>Update Profile</button>
      </div>
      <div className="card">
        <h2>Current User Data</h2>
        {!current ? <p className="muted">Create users first.</p> : <pre className="mono">{JSON.stringify(current, null, 2)}</pre>}
      </div>
      <div className="card">
        <h2>Update Response</h2>
        <pre className="mono">{JSON.stringify(result, null, 2)}</pre>
      </div>
    </section>
  );
}
