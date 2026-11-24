"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { cartApi } from "@/services";

function CheckoutInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { lines, subtotal, clear } = useCart();
  const [coupon] = useState(params.get("coupon") || "");
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState<"card" | "cod">("card");
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({ line1: "", city: "", postalCode: "", country: "Pakistan" });

  useEffect(() => {
    if (user?.address) setAddress((current) => ({ ...current, ...user.address }));
  }, [user]);

  useEffect(() => {
    if (!coupon || subtotal <= 0) return;
    cartApi.validateCoupon(coupon, subtotal).then((data) => setDiscount(data.discount)).catch(() => {});
  }, [coupon, subtotal]);

  const shipping = subtotal >= 199 ? 0 : 12;
  const total = Math.max(0, subtotal - discount + shipping);

  const place = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAuthenticated) return;
    if (!lines.length) return toast.error("Your cart is empty");
    setPlacing(true);
    try {
      const order = await cartApi.checkout({
        items: lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
        coupon,
        address,
        paymentMethod: payment,
      });
      clear();
      toast.success("Order placed");
      router.push(`/order/${order._id}`);
    } catch (error: any) { toast.error(error.message); }
    finally { setPlacing(false); }
  };

  if (loading) return <div className="vn-spinner" />;
  if (!isAuthenticated) return <div className="vn-main"><div className="vn-empty"><h1>Sign in to checkout</h1><p>Your cart is saved on this device.</p><Link href="/login" className="vn-btn" style={{ marginTop: 12 }}>Log in</Link></div></div>;
  if (lines.length === 0) return <div className="vn-main"><div className="vn-empty"><h1>Nothing to checkout</h1><Link href="/shop" className="vn-btn" style={{ marginTop: 12 }}>Shop now</Link></div></div>;

  return (
    <div className="vn-main">
      <h1 style={{ fontSize: 42 }}>Checkout</h1>
      <form onSubmit={place} style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }} className="checkout-layout">
        <div style={{ display: "grid", gap: 18 }}>
          <section className="vn-card vn-panel">
            <h2 style={{ marginTop: 0, fontSize: 22 }}>Shipping address</h2>
            <label className="vn-label">Street address</label>
            <input className="vn-input" value={address.line1} onChange={(event) => setAddress({ ...address, line1: event.target.value })} required />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
              <div><label className="vn-label">City</label><input className="vn-input" value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value })} required /></div>
              <div><label className="vn-label">Postal code</label><input className="vn-input" value={address.postalCode} onChange={(event) => setAddress({ ...address, postalCode: event.target.value })} /></div>
            </div>
            <label className="vn-label" style={{ marginTop: 10 }}>Country</label>
            <input className="vn-input" value={address.country} onChange={(event) => setAddress({ ...address, country: event.target.value })} required />
          </section>

          <section className="vn-card vn-panel">
            <h2 style={{ marginTop: 0, fontSize: 22 }}>Payment</h2>
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: 12, border: "1px solid var(--line)", borderRadius: 8, marginBottom: 10 }}><input type="radio" checked={payment === "card"} onChange={() => setPayment("card")} /><span><strong>Card (demo)</strong><br /><span className="vn-muted" style={{ fontSize: 12 }}>No real payment is processed. Card details are not collected.</span></span></label>
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: 12, border: "1px solid var(--line)", borderRadius: 8 }}><input type="radio" checked={payment === "cod"} onChange={() => setPayment("cod")} /><span><strong>Cash on delivery</strong><br /><span className="vn-muted" style={{ fontSize: 12 }}>Pay when the parcel arrives.</span></span></label>
          </section>
        </div>

        <aside className="vn-card vn-panel">
          <h2 style={{ marginTop: 0, fontSize: 22 }}>Order summary</h2>
          {lines.map((line) => <div key={line.productId} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13, padding: "6px 0" }}><span>{line.name} × {line.quantity}</span><strong>${(line.price * line.quantity).toFixed(2)}</strong></div>)}
          <div style={{ borderTop: "1px solid var(--line)", marginTop: 8, paddingTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span className="vn-muted">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            {discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span className="vn-muted">Discount {coupon}</span><span>-${discount.toFixed(2)}</span></div>}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span className="vn-muted">Shipping</span><span>{shipping ? `$${shipping.toFixed(2)}` : "Free"}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 18, marginTop: 8 }}><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <button className="vn-btn" type="submit" disabled={placing} style={{ width: "100%", justifyContent: "center", marginTop: 16 }}>{placing ? "Placing order..." : "Place order"}</button>
        </aside>
      </form>
      <style>{`@media(max-width:820px){.checkout-layout{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}

export default function CheckoutPage() {
  return <Suspense fallback={<div className="vn-spinner" />}><CheckoutInner /></Suspense>;
}
