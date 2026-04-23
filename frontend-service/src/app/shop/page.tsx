"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { billingApi } from "../../lib/api";

export default function ShopPage() {
  const [product, setProduct] = useState({ name: "", category: "jersey", price: 999, inventory: 20, customizable: true });
  const [cart, setCart] = useState({ user_id: "", product_id: "", qty: 1 });
  const [checkout, setCheckout] = useState({ user_id: "", team_name: "", player_name: "", jersey_number: "", color: "black" });
  const [result, setResult] = useState<any>(null);
  const { data, refetch } = useQuery({ queryKey: ["products"], queryFn: async () => (await billingApi.get("/products")).data });

  const addProduct = async () => {
    await billingApi.post("/products", { ...product, price: Number(product.price), inventory: Number(product.inventory) });
    await refetch();
  };
  const addToCart = async () => {
    const res = await billingApi.post(`/cart/${cart.user_id}/${cart.product_id}`, null, { params: { qty: Number(cart.qty) } });
    setResult(res.data);
  };
  const placeOrder = async () => {
    const res = await billingApi.post(`/orders/${checkout.user_id}`, null, { params: checkout });
    setResult(res.data);
  };

  return (
    <section className="page-grid">
      <div className="card stack">
        <h2>Add Product</h2>
        <input placeholder="Name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
        <input placeholder="Category" value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} />
        <input type="number" placeholder="Price" value={product.price} onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })} />
        <button className="primary-btn" onClick={addProduct}>Create Product</button>
      </div>
      <div className="card stack">
        <h2>Add To Cart</h2>
        <input placeholder="User ID" value={cart.user_id} onChange={(e) => setCart({ ...cart, user_id: e.target.value })} />
        <input placeholder="Product ID" value={cart.product_id} onChange={(e) => setCart({ ...cart, product_id: e.target.value })} />
        <input type="number" placeholder="Qty" value={cart.qty} onChange={(e) => setCart({ ...cart, qty: Number(e.target.value) })} />
        <button className="outline-btn" onClick={addToCart}>Add</button>
      </div>
      <div className="card stack">
        <h2>Checkout + Jersey Customization</h2>
        <input placeholder="User ID" value={checkout.user_id} onChange={(e) => setCheckout({ ...checkout, user_id: e.target.value })} />
        <input placeholder="Team Name" value={checkout.team_name} onChange={(e) => setCheckout({ ...checkout, team_name: e.target.value })} />
        <input placeholder="Player Name" value={checkout.player_name} onChange={(e) => setCheckout({ ...checkout, player_name: e.target.value })} />
        <input placeholder="Jersey Number" value={checkout.jersey_number} onChange={(e) => setCheckout({ ...checkout, jersey_number: e.target.value })} />
        <button className="primary-btn" onClick={placeOrder}>Place Order</button>
      </div>
      <div className="card">
      <h2>Shop & Jerseys</h2>
      <div className="list">
        {(data ?? []).map((p: any) => (
          <div key={p.id} className="list-item">{p.name} - {p.category} - Rs {p.price} {p.customizable ? "(Customizable)" : ""} - ID: {p.id}</div>
        ))}
      </div>
      </div>
      <div className="card">
        <h2>Response</h2>
        <pre className="mono">{JSON.stringify(result, null, 2)}</pre>
      </div>
    </section>
  );
}
