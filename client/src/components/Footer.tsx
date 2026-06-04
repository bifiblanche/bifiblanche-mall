import { useContext } from "react";
import { LangContext } from "@/lib/langContext";
export default function Footer() {
  const { lang } = useContext(LangContext);
  const KR = lang === "KR";
  return (
    <footer
      style={{
        background: "var(--color-sky)",
        borderTop: "1px solid var(--color-border)",
        overflow: "hidden",
      }}
    >
      {/* Top section — links + info */}
      <div
        className="footer-top-grid"
        style={{
          maxWidth: "var(--content-wide)",
          margin: "0 auto",
          padding: "4rem 2.5rem 3rem",
          display: "grid",
          gridTemplateColumns: "2fr 1.4fr 1fr 1fr",
          gap: "3rem",
        }}
      >
        {/* Brand info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(26,37,48,0.5)",
            }}
          >
            BIFI BLANCHE
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              color: "rgba(26,37,48,0.65)",
              lineHeight: 1.8,
              maxWidth: "36ch",
            }}
          >
            {KR ? (
              <>
                피부를 하나의 생태계로 바라봅니다.<br />
                순수한 균형, 자극 지수 0.00의 원칙으로<br />
                당신의 피부 생태계를 지킵니다.
              </>
            ) : (
              <>
                We see skin as a living ecosystem.<br />
                Pure balance, guided by the Irritation Index 0.00 principle —<br />
                protecting your skin's ecosystem.
              </>
            )}
          </p>
          <a
            href="https://smartstore.naver.com/seasonglass"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-body)",
              fontSize: "0.72rem",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#1a2530",
              textDecoration: "none",
              borderBottom: "1px solid rgba(26,37,48,0.3)",
              paddingBottom: "2px",
              width: "fit-content",
              transition: "opacity 200ms",
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLElement>) => ((e.target as HTMLElement).style.opacity = "0.5")}
            onMouseLeave={(e: React.MouseEvent<HTMLElement>) => ((e.target as HTMLElement).style.opacity = "1")}
          >
            {KR ? "스마트스토어 바로가기 →" : "Visit Smart Store →"}
          </a>
        </div>

        {/* Contact */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(26,37,48,0.4)",
              marginBottom: "0.25rem",
            }}
          >
            Contact
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { label: "HOURS", value: "09:30AM – 17:30PM (MON – FRI)" },
              { label: "BREAK", value: "12:30 – 13:30PM" },
              { label: "CALL", value: "02-3413-9017" },
            ].map(({ label, value }) => (
              <p key={label} style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "rgba(26,37,48,0.65)", lineHeight: 1.6, margin: 0 }}>
                <span style={{ fontWeight: 600, letterSpacing: "0.06em", color: "rgba(26,37,48,0.45)", fontSize: "0.65rem" }}>{label} </span>
                {value}
              </p>
            ))}
            <a
              href="https://www.instagram.com/bifiblanche_official/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                color: "rgba(26,37,48,0.65)",
                textDecoration: "none",
                lineHeight: 1.6,
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "opacity 200ms",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLElement>) => ((e.target as HTMLElement).style.opacity = "0.5")}
              onMouseLeave={(e: React.MouseEvent<HTMLElement>) => ((e.target as HTMLElement).style.opacity = "1")}
            >
              <span style={{ fontWeight: 600, letterSpacing: "0.06em", color: "rgba(26,37,48,0.45)", fontSize: "0.65rem" }}>INSTAGRAM </span>
              @bifiblanche_official
            </a>
          </div>
          <div style={{ marginTop: "0.25rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(26,37,48,0.1)" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "rgba(26,37,48,0.5)", lineHeight: 1.75, margin: 0 }}>
              57, Seolleung-ro 130-gil,<br />
              Gangnam-gu, Seoul, Korea
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "rgba(26,37,48,0.38)", lineHeight: 1.6, marginTop: "2px" }}>
              서울 강남구 선릉로130길 57
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(26,37,48,0.4)",
              marginBottom: "0.25rem",
            }}
          >
            Navigate
          </p>
          {[
            { href: "/#/", label: "Home" },
            { href: "/#/shop", label: "Products" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "rgba(26,37,48,0.7)",
                textDecoration: "none",
                transition: "opacity 200ms",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLElement>) => ((e.target as HTMLElement).style.opacity = "0.4")}
              onMouseLeave={(e: React.MouseEvent<HTMLElement>) => ((e.target as HTMLElement).style.opacity = "1")}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Brand principles */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(26,37,48,0.4)",
              marginBottom: "0.25rem",
            }}
          >
            Principles
          </p>
          {[
            "Skin Microbiome",
            "Irritation Index 0.00",
            "Pure Balance",
            "Glass Packaging",
          ].map((item) => (
            <p
              key={item}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                color: "rgba(26,37,48,0.6)",
                lineHeight: 1.5,
              }}
            >
              {item}
            </p>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div
        className="footer-divider"
        style={{
          maxWidth: "var(--content-wide)",
          margin: "0 auto",
          padding: "0 2.5rem",
        }}
      >
        <div style={{ height: "1px", background: "rgba(26,37,48,0.12)" }} />
      </div>

      {/* Giant wordmark — SENNOK style */}
      <div
        style={{
          padding: "0",
          overflow: "hidden",
          lineHeight: 0.85,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 14vw, 18rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "rgba(26,37,48,0.06)",
            whiteSpace: "nowrap",
            userSelect: "none",
            textAlign: "center",
            lineHeight: 0.9,
            paddingBottom: "0.05em",
          }}
        >
          BIFI BLANCHE
        </p>
      </div>

      {/* Bottom bar */}
      <div
        className="footer-bottom"
        style={{
          maxWidth: "var(--content-wide)",
          margin: "0 auto",
          padding: "1.25rem 2.5rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.68rem",
            color: "rgba(26,37,48,0.45)",
            letterSpacing: "0.06em",
          }}
        >
          © 2026 BIFI BLANCHE. All rights reserved.
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.68rem",
            color: "rgba(26,37,48,0.45)",
            letterSpacing: "0.04em",
          }}
        >
          Skin Ecosystem · Zero Irritation · Pure Balance
        </p>
      </div>
    </footer>
  );
}
