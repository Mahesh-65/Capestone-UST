"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { tournamentsApi, usersApi } from "../../lib/api";

export default function TournamentsPage() {
  const [form, setForm] = useState({ name: "", sport: "football", organizer_id: "", max_teams: 8 });
  const [team, setTeam] = useState({ tournament_id: "", team_name: "", captain_user_id: "" });
  const [fixtureId, setFixtureId] = useState("");
  const { data, refetch } = useQuery({ queryKey: ["tournaments"], queryFn: async () => (await tournamentsApi.get("/tournaments")).data });
  const { data: users } = useQuery({ queryKey: ["tournament-users"], queryFn: async () => (await usersApi.get("/users")).data });

  const createTournament = async () => {
    await tournamentsApi.post("/tournaments", form);
    await refetch();
  };
  const registerTeam = async () => {
    await tournamentsApi.post(`/tournaments/${team.tournament_id}/register-team`, null, { params: { team_name: team.team_name, captain_user_id: team.captain_user_id } });
    await refetch();
  };
  const generateFixtures = async () => {
    await tournamentsApi.post(`/tournaments/${fixtureId}/generate-fixtures`);
    await refetch();
  };

  return (
    <section className="page-grid">
      <div className="card stack">
        <h2>Create Tournament</h2>
        <input placeholder="Tournament name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Sport" value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} />
        <select value={form.organizer_id} onChange={(e) => setForm({ ...form, organizer_id: e.target.value })}>
          <option value="">Select organizer</option>
          {(users ?? []).map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <button className="primary-btn" onClick={createTournament}>Create Tournament</button>
      </div>
      <div className="card stack">
        <h2>Register Team</h2>
        <input placeholder="Tournament ID" value={team.tournament_id} onChange={(e) => setTeam({ ...team, tournament_id: e.target.value })} />
        <input placeholder="Team name" value={team.team_name} onChange={(e) => setTeam({ ...team, team_name: e.target.value })} />
        <select value={team.captain_user_id} onChange={(e) => setTeam({ ...team, captain_user_id: e.target.value })}>
          <option value="">Select captain</option>
          {(users ?? []).map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <button className="outline-btn" onClick={registerTeam}>Register Team</button>
      </div>
      <div className="card stack">
        <h2>Generate Fixtures</h2>
        <input placeholder="Tournament ID" value={fixtureId} onChange={(e) => setFixtureId(e.target.value)} />
        <button className="outline-btn" onClick={generateFixtures}>Generate</button>
      </div>
      <div className="card">
      <h2>Tournaments</h2>
      <div className="list">
        {(data ?? []).map((t: any) => (
          <div key={t.id} className="list-item">{t.name} - {t.sport} - {t.teams?.length || 0}/{t.max_teams} teams - ID: {t.id}</div>
        ))}
      </div>
      </div>
    </section>
  );
}
