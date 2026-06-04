import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "wouter";
import logoBifiBlanche from "@assets/logo-bifi-blanche.png";
import { LangContext } from "@/lib/langContext";
import { getTracker } from "@/lib/tracker";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location] = useLocation();
  const { lang, toggleLang } = useContext(LangContext);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 페이지 이동 시 스크롤 실제 위치로 동기화
  useEffect(() => {
    setScrolled(window.scrollY > 10);
  }, [location]);

  // hash를 직접 읽어 홈 판단
  const hash = window.location.hash.replace(/^#\/?\//, ""); // "" or "shop" etc
  const isHome = hash === "" || hash === "/";
  const isTransparent = isHome && !scrolled;

  const linkColor = isTransparent ? "rgba(26,37,48,0.7)" : "var(--color-text)";
  const linkStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: "0.72rem",
    fontWeight: 500,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: linkColor,
    textDecoration: "none",
    transition: "opacity 200ms ease",
    whiteSpace: "nowrap",
  };

  // 내부 검색: localStorage에 검색어 저장 후 /shop 으로 이동
  function handleSearch() {
    if (!searchQuery.trim()) return;
    getTracker().trackSearch(searchQuery.trim());
    localStorage.setItem("bifi_search_query", searchQuery.trim());
    // 이미 /shop이면 커스텀 이벤트로 즉시 반영, 아니면 hash 이동
    const curHash = window.location.hash.replace(/^#\/?/, "");
    if (curHash === "shop" || curHash === "/shop") {
      window.dispatchEvent(new CustomEvent("bifi:search"));
    } else {
      window.location.hash = "/shop";
    }
    setSearchOpen(false);
    setSearchQuery("");
  }

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: "56px",
        display: "flex",
        alignItems: "center",
        background: isTransparent ? "transparent" : "var(--color-bg)",
        borderBottom: isTransparent ? "none" : "1px solid var(--color-border)",
        transition: "background 280ms ease, border-color 280ms ease",
      }}
    >
      {/* 로고: header 기준 절대 정중앙 */}
      <Link
        href="/"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          zIndex: 1,
        }}
      >
        <img
          src={logoBifiBlanche}
          alt="BiFi Blanche"
          style={{
            height: isTransparent ? "36px" : "30px",
            width: "auto",
            objectFit: "contain",
            transition: "height 280ms ease, filter 280ms ease",
            filter: isTransparent ? "brightness(0) invert(1)" : "none",
          }}
        />
      </Link>
      <div
        style={{
          maxWidth: "var(--content-wide)",
          margin: "0 auto",
          width: "100%",
          padding: "0 2.5rem",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* ── 왼쪽 nav: 제품 / 성분가이드 / 이벤트 / 아카이브 ── */}
        <nav className="nav-left" style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link href="/shop" style={linkStyle}
            onMouseEnter={e => ((e.target as HTMLElement).style.opacity = "0.45")}
            onMouseLeave={e => ((e.target as HTMLElement).style.opacity = "1")}
          >
            {lang === "KR" ? "제품" : "Products"}
          </Link>
          <a
            href="https://bifiblanche.pplx.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
            onMouseEnter={e => ((e.target as HTMLElement).style.opacity = "0.45")}
            onMouseLeave={e => ((e.target as HTMLElement).style.opacity = "1")}
          >
            {lang === "KR" ? "성분가이드" : "Ingredients"}
          </a>
          <Link href="/event" style={linkStyle}
            onMouseEnter={e => ((e.target as HTMLElement).style.opacity = "0.45")}
            onMouseLeave={e => ((e.target as HTMLElement).style.opacity = "1")}
          >
            {lang === "KR" ? "이벤트" : "Events"}
          </Link>
          <Link href="/archive" style={linkStyle}
            onMouseEnter={e => ((e.target as HTMLElement).style.opacity = "0.45")}
            onMouseLeave={e => ((e.target as HTMLElement).style.opacity = "1")}
          >
            {lang === "KR" ? "아카이브" : "Archive"}
          </Link>
        </nav>

        {/* 로고는 header에 absolute로 붙임 — 여기는 grid 균형 유지용 빈 칸 */}
        <span />

        {/* ── 오른쪽: 스토어 + 검색 + KR 토글 ── */}
        <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: "1.25rem", justifyContent: "flex-end" }}>
          {/* 스토어 링크 */}
          <a
            href="https://smartstore.naver.com/seasonglass"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
            onMouseEnter={e => ((e.target as HTMLElement).style.opacity = "0.45")}
            onMouseLeave={e => ((e.target as HTMLElement).style.opacity = "1")}
          >
            {lang === "KR" ? "스토어" : "Store"}
          </a>

          {/* 검색 인풋 (열렸을 때) */}
          {searchOpen && (
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") handleSearch();
                if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
              }}
              placeholder={lang === "KR" ? "검색..." : "Search..."}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                background: "transparent",
                border: "none",
                borderBottom: `1px solid ${linkColor}`,
                outline: "none",
                color: linkColor,
                padding: "2px 4px",
                width: "140px",
                letterSpacing: "0.04em",
              }}
            />
          )}

          {/* 돋보기 아이콘 */}
          <button
            onClick={() => { setSearchOpen(v => !v); if (searchOpen) setSearchQuery(""); }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              color: linkColor,
              transition: "opacity 200ms ease",
            }}
            aria-label="검색"
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.45")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="6.5" cy="6.5" r="4.5" />
              <line x1="10" y1="10" x2="14" y2="14" />
            </svg>
          </button>

          {/* KR / EN 토글 */}
          <button
            onClick={toggleLang}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              color: linkColor,
              padding: "2px 0",
              transition: "opacity 200ms ease",
              minWidth: "24px",
            }}
            aria-label="언어 전환"
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.45")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            {lang}
          </button>
        </div>

        {/* ── 모바일 햄버거 ── */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="nav-hamburger"
          style={{
            display: "none",
            width: "32px",
            height: "32px",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: linkColor,
            position: "absolute",
            right: "0",
            top: "50%",
            transform: "translateY(-50%)",
          }}
          aria-label="메뉴 열기"
        >
          <span style={{ display: "block", height: "1px", width: "22px", background: "currentColor", transition: "transform 250ms ease", transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
          <span style={{ display: "block", height: "1px", width: "22px", background: "currentColor", transition: "opacity 250ms ease", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: "block", height: "1px", width: "22px", background: "currentColor", transition: "transform 250ms ease", transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
        </button>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "56px",
            left: 0,
            right: 0,
            background: isHome ? "transparent" : "rgba(185,208,233,0.50)",
            backdropFilter: isHome ? "none" : "blur(8px)",
            WebkitBackdropFilter: isHome ? "none" : "blur(8px)",
            borderBottom: "none",
            padding: "40px 40px 48px 40px",
            display: "flex",
            flexDirection: "column",
            gap: "26px",
          }}
          onClick={() => setMenuOpen(false)}
        >
          {[
            { href: "/#/shop", label: lang === "KR" ? "제품" : "Products" },
            { href: "https://bifiblanche.pplx.app/", label: lang === "KR" ? "성분가이드" : "Ingredients", external: true },
            { href: "/#/event", label: lang === "KR" ? "이벤트" : "Events" },
            { href: "/#/archive", label: lang === "KR" ? "아카이브" : "Archive" },
          ].map(({ href, label, external }) => (
            <a
              key={href}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: isHome ? "#ffffff" : "#1a2530", textDecoration: "none" }}
            >
              {label}
            </a>
          ))}
          <a
            href="https://smartstore.naver.com/seasonglass"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: isHome ? "#ffffff" : "#1a2530", textDecoration: "none" }}
          >
            {lang === "KR" ? "스토어" : "Store"}
          </a>
          {/* 모바일 언어 토글 */}
          <button
            onClick={toggleLang}
            style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.14em", background: "none", border: "none", color: isHome ? "#ffffff" : "#1a2530", cursor: "pointer", textAlign: "left", padding: 0 }}
          >
            {lang === "KR" ? "EN (English)" : "KR (한국어)"}
          </button>
        </div>
      )}
    </header>
  );
}
