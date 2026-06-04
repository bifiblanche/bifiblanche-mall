import { Link } from "wouter";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--color-bg)", gap: "var(--space-6)" }}>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-text-muted)", fontWeight: 500 }}>404</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", color: "var(--color-text)", fontWeight: 400, fontStyle: "italic" }}>
        Page not found
      </h1>
      <Link href="/">
        <button style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, padding: "12px 28px", background: "#1a2530", color: "#f4f5eb", border: "none", cursor: "pointer" }}>
          Go Home
        </button>
      </Link>
    </div>
  );
}
