"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { productApi } from "@/services";
import type { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

function ShopInner() {
  const params = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [category, setCategory] = useState(params.get("category") || "All");
  const [q, setQ] = useState(params.get("q") || "");
  const [sort, setSort] = useState("new");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => { productApi.categories().then(setCategories).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    productApi.list({ category: category === "All" ? undefined : category, q: q || undefined, sort, max: maxPrice, limit: 12 })
      .then((data) => { setProducts(data.products); setHasMore(data.hasMore); })
      .finally(() => setLoading(false));
  }, [category, q, sort, maxPrice]);

  const loadMore = async () => {
    const next = page + 1;
    const data = await productApi.list({ category: category === "All" ? undefined : category, q: q || undefined, sort, max: maxPrice, page: next, limit: 12 });
    setProducts((items) => [...items, ...data.products]);
    setPage(next);
    setHasMore(data.hasMore);
  };

  return (
    <div className="vn-main">
      <div className="vn-section-head"><div><p className="vn-eyebrow">The collection</p><h1 style={{ fontSize: 42, margin: 0 }}>Shop VoltNest</h1></div><select className="vn-input" style={{ width: 180 }} value={sort} onChange={(event) => setSort(event.target.value)}><option value="new">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="rating">Top rated</option></select></div>

      <div className="vn-filters">
        <aside className="vn-card vn-panel">
          <label className="vn-label">Search</label>
          <input className="vn-input" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search products" />
          <label className="vn-label" style={{ marginTop: 16 }}>Category</label>
          <div style={{ display: "grid", gap: 6 }}>
            {[{ name: "All", count: categories.reduce((sum, item) => sum + item.count, 0) }, ...categories].map((item) => (
              <button key={item.name} onClick={() => setCategory(item.name)} style={{ textAlign: "left", border: 0, background: category === item.name ? "var(--ink)" : "transparent", color: category === item.name ? "#fff" : "inherit", padding: "8px 10px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>{item.name} <span style={{ opacity: .5 }}>({item.count})</span></button>
            ))}
          </div>
          <label className="vn-label" style={{ marginTop: 16 }}>Max price: ${maxPrice}</label>
          <input type="range" min="50" max="2000" step="50" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} style={{ width: "100%" }} />
        </aside>

        <div>
          {loading ? <div className="vn-spinner" /> : products.length === 0 ? <div className="vn-empty">No products match those filters.</div> : (
            <>
              <div className="vn-grid">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div>
              {hasMore && <div style={{ textAlign: "center", marginTop: 22 }}><button className="vn-btn alt" onClick={loadMore}>Load more</button></div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return <Suspense fallback={<div className="vn-spinner" />}><ShopInner /></Suspense>;
}
