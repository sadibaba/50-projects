"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { adminApi } from "@/services";
import type { Order, Product } from "@/types";

type Tab = "overview" | "products" | "orders";

export default function AdminPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  const load = async () => {
    try {
      const [s, p, o] = await Promise.all([adminApi.stats(), adminApi.products(), adminApi.orders()]);
      setStats(s);
      setProducts(p);
      setOrders(o.orders);
    } catch (error: any) { toast.error(error.message); }
    finally { setFetching(false); }
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
    if (!loading && isAuthenticated && user?.role !== "admin") router.push("/");
    if (!loading && user?.role === "admin") load();
  }, [loading, isAuthenticated, user, router]);

  const saveProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const payload = {
      name: editing.name || "",
      slug: editing.slug || String(editing.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      category: editing.category || "Accessories",
      brand: editing.brand || "VoltNest",
      description: editing.description || "",
      price: Number(editing.price) || 0,
      compareAt: Number(editing.compareAt) || 0,
      stock: Number(editing.stock) || 0,
      featured: Boolean(editing.featured),
      images: [editing.images?.[0] || ""].filter(Boolean),
    };
    try {
      if (editing._id) await adminApi.updateProduct(editing._id, payload);
      else await adminApi.createProduct(payload);
      toast.success("Product saved");
      setEditing(null);
      await load();
    } catch (error: any) { toast.error(error.message); }
  };

  const removeProduct = async (product: Product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    try { await adminApi.deleteProduct(product._id); toast.success("Deleted"); await load(); } catch (error: any) { toast.error(error.message); }
  };

  const changeStatus = async (order: Order, status: string) => {
    try { await adminApi.updateOrder(order._id, status); setOrders((items) => items.map((item) => item._id === order._id ? { ...item, status: status as Order["status"] } : item)); } catch (error: any) { toast.error(error.message); }
  };

  const exportCsv = () => {
    const rows = [["Order", "Customer", "Status", "Total", "Date"], ...orders.map((order) => [order.number, (order.user as any)?.username || "", order.status, order.total.toFixed(2), new Date(order.createdAt).toISOString()])];
    const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "voltnest-orders.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (loading || fetching) return <div className="vn-spinner" />;
  if (!user || user.role !== "admin") return null;

  return (
    <div className="vn-main">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}><div><p className="vn-eyebrow">Owner dashboard</p><h1 style={{ fontSize: 40, margin: 0 }}>VoltNest control room</h1></div><button className="vn-btn" onClick={() => setEditing({ category: "Laptops", brand: "VoltNest", stock: 10, price: 0, featured: false, images: [] })}>+ New product</button></div>

      <div className="vn-chip-row" style={{ margin: "18px 0" }}>{(['overview', 'products', 'orders'] as Tab[]).map((value) => <button key={value} className={`vn-chip ${tab === value ? "active" : ""}`} onClick={() => setTab(value)}>{value}</button>)}</div>

      {tab === "overview" && stats && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }} className="stat-grid">
            <Stat label="Revenue" value={`$${Number(stats.revenue).toFixed(2)}`} />
            <Stat label="Orders" value={stats.orders} />
            <Stat label="Products" value={stats.products} />
            <Stat label="Customers" value={stats.customers} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 18 }} className="admin-split">
            <div className="vn-card vn-panel"><h2 style={{ marginTop: 0, fontSize: 20 }}>Low stock</h2>{stats.lowStock.length === 0 ? <p className="vn-muted">Everything is healthy.</p> : stats.lowStock.map((item: Product) => <div key={item._id} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--line)", fontSize: 13 }}><span>{item.name}</span><strong style={{ color: item.stock === 0 ? "var(--danger)" : "inherit" }}>{item.stock} left</strong></div>)}</div>
            <div className="vn-card vn-panel"><h2 style={{ marginTop: 0, fontSize: 20 }}>Top sellers</h2>{stats.top.map((item: any) => <div key={item._id} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--line)", fontSize: 13 }}><span>{item._id}</span><strong>{item.units} sold</strong></div>)}</div>
          </div>
          <div className="vn-card" style={{ marginTop: 18, overflow: "hidden" }}><div style={{ padding: 14, borderBottom: "1px solid var(--line)", fontWeight: 800 }}>Recent orders</div><OrdersTable orders={stats.recent} onChange={changeStatus} /></div>
        </>
      )}

      {tab === "products" && <div className="vn-card" style={{ overflow: "auto" }}><table className="vn-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product._id}><td><div style={{ display: "flex", gap: 8, alignItems: "center" }}><img src={product.images[0]} alt="" style={{ width: 38, height: 38, objectFit: "cover", borderRadius: 4 }} /><span>{product.name}</span></div></td><td>{product.category}</td><td>${product.price.toFixed(2)}</td><td>{product.stock}</td><td>{product.featured ? "Yes" : "No"}</td><td><button className="vn-chip" onClick={() => setEditing(product)}>Edit</button> <button className="vn-chip" onClick={() => removeProduct(product)} style={{ color: "var(--danger)" }}>Delete</button></td></tr>)}</tbody></table></div>}

      {tab === "orders" && <div className="vn-card" style={{ overflow: "auto" }}><div style={{ padding: 12, display: "flex", justifyContent: "flex-end" }}><button className="vn-btn alt" onClick={exportCsv}>Export CSV</button></div><OrdersTable orders={orders} onChange={changeStatus} /></div>}

      {editing && <ProductModal editing={editing} setEditing={setEditing} onSave={saveProduct} />}
      <style>{`@media(max-width:800px){.stat-grid{grid-template-columns:1fr 1fr !important}.admin-split{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return <div className="vn-card vn-panel"><span className="vn-eyebrow">{label}</span><div style={{ fontSize: 30, fontWeight: 900, marginTop: 4 }}>{value}</div></div>;
}

function OrdersTable({ orders, onChange }: { orders: Order[]; onChange: (order: Order, status: string) => void }) {
  return <table className="vn-table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody>{orders.map((order) => <tr key={order._id}><td><strong>{order.number}</strong></td><td>{(order.user as any)?.username || "Guest"}</td><td>${order.total.toFixed(2)}</td><td><select className="vn-input" style={{ padding: "5px 8px", fontSize: 12 }} value={order.status} onChange={(event) => onChange(order, event.target.value)}>{["processing", "packed", "shipped", "delivered", "cancelled"].map((status) => <option key={status} value={status}>{status}</option>)}</select></td><td>{new Date(order.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table>;
}

function ProductModal({ editing, setEditing, onSave }: { editing: Partial<Product>; setEditing: (value: Partial<Product> | null) => void; onSave: (event: React.FormEvent) => void }) {
  const set = (key: keyof Product, value: unknown) => setEditing({ ...editing, [key]: value });
  return (
    <div className="vn-modal" onClick={() => setEditing(null)}>
      <form className="vn-modal-box" onSubmit={onSave} onClick={(event) => event.stopPropagation()}>
        <h2 style={{ marginTop: 0 }}>{editing._id ? "Edit product" : "New product"}</h2>
        <label className="vn-label">Name</label><input className="vn-input" value={editing.name || ""} onChange={(event) => set("name", event.target.value)} required />
        <label className="vn-label" style={{ marginTop: 8 }}>Category</label><input className="vn-input" value={editing.category || ""} onChange={(event) => set("category", event.target.value)} required />
        <label className="vn-label" style={{ marginTop: 8 }}>Image URL (HTTPS)</label><input className="vn-input" value={editing.images?.[0] || ""} onChange={(event) => set("images", [event.target.value])} placeholder="https://images.unsplash.com/..." required />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8 }}><div><label className="vn-label">Price</label><input className="vn-input" type="number" value={editing.price || 0} onChange={(event) => set("price", Number(event.target.value))} /></div><div><label className="vn-label">Compare</label><input className="vn-input" type="number" value={editing.compareAt || 0} onChange={(event) => set("compareAt", Number(event.target.value))} /></div><div><label className="vn-label">Stock</label><input className="vn-input" type="number" value={editing.stock || 0} onChange={(event) => set("stock", Number(event.target.value))} /></div></div>
        <label className="vn-label" style={{ marginTop: 8 }}>Description</label><textarea className="vn-input" rows={4} value={editing.description || ""} onChange={(event) => set("description", event.target.value)} />
        <label style={{ display: "flex", gap: 8, marginTop: 10, fontSize: 14 }}><input type="checkbox" checked={Boolean(editing.featured)} onChange={(event) => set("featured", event.target.checked)} /> Featured on home</label>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}><button type="button" className="vn-btn alt" onClick={() => setEditing(null)}>Cancel</button><button className="vn-btn" type="submit">Save product</button></div>
      </form>
    </div>
  );
}
