"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../../lib/api";

export default function FindPlayersPage() {
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "password123",
    role: "user",
    sports_interests: "football",
    availability: "weekend evenings",
    location: "city center"
  });
  const { data, refetch } = useQuery({
    queryKey: ["players", sport, location],
    queryFn: async () => (await usersApi.get("/users", { params: { sport: sport || undefined, location: location || undefined } })).data
  });

  const createUser = async () => {
    await usersApi.post("/users/register", {
      ...form,
      sports_interests: form.sports_interests.split(",").map((s) => s.trim()).filter(Boolean)
    });
    await refetch();
  };

  return (
    <section className="page-grid">
      <div className="card stack">
        <h2>Find Players</h2>
        <label>Sport</label>
        <input value={sport} onChange={(e) => setSport(e.target.value)} placeholder="football" />
        <label>Location</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="indiranagar" />
        <button className="outline-btn" onClick={() => refetch()}>Search</button>
      </div>
      <div className="card stack">
        <h2>Add Player</h2>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
        <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" />
        <input value={form.sports_interests} onChange={(e) => setForm({ ...form, sports_interests: e.target.value })} placeholder="football, cricket" />
        <button className="primary-btn" onClick={createUser}>Create Player</button>
      </div>
      <div className="card">
        <h2>Players</h2>
        <div className="list">
        {(data ?? []).map((u: any) => (
          <div key={u.id} className="list-item">{u.name} - {u.sports_interests?.join(", ")} - {u.location || "N/A"} - {u.role}</div>
        ))}
        </div>
      </div>
    </section>
  );
}
