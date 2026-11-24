"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { authApi, cartApi } from "@/services";
import type { Order } from "@/types";

export default function AccountPage() {
  const { user, isAuthenticated, loading, updateUser, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", address: { line1: "", city: "", postalCode: "", country: "" } });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!loading && !isAuthenticated) router.push("/login"); }, [loading, isAuthenticated, router]);
  useEffect(() => {
    if (user) setForm({ name: user.name, phone: user.phone, address: user.address });
    if (isAuthenticated) cartApi.myOrders().then((data) => setOrders(data.orders)).catch(() => {});
  }, [user, isAuthenticated]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try { updateUser(await authApi.updateProfile(form)); toast.success("Profile saved"); }
    catch (error: any) { toast.error(error.message); }
    finally { setSaving(false); }
  };

  if (loading || !user) return <div className="vn-spinner" />;

  return (
    <div className="vn-main">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center" }}><div><p className="vn-eyebrow">Account</p><h1 style={{ fontSize: 40, margin: 0 }}>Hello, {user.name || user.username}</h1></div><button className="vn-btn alt" onClick={logout}>Sign out</button></div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 22 }} className="account-grid">
        <form className="vn-card vn-panel" onSubmit={save}>
          <h2 style={{ marginTop: 0, fontSize: 22 }}>Profile & address</h2>
          <label className="vn-label">Name</label><input className="vn-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <label className="vn-label" style={{ marginTop: 8 }}>Phone</label><input className="vn-input" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          <label className="vn-label" style={{ marginTop: 8 }}>Street</label><input className="vn-input" value={form.address.line1} onChange={(event) => setForm({ ...form, address: { ...form.address, line1: event.target.value } })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}><div><label className="vn-label">City</label><input className="vn-input" value={form.address.city} onChange={(event) => setForm({ ...form, address: { ...form.address, city: event.target.value } })} /></div><div><label className="vn-label">Postal code</label><input className="vn-input" value={form.address.postalCode} onChange={(event) => setForm({ ...form, address: { ...form.address, postalCode: event.target.value } })} /></div></div>
          <label className="vn-label" style={{ marginTop: 8 }}>Country</label><input className="vn-input" value={form.address.country} onChange={(event) => setForm({ ...form, address: { ...form.address, country: event.target.value } })} />
          <button className="vn-btn" type="submit" disabled={saving} style={{ marginTop: 12 }}>{saving ? "Saving..." : "Save profile"}</button>
        </form>

        <section>
          <h2 style={{ marginTop: 0, fontSize: 22 }}>Your orders</h2>
          {orders.length === 0 ? <div className="vn-card vn-panel vn-muted">No orders yet. <Link href="/shop" style={{ textDecoration: "underline" }}>Start shopping</Link>.</div> : orders.map((order) => (
            <Link key={order._id} href={`/order/${order._id}`} className="vn-card vn-panel" style={{ display: "block", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><strong>{order.number}</strong><span className={`vn-status ${order.status}`}>{order.status}</span></div>
              <div className="vn-muted" style={{ fontSize: 12, marginTop: 4 }}>{new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items</div>
              <strong style={{ display: "block", marginTop: 6 }}>${order.total.toFixed(2)}</strong>
            </Link>
          ))}
        </section>
      </div>
      <style>{`@media(max-width:800px){.account-grid{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}
