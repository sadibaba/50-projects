"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoArrowForward, IoFlashOutline, IoShieldCheckmarkOutline, IoCubeOutline, IoSparklesOutline } from "react-icons/io5";
import { productApi } from "@/services";
import type { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newest, setNewest] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    Promise.all([
      productApi.list({ featured: 1, limit: 8 }),
      productApi.list({ sort: "new", limit: 4 }),
      productApi.categories(),
    ]).then(([f, n, c]) => {
      setFeatured(f.products);
      setNewest(n.products);
      setCategories(c);
    }).catch(() => {});
  }, []);

  return (
    <div className="vn-main">
      <section className="vn-hero">
        <div>
          <p className="vn-eyebrow">VoltNest / considered electronics</p>
          <h1>Technology that earns its place.</h1>
          <p>Fewer, better devices for work, sound and play. Curated by people who actually use them, with transparent specs and a 30-day trial.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
            <Link href="/shop" className="vn-btn">Shop the collection <IoArrowForward /></Link>
            <Link href="/shop?featured=1" className="vn-btn alt">See this week's deals</Link>
          </div>
          <div style={{ display: "flex", gap: 22, marginTop: 28, fontSize: 12, color: "var(--muted)" }}>
            <span><IoShieldCheckmarkOutline style={{ verticalAlign: "middle" }} /> 2-year warranty</span>
            <span><IoCubeOutline style={{ verticalAlign: "middle" }} /> Free delivery over $199</span>
            <span><IoFlashOutline style={{ verticalAlign: "middle" }} /> 30-day returns</span>
          </div>
        </div>
        <div className="vn-hero-art">
          <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop" alt="A laptop on a clean desk" />
          <span className="vn-hero-chip">The desk edit / 2026</span>
        </div>
      </section>

      <section>
        <div className="vn-section-head"><div><p className="vn-eyebrow">Browse</p><h2>Shop by room</h2></div><Link href="/shop" className="vn-btn alt">All products</Link></div>
        <div className="vn-chip-row">
          {categories.map((category) => (
            <Link key={category.name} href={`/shop?category=${encodeURIComponent(category.name)}`} className="vn-chip">{category.name} <span style={{ opacity: .5 }}>{category.count}</span></Link>
          ))}
        </div>
      </section>

      <section className="vn-section">
        <div className="vn-section-head"><div><p className="vn-eyebrow">Handpicked</p><h2>Featured this week</h2></div><Link href="/shop?featured=1" className="vn-btn alt">View all</Link></div>
        <div className="vn-grid">{featured.map((product) => <ProductCard key={product._id} product={product} />)}</div>
      </section>

      <section className="vn-section" style={{ background: "var(--ink)", color: "#fff", borderRadius: 16, padding: "34px 26px", display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: 20, alignItems: "center" }}>
        <div>
          <p className="vn-eyebrow" style={{ color: "var(--lime)" }}>Bundle & save</p>
          <h2 style={{ fontSize: 38, margin: "8px 0" }}>Build a setup that works together.</h2>
          <p style={{ color: "#c9c9c0", maxWidth: 560 }}>Pair a laptop, monitor and keyboard. Use code <strong style={{ color: "var(--lime)" }}>SETUP15</strong> for 15% off orders over $400.</p>
        </div>
        <div style={{ textAlign: "right" }}><Link href="/shop?category=Monitors" className="vn-btn lime">Shop monitors</Link></div>
      </section>

      <section className="vn-section">
        <div className="vn-section-head"><div><p className="vn-eyebrow">Just landed</p><h2>New arrivals</h2></div></div>
        <div className="vn-grid">{newest.map((product) => <ProductCard key={product._id} product={product} />)}</div>
      </section>

      <section className="vn-section" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {[
          { icon: IoSparklesOutline, title: "Curated, not crowded", text: "Every product is chosen for a reason. No endless marketplace noise." },
          { icon: IoShieldCheckmarkOutline, title: "Clear ownership", text: "Transparent pricing, stock and specs. Your data stays yours." },
          { icon: IoCubeOutline, title: "Fast, quiet delivery", text: "Free over $199, tracked from warehouse to doorstep." },
        ].map((item) => {
          const Icon = item.icon;
          return <div key={item.title} className="vn-card vn-panel"><Icon size={24} /><h3 style={{ margin: "12px 0 6px", fontSize: 20 }}>{item.title}</h3><p className="vn-muted" style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{item.text}</p></div>;
        })}
      </section>
    </div>
  );
}
