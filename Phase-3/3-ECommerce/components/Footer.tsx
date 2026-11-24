import Link from "next/link";

export default function Footer() {
  return (
    <footer className="vn-footer">
      <div className="vn-footer-inner">
        <div><strong style={{ color: "var(--ink)" }}>VoltNest</strong><p style={{ margin: "6px 0 0" }}>Considered electronics, chosen for how they live with you.</p></div>
        <div style={{ display: "flex", gap: 18 }}><Link href="/shop">Shop</Link><Link href="/account">Orders</Link><Link href="/admin">Dashboard</Link></div>
        <p style={{ margin: 0 }}>Built by Saad. All rights reserved.</p>
      </div>
    </footer>
  );
}
