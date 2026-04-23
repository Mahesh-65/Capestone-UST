"use client";

import { useState } from "react";
import { billingApi } from "../../lib/api";
import { Button } from "../../components/ui/button";

export default function BillingPage() {
  const [result, setResult] = useState<any>(null);
  const splitExample = async () => {
    const payload = { total_amount: 2000, player_ids: ["u1", "u2", "u3", "u4", "u5", "u6", "u7", "u8", "u9", "u10"], description: "Turf rent split" };
    const res = await billingApi.post("/bills/split", payload);
    setResult(res.data);
  };
  return (
    <div className="card">
      <h2 className="text-xl font-semibold">Billing</h2>
      <p className="mt-2 text-zinc-400">One-click demo split: Rs 2000 / 10 players = Rs 200 each.</p>
      <Button className="mt-3" onClick={splitExample}>Run Split</Button>
      <pre className="mt-3 overflow-x-auto text-xs">{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
