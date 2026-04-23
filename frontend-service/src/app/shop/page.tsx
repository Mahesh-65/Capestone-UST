"use client";

import { useQuery } from "@tanstack/react-query";
import { billingApi } from "../../lib/api";

export default function ShopPage() {
  const { data } = useQuery({ queryKey: ["products"], queryFn: async () => (await billingApi.get("/products")).data });
  return (
    <div className="card">
      <h2 className="text-xl font-semibold">Shop & Jerseys</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {(data ?? []).map((p: any) => (
          <li key={p.id} className="rounded border border-zinc-700 p-2">{p.name} - {p.category} - Rs {p.price} {p.customizable ? "(Customizable)" : ""}</li>
        ))}
      </ul>
    </div>
  );
}
