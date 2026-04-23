"use client";

import { useState } from "react";
import { billingApi } from "../../lib/api";

export default function BillingPage() {
  const [amount, setAmount] = useState(2000);
  const [players, setPlayers] = useState("u1,u2,u3,u4,u5,u6,u7,u8,u9,u10");
  const [description, setDescription] = useState("Weekend turf rent");
  const [result, setResult] = useState<any>(null);
  const [billId, setBillId] = useState("");
  const [paidUserId, setPaidUserId] = useState("");
  const splitExample = async () => {
    const payload = {
      total_amount: Number(amount),
      player_ids: players.split(",").map((p) => p.trim()).filter(Boolean),
      description
    };
    const res = await billingApi.post("/bills/split", payload);
    setResult(res.data);
  };
  const markPaid = async () => {
    const res = await billingApi.post(`/bills/${billId}/pay/${paidUserId}`);
    setResult(res.data);
  };
  return (
    <section className="page-grid">
      <div className="card stack">
        <h2>Split Bill</h2>
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <input value={players} onChange={(e) => setPlayers(e.target.value)} />
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className="primary-btn" onClick={splitExample}>Create Split</button>
      </div>
      <div className="card stack">
        <h2>Mark Payment</h2>
        <input placeholder="Bill ID" value={billId} onChange={(e) => setBillId(e.target.value)} />
        <input placeholder="User ID" value={paidUserId} onChange={(e) => setPaidUserId(e.target.value)} />
        <button className="outline-btn" onClick={markPaid}>Mark Paid</button>
      </div>
      <div className="card">
        <h2>Response</h2>
        <pre className="mono">{JSON.stringify(result, null, 2)}</pre>
      </div>
    </section>
  );
}
