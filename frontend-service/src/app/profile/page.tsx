"use client";

import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../../lib/api";

export default function ProfilePage() {
  const { data } = useQuery({ queryKey: ["profiles"], queryFn: async () => (await usersApi.get("/users")).data });
  const first = data?.[0];
  return (
    <div className="card">
      <h2 className="text-xl font-semibold">Profile</h2>
      {!first ? <p className="mt-2 text-zinc-400">Create users via API to view profile data.</p> : <pre className="mt-3 text-xs">{JSON.stringify(first, null, 2)}</pre>}
    </div>
  );
}
