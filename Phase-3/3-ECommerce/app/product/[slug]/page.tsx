"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IoHeart, IoHeartOutline, IoCartOutline, IoShieldCheckmarkOutline, IoCubeOutline, IoRefreshOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { productApi, reviewApi, wishlistApi } from "@/services";
import type { Product, Review } from "@/types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { add } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: "" });
  const [saved, setSaved] = useState(false);

  const load = async () => {
    try {
      const data = await productApi.get(slug);
      setProduct(data.product);
      setReviews(data.reviews);
      setRelated(data.related);
      setSaved(Boolean(user?.wishlist?.includes(data.product._id)));
    } catch { toast.error("Product not found"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [slug]);

  if (loading) return <div className="vn-spinner" />;
  if (!product) return <div className="vn-empty">Product not found.</div>;

  const addToCart = () => {
    if (product.stock <= 0) return toast.error("Out of stock");
    add({ productId: product._id, slug: product.slug, name: product.name, price: product.price, image: product.images[0] || "", stock: product.stock }, quantity);
    toast.success("Added to cart");
  };

  const wishlist = async () => {
    if (!isAuthenticated) return toast.error("Sign in to save products");
    try { const result = await wishlistApi.toggle(product._id); setSaved(result.saved); } catch (error: any) { toast.error(error.message); }
  };

  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAuthenticated) return toast.error("Sign in to review");
    try {
      await reviewApi.add({ productId: product._id, ...reviewForm });
      setReviewForm({ rating: 5, text: "" });
      await load();
      toast.success("Review saved");
    } catch (error: any) { toast.error(error.message); }
  };

  return (
    <div className="vn-main">
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 18 }}><Link href="/shop">Shop</Link> / <Link href={`/shop?category=${product.category}`}>{product.category}</Link> / {product.name}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, alignItems: "start" }} className="product-layout">
        <div>
          <div className="vn-card" style={{ overflow: "hidden", aspectRatio: "1/1", background: "#e9e5db" }}><img src={product.images[activeImage]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
          {product.images.length > 1 && <div style={{ display: "flex", gap: 8, marginTop: 10 }}>{product.images.map((image, index) => <button key={image} onClick={() => setActiveImage(index)} style={{ width: 70, height: 70, borderRadius: 6, overflow: "hidden", border: index === activeImage ? "2px solid var(--ink)" : "1px solid var(--line)", padding: 0, background: "none", cursor: "pointer" }}><img src={image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></button>)}</div>}
        </div>

        <div>
          <p className="vn-eyebrow">{product.brand} / {product.category}</p>
          <h1 style={{ fontSize: 42, margin: "8px 0" }}>{product.name}</h1>
          <div className="vn-rating">★ {product.rating || "New"} {product.reviewsCount ? `· ${product.reviewsCount} reviews` : ""}</div>
          <div style={{ margin: "16px 0" }}><span className="vn-price" style={{ fontSize: 30 }}>${product.price.toFixed(2)}</span>{product.compareAt > product.price && <span className="vn-compare" style={{ fontSize: 18 }}>${product.compareAt.toFixed(2)}</span>}</div>
          <p style={{ lineHeight: 1.6, color: "var(--muted)" }}>{product.description}</p>
          <p style={{ fontSize: 13, fontWeight: 800, color: product.stock > 0 ? "var(--ink)" : "var(--danger)" }}>{product.stock > 0 ? `In stock · ${product.stock} available` : "Out of stock"}</p>

          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            <input type="number" min={1} max={Math.min(product.stock, 20)} value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.min(Number(event.target.value), product.stock, 20)))} className="vn-input" style={{ width: 80 }} />
            <button className="vn-btn" onClick={addToCart} disabled={product.stock <= 0}><IoCartOutline /> Add to cart</button>
            <button className="vn-btn alt" onClick={wishlist}>{saved ? <IoHeart color="var(--danger)" /> : <IoHeartOutline />} {saved ? "Saved" : "Save"}</button>
          </div>

          <div className="vn-card vn-panel" style={{ marginTop: 20, display: "grid", gap: 9, fontSize: 13 }}>
            <span><IoShieldCheckmarkOutline /> 2-year VoltNest warranty</span>
            <span><IoCubeOutline /> Free delivery on orders over $199</span>
            <span><IoRefreshOutline /> 30-day returns, no questions</span>
          </div>

          {product.specs.length > 0 && <div style={{ marginTop: 22 }}><h3 style={{ fontSize: 20 }}>Specifications</h3>{product.specs.map((spec) => <div key={spec.label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", padding: "8px 0", fontSize: 13 }}><span className="vn-muted">{spec.label}</span><strong>{spec.value}</strong></div>)}</div>}
        </div>
      </div>

      <section className="vn-section">
        <h2 style={{ fontSize: 30 }}>Reviews</h2>
        {isAuthenticated ? (
          <form onSubmit={submitReview} className="vn-card vn-panel" style={{ display: "grid", gap: 10, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}><label className="vn-label" style={{ margin: 0 }}>Rating</label><select className="vn-input" style={{ width: 80 }} value={reviewForm.rating} onChange={(event) => setReviewForm({ ...reviewForm, rating: Number(event.target.value) })}>{[5,4,3,2,1].map((value) => <option key={value} value={value}>{value}</option>)}</select></div>
            <textarea className="vn-input" rows={3} value={reviewForm.text} onChange={(event) => setReviewForm({ ...reviewForm, text: event.target.value })} placeholder="What should other buyers know?" maxLength={1000} />
            <button className="vn-btn" type="submit" style={{ justifySelf: "start" }}>Submit review</button>
          </form>
        ) : <p className="vn-muted"><Link href="/login" style={{ textDecoration: "underline" }}>Sign in</Link> to leave a review.</p>}
        <div style={{ display: "grid", gap: 10 }}>{reviews.length === 0 ? <p className="vn-muted">No reviews yet.</p> : reviews.map((review) => <div key={review._id} className="vn-card vn-panel"><strong>{review.user?.name || review.user?.username}</strong> <span className="vn-rating">{"★".repeat(review.rating)}</span><p style={{ margin: "6px 0 0", fontSize: 14 }}>{review.text}</p></div>)}</div>
      </section>

      {related.length > 0 && <section className="vn-section"><h2 style={{ fontSize: 30 }}>You may also like</h2><div className="vn-grid">{related.map((item) => <div key={item._id} className="vn-card vn-product"><Link href={`/product/${item.slug}`} className="vn-product-img"><img src={item.images[0]} alt={item.name} /></Link><div className="vn-product-body"><Link href={`/product/${item.slug}`} style={{ fontWeight: 800 }}>{item.name}</Link><span className="vn-price">${item.price.toFixed(2)}</span></div></div>)}</div></section>}
      <style>{`@media(max-width:820px){.product-layout{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}
