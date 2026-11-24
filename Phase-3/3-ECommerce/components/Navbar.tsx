"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoSearchOutline, IoCartOutline, IoHeartOutline, IoPersonOutline, IoStorefrontOutline, IoGridOutline, IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { count } = useCart();
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    router.push(`/shop${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  };

  return (
    <>
      <header className="vn-nav">
        <div className="vn-nav-inner">
          <Link href="/" className="vn-logo">Volt<span>Nest</span></Link>
          <nav className="vn-links">
            <Link href="/shop">Shop</Link>
            <Link href="/shop?category=Laptops">Laptops</Link>
            <Link href="/shop?category=Audio">Audio</Link>
            <Link href="/shop?featured=1">Deals</Link>
          </nav>
          <form className="vn-search" onSubmit={submit}>
            <IoSearchOutline style={{ position: "absolute", left: 13, top: 12, color: "var(--muted)" }} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, brands, categories" aria-label="Search" />
          </form>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 2 }}>
            <Link href="/wishlist" className="vn-icon" aria-label="Wishlist"><IoHeartOutline size={22} /></Link>
            <Link href="/cart" className="vn-icon" aria-label="Cart"><IoCartOutline size={23} />{count > 0 && <span className="vn-badge">{count}</span>}</Link>
            {loading ? null : user ? (
              <div style={{ position: "relative" }}>
                <button className="vn-icon" onClick={() => setMenu((value) => !value)} aria-label="Account menu"><IoPersonOutline size={22} /></button>
                {menu && (
                  <div style={{ position: "absolute", right: 0, top: 48, width: 210, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,.15)", zIndex: 60 }}>
                    <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--line)" }}><strong style={{ display: "block", fontSize: 14 }}>{user.name}</strong><span style={{ fontSize: 12, color: "var(--muted)" }}>@{user.username}</span></div>
                    <Link href="/account" onClick={() => setMenu(false)} style={{ display: "flex", gap: 8, padding: "10px 14px", fontSize: 14 }}><IoPersonOutline /> Account</Link>
                    <Link href="/wishlist" onClick={() => setMenu(false)} style={{ display: "flex", gap: 8, padding: "10px 14px", fontSize: 14 }}><IoHeartOutline /> Wishlist</Link>
                    {user.role === "admin" && <Link href="/admin" onClick={() => setMenu(false)} style={{ display: "flex", gap: 8, padding: "10px 14px", fontSize: 14 }}><IoSettingsOutline /> Admin dashboard</Link>}
                    <button onClick={logout} style={{ display: "flex", gap: 8, width: "100%", padding: "10px 14px", border: 0, background: "none", fontSize: 14, textAlign: "left", cursor: "pointer", color: "var(--danger)" }}><IoLogOutOutline /> Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", gap: 4, marginLeft: 4 }}>
                <Link href="/login" className="vn-btn alt" style={{ padding: "8px 12px" }}>Log in</Link>
                <Link href="/register" className="vn-btn" style={{ padding: "8px 12px" }}>Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className="vn-mobile">
        {[
          { href: "/", icon: IoStorefrontOutline },
          { href: "/shop", icon: IoGridOutline },
          { href: "/wishlist", icon: IoHeartOutline },
          { href: "/cart", icon: IoCartOutline },
          { href: user ? "/account" : "/login", icon: IoPersonOutline },
        ].map((item) => {
          const Icon = item.icon;
          return <Link key={item.href} href={item.href} className="vn-icon" aria-label={item.href}><Icon size={23} /></Link>;
        })}
      </nav>
    </>
  );
}
