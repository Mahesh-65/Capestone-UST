"use client";

import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../../lib/api";

export default function FindPlayersPage() {
  const { data } = useQuery({ queryKey: ["players"], queryFn: async () => (await usersApi.get("/users")).data });
  return (
    <div className="card">
      <h2 className="text-xl font-semibold">Find Players</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {(data ?? []).map((u: any) => (
          <li key={u.id} className="rounded border border-zinc-700 p-2">{u.name} - {u.sports_interests?.join(", ")} - {u.location || "N/A"}</li>
        ))}
      </ul>
    </div>
  );
}
