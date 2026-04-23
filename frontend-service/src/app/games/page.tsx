"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { gamesApi, usersApi, venuesApi } from "../../lib/api";

export default function GamesPage() {
  const [game, setGame] = useState({ title: "", sport: "football", turf_id: "", area: "", type: "weekend", organizer_id: "", max_players: 10, weekend: true });
  const { data, refetch } = useQuery({ queryKey: ["games"], queryFn: async () => (await gamesApi.get("/games")).data });
  const { data: users } = useQuery({ queryKey: ["game-users"], queryFn: async () => (await usersApi.get("/users")).data });
  const { data: venues } = useQuery({ queryKey: ["game-venues"], queryFn: async () => (await venuesApi.get("/venues")).data });

  const createGame = async () => {
    await gamesApi.post("/games", game);
    await refetch();
  };

  return (
    <section className="page-grid">
      <div className="card stack">
        <h2>Create Game</h2>
        <input placeholder="Game title" value={game.title} onChange={(e) => setGame({ ...game, title: e.target.value })} />
        <input placeholder="Sport" value={game.sport} onChange={(e) => setGame({ ...game, sport: e.target.value })} />
        <select value={game.organizer_id} onChange={(e) => setGame({ ...game, organizer_id: e.target.value })}>
          <option value="">Select organizer</option>
          {(users ?? []).map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <select value={game.turf_id} onChange={(e) => setGame({ ...game, turf_id: e.target.value })}>
          <option value="">Select turf</option>
          {(venues ?? []).map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
        <input placeholder="Area" value={game.area} onChange={(e) => setGame({ ...game, area: e.target.value })} />
        <button className="primary-btn" onClick={createGame}>Create Game</button>
      </div>
      <div className="card">
      <h2>Games</h2>
      <div className="list">
        {(data ?? []).map((g: any) => (
          <div key={g.id} className="list-item">{g.title} - {g.sport} - {g.area} ({g.players?.length || 0}/{g.max_players})</div>
        ))}
      </div>
      </div>
    </section>
  );
}
