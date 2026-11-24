"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IoHeart, IoHeartOutline, IoCartOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { wishlistApi } from "@/services";
import { useAuth } from "@/context/AuthContext";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { user } = useAuth();
  const [saved, setSaved] = useState(Boolean(user?.wishlist?.includes(product._id)));

  const addToCart = () => {
    if (product.stock <= 0) return toast.error("Out of stock");
    add({ productId: product._id, slug: product.slug, name: product.name, price: product.price, image: product.images[0] || "", stock: product.stock });
    toast.success("Added to cart");
  };

  const wishlist = async () => {
    try {
      const result = await wishlistApi.toggle(product._id);
      setSaved(result.saved);
      toast.success(result.saved ? "Saved" : "Removed");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <article className="vn-card vn-product">
      <div className="vn-product-img">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          <img src={product.images[0]} alt={product.name} loading="lazy" />
        </Link>
        {product.compareAt > product.price && <span className="vn-tag">Sale</span>}
        <button className="vn-wish" onClick={wishlist} aria-label="Save to wishlist">{saved ? <IoHeart color="var(--danger)" size={17} /> : <IoHeartOutline size={17} />}</button>
      </div>
      <div className="vn-product-body">
        <span className="vn-eyebrow">{product.category}</span>
        <Link href={`/product/${product.slug}`} style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.25 }}>{product.name}</Link>
        <div className="vn-rating">★ {product.rating || "New"} {product.reviewsCount ? `(${product.reviewsCount})` : ""}</div>
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div><span className="vn-price">${product.price.toFixed(2)}</span>{product.compareAt > product.price && <span className="vn-compare">${product.compareAt.toFixed(2)}</span>}</div>
          <button className="vn-icon" onClick={addToCart} aria-label="Add to cart" style={{ background: "var(--ink)", color: "#fff", width: 36, height: 36 }}><IoCartOutline /></button>
        </div>
      </div>
    </article>
  );
}
