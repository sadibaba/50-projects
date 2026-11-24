import Link from "next/link";

export default function NotFound() {
  return (
    <div className="empty" style={{ paddingTop: 120 }}>
      <h1 style={{ color: "var(--text)", fontSize: 48, margin: 0 }}>404</h1>
      <p style={{ marginTop: 8 }}>This page could not be found.</p>
      <Link href="/" className="ig-btn primary" style={{ display: "inline-block", marginTop: 14 }}>Back home</Link>
    </div>
  );
}
