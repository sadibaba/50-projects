"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { wishlistApi } from "@/services";
import type { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => { if (!loading && !isAuthenticated) router.push("/login"); }, [loading, isAuthenticated, router]);
  useEffect(() => { if (isAuthenticated) wishlistApi.list().then(setProducts).finally(() => setFetching(false)); }, [isAuthenticated]);

  if (loading || fetching) return <div className="vn-spinner" />;
  return <div className="vn-main"><h1 style={{ fontSize: 40 }}>Saved for later</h1><p className="vn-muted">Only you can see this list.</p>{products.length === 0 ? <div className="vn-empty">Nothing saved yet. <Link href="/shop" style={{ textDecoration: "underline" }}>Browse the collection</Link>.</div> : <div className="vn-grid">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div>}</div>;
}
