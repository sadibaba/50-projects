"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { cartApi } from "@/services";
import type { Order } from "@/types";
import { useAuth } from "@/context/AuthContext";

const steps = ["processing", "packed", "shipped", "delivered"];

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
    if (!loading && isAuthenticated) cartApi.order(id).then(setOrder).catch(() => {}).finally(() => setFetching(false));
  }, [id, loading, isAuthenticated, router]);

  if (loading || fetching) return <div className="vn-spinner" />;
  if (!order) return <div className="vn-empty">Order not found.</div>;
  const current = steps.indexOf(order.status);

  return (
    <div className="vn-main" style={{ maxWidth: 840 }}>
      <p className="vn-eyebrow">Order {order.number}</p>
      <h1 style={{ fontSize: 40, marginTop: 4 }}>Thanks. It’s on its way.</h1>
      <p className="vn-muted">Placed {new Date(order.createdAt).toLocaleDateString()} · {order.paymentMethod === "cod" ? "Cash on delivery" : "Card (demo)"}</p>

      <div className="vn-card vn-panel" style={{ margin: "20px 0" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {steps.map((step, index) => <div key={step} style={{ flex: 1 }}><div style={{ height: 6, borderRadius: 99, background: order.status === "cancelled" ? "#ddd" : index <= current ? "var(--blue)" : "#e3ded3" }} /><div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", marginTop: 6, color: index <= current ? "var(--ink)" : "var(--muted)" }}>{step}</div></div>)}
        </div>
        {order.status === "cancelled" && <p style={{ color: "var(--danger)", fontWeight: 700 }}>This order was cancelled.</p>}
      </div>

      <div className="vn-card" style={{ overflow: "hidden", marginBottom: 18 }}>
        {order.items.map((item) => <div key={item.product} style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, borderBottom: "1px solid var(--line)" }}><img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }} /><div style={{ flex: 1 }}><strong>{item.name}</strong><div className="vn-muted" style={{ fontSize: 12 }}>Qty {item.quantity}</div></div><span>${(item.price * item.quantity).toFixed(2)}</span></div>)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="vn-card vn-panel"><h3 style={{ marginTop: 0 }}>Ship to</h3><p className="vn-muted" style={{ margin: 0, fontSize: 14 }}>{order.address.line1}<br />{order.address.city} {order.address.postalCode}<br />{order.address.country}</p></div>
        <div className="vn-card vn-panel"><h3 style={{ marginTop: 0 }}>Total</h3><p className="vn-muted" style={{ margin: 0, fontSize: 14 }}>Subtotal ${order.subtotal.toFixed(2)}<br />Discount -${order.discount.toFixed(2)}<br />Shipping {order.shipping ? `$${order.shipping.toFixed(2)}` : "Free"}</p><strong style={{ fontSize: 22 }}>${order.total.toFixed(2)}</strong></div>
      </div>
      <Link href="/shop" className="vn-btn" style={{ marginTop: 20 }}>Continue shopping</Link>
    </div>
  );
}
