"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IoTrashOutline, IoArrowForward } from "react-icons/io5";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { cartApi } from "@/services";

export default function CartPage() {
  const { lines, subtotal, setQuantity, remove, clear } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applied, setApplied] = useState("");
  const [checking, setChecking] = useState(false);
  const shipping = subtotal >= 199 ? 0 : 12;
  const total = Math.max(0, subtotal - discount + shipping);

  const apply = async () => {
    if (!coupon.trim()) return;
    setChecking(true);
    try {
      const data = await cartApi.validateCoupon(coupon.trim(), subtotal);
      setDiscount(data.discount);
      setApplied(data.code);
      toast.success(`${data.code} applied`);
    } catch (error: any) { toast.error(error.message); setDiscount(0); setApplied(""); }
    finally { setChecking(false); }
  };

  if (lines.length === 0) return <div className="vn-main"><div className="vn-empty"><h1>Your cart is empty</h1><p>Find something worth keeping.</p><Link href="/shop" className="vn-btn" style={{ marginTop: 14 }}>Shop VoltNest</Link></div></div>;

  return (
    <div className="vn-main">
      <h1 style={{ fontSize: 42, marginBottom: 20 }}>Your cart</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }} className="cart-layout">
        <div className="vn-card" style={{ overflow: "hidden" }}>
          {lines.map((line) => (
            <div key={line.productId} style={{ display: "grid", gridTemplateColumns: "92px 1fr auto", gap: 14, padding: 14, borderBottom: "1px solid var(--line)", alignItems: "center" }}>
              <Link href={`/product/${line.slug}`}><img src={line.image} alt={line.name} style={{ width: 92, height: 92, objectFit: "cover", borderRadius: 8 }} /></Link>
              <div><Link href={`/product/${line.slug}`} style={{ fontWeight: 800 }}>{line.name}</Link><div className="vn-muted" style={{ fontSize: 13 }}>${line.price.toFixed(2)} each</div><div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}><button className="vn-chip" onClick={() => setQuantity(line.productId, line.quantity - 1)}>-</button><span style={{ fontSize: 14, fontWeight: 800 }}>{line.quantity}</span><button className="vn-chip" onClick={() => setQuantity(line.productId, line.quantity + 1)}>+</button></div></div>
              <div style={{ textAlign: "right" }}><strong>${(line.price * line.quantity).toFixed(2)}</strong><button className="vn-icon" onClick={() => remove(line.productId)} aria-label="Remove" style={{ marginTop: 6 }}><IoTrashOutline size={18} /></button></div>
            </div>
          ))}
          <div style={{ padding: 14 }}><button className="vn-btn alt" onClick={clear}>Clear cart</button></div>
        </div>

        <aside className="vn-card vn-panel">
          <h2 style={{ marginTop: 0, fontSize: 22 }}>Summary</h2>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}><input className="vn-input" value={coupon} onChange={(event) => setCoupon(event.target.value.toUpperCase())} placeholder="Coupon code" /><button className="vn-btn" onClick={apply} disabled={checking}>Apply</button></div>
          <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
          {applied && <Row label={`Discount (${applied})`} value={`-$${discount.toFixed(2)}`} />}
          <Row label="Shipping" value={shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`} />
          <div style={{ borderTop: "1px solid var(--line)", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 18 }}><span>Total</span><span>${total.toFixed(2)}</span></div>
          <Link href={`/checkout${applied ? `?coupon=${applied}` : ""}`} className="vn-btn" style={{ width: "100%", marginTop: 16, justifyContent: "center" }}>Checkout <IoArrowForward /></Link>
          <p className="vn-muted" style={{ fontSize: 11, marginBottom: 0, textAlign: "center" }}>Secure checkout. Card payments are simulated in this demo.</p>
        </aside>
      </div>
      <style>{`@media(max-width:820px){.cart-layout{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "5px 0" }}><span className="vn-muted">{label}</span><span>{value}</span></div>;
}
