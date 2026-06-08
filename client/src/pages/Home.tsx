import { useEffect, useRef, useContext } from "react";
import { Link } from "wouter";
import heroVideoUrl from "@assets/hero-video.mp4";
import heroVideoMobileUrl from "@assets/hero-video-mobile.mp4";
import serumBoxImg from "@assets/serum-box.jpg";
import faceoilImgPc from "@assets/faceoil-hero-pc.jpg";
import faceoilImgMobile from "@assets/faceoil-hero-mobile.jpg";
import heroProductsImg from "@assets/hero-products.jpg";
import principleSideImg from "@assets/principle-side.jpg";
import faceoilProductImg from "@assets/faceoil-product.jpg";
import cleansingoilProductImg from "@assets/cleansingoil-product.jpg";
import { LangContext } from "@/lib/langContext";

function FadeSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`fade-in ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Home() {
  const { lang } = useContext(LangContext);
  const KR = lang === "KR";
  function openProduct(productId: number) {
    localStorage.setItem("bifi_open_product", String(productId));
    const currentHash = window.location.hash.replace(/^#\/?/, "");
    if (currentHash === "shop") {
      // 이미 /shop 페이지이면 커스텀 이벤트로 모달 오픈 지시
      window.dispatchEvent(new CustomEvent("bifi:openProduct"));
    } else {
      window.location.hash = "/shop";
    }
  }

  return (
    <div>

      {/* ── HERO: PC 50/50 Split | Mobile 영상(위)+이미지(아래) ── */}
      {/* PC */}
      <section
        className="hero-split hero-pc"
        style={{
          height: "100svh",
          minHeight: "600px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          position: "relative",
        }}
      >
        <div className="hero-panel" style={{ overflow: "hidden", position: "relative", background: "var(--color-sky)" }}>
          <img src={heroProductsImg} alt="BIFI BLANCHE products" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        </div>
        <div className="hero-panel" style={{ overflow: "hidden", position: "relative", background: "#e8ddd2" }}>
          <video
            src={heroVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
          />
          <p
            className="hero-watermark"
            style={{
              position: "absolute", bottom: "2.5rem", right: "-0.04em",
              fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 8vw, 7.5rem)",
              fontWeight: 800, letterSpacing: "-0.03em", color: "rgba(244,245,235,0.13)",
              lineHeight: 1, userSelect: "none", pointerEvents: "none", whiteSpace: "nowrap",
            }}
          >
            BIFI BLANCHE
          </p>
        </div>
        <div
          className="hero-bottom-text"
          style={{ position: "absolute", bottom: "3rem", left: "50%", transform: "translateX(-50%)", zIndex: 10, textAlign: "center", pointerEvents: "none" }}
        >
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(26,37,48,0.45)", fontWeight: 400 }}>
            Skin Microbiome · Pure Balance
          </p>
        </div>
        <div className="hero-scroll-line" style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "1px", height: "56px", background: "linear-gradient(to bottom, transparent, rgba(26,37,48,0.3))", zIndex: 10 }} />
      </section>

      {/* Mobile hero: 영상(위, 9:16) + 이미지(아래, 6:7) */}
      <div className="hero-mobile">
        <div style={{ width: "100%", aspectRatio: "9/16", overflow: "hidden", background: "#000" }}>
          <video
            src={heroVideoMobileUrl}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
          />
        </div>
        <div style={{ width: "100%", aspectRatio: "6/7", overflow: "hidden", background: "var(--color-sky)" }}>
          <img src={heroProductsImg} alt="BIFI BLANCHE products" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        </div>
      </div>



      {/* ── PHILOSOPHY (먼저) ── */}
      <section id="philosophy" style={{ background: "var(--color-bg)" }}>

        {/* Header */}
        <div className="philosophy-header" style={{ maxWidth: "var(--content-wide)", margin: "0 auto", padding: "clamp(4rem,6vw,6rem) 2.5rem 2rem" }}>
          <FadeSection>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1rem", fontWeight: 500 }}>
              Brand Principle
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 4.5rem)",
              fontWeight: 400,
              color: "var(--color-text)",
              lineHeight: 1.0, letterSpacing: "-0.02em",
            }}>
              PURE BALANCE<br />
              <span style={{ color: "var(--color-accent-red)" }}>BIFI BLANCHE</span>
            </h2>
          </FadeSection>
        </div>

        {/* 세럼 이미지 + 3원칙 — grid stretch로 항상 같은 높이 유지 */}
        <div
          className="philosophy-split"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "stretch",
          }}
        >
          {/* Left — serum image: height:100%로 오른쪽 전체에 방쳐 */}
          <div
            className="philo-img"
            style={{ overflow: "hidden", position: "relative" }}
          >
            <img
              src={principleSideImg}
              alt="BIFI BLANCHE Products"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
                transition: "transform 700ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          {/* Right — 3개 원칙: grid 1/3씩 균등 분할 */}
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr 1fr" }}>

            {/* 원칙 1 */}
            <div style={{
              background: "var(--color-sky)",
              padding: "clamp(2rem, 3vw, 2.75rem) 3rem",
              display: "flex", flexDirection: "column", justifyContent: "center",
              borderBottom: "2px solid white",
            }}>
              <span style={{ display: "inline-block", width: "20px", height: "2px", background: "var(--color-accent-red)", marginBottom: "1.25rem" }} />
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 1.6vw, 1.45rem)", fontWeight: 500, color: "#1a2530", marginBottom: "0.75rem", lineHeight: 1.25, letterSpacing: "-0.01em" }}>
                {KR ? "마이크로바이옴 생태계 보호" : "Microbiome Ecosystem Protection"}
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "rgba(26,37,48,0.65)", lineHeight: 1.8 }}>
                {KR
                  ? "발효 성분과 프리바이오틱 조합이 피부 생태계를 건강하게 유지하도록 포뮬러 단계부터 설계되었습니다."
                  : "Fermented actives and prebiotic complexes are formulated from the ground up to maintain a healthy skin ecosystem."}
              </p>
            </div>

            {/* 원칙 2 */}
            <div style={{
              background: "#f5f5f0",
              padding: "clamp(2rem, 3vw, 2.75rem) 3rem",
              display: "flex", flexDirection: "column", justifyContent: "center",
              borderBottom: "2px solid white",
            }}>
              <span style={{ display: "inline-block", width: "20px", height: "2px", background: "var(--color-accent-yellow)", marginBottom: "1.25rem" }} />
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 1.6vw, 1.45rem)", fontWeight: 500, color: "var(--color-text)", marginBottom: "0.75rem", lineHeight: 1.25, letterSpacing: "-0.01em" }}>
                {KR ? "자극 지수 0.00 원칙" : "Irritation Index 0.00 Principle"}
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", lineHeight: 1.8 }}>
                {KR
                  ? "마이크로바이옴 생태계를 고려하여 성분을 선별하고, 피부 자극 가능성을 최소화하는 방향으로 개발하였습니다."
                  : "Ingredients are selected with the skin microbiome in mind, developed to minimise the potential for skin irritation."}
              </p>
            </div>

            {/* 원칙 3 */}
            <div style={{
              background: "var(--color-sky-light, #d4e5f3)",
              padding: "clamp(2rem, 3vw, 2.75rem) 3rem",
              display: "flex", flexDirection: "column", justifyContent: "center",
            }}>
              <span style={{ display: "inline-block", width: "20px", height: "2px", background: "var(--color-sky-dark)", marginBottom: "1.25rem" }} />
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 1.6vw, 1.45rem)", fontWeight: 500, color: "var(--color-text)", marginBottom: "0.75rem", lineHeight: 1.25, letterSpacing: "-0.01em" }}>
                {KR ? "유리병 패키징의 선택" : "Glass Bottle Packaging"}
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "rgba(26,37,48,0.65)", lineHeight: 1.8 }}>
                {KR
                  ? "피부의 균형뿐 아니라 내용물을 담는 용기까지 생각했습니다. 보관 특성을 고려해 유리병 패키지를 사용했으며, 재활용이 가능한 소재를 선택했습니다."
                  : "We considered not just skin balance, but also the packaging itself. Glass bottles were chosen for their storage properties, and recyclable materials were selected throughout."}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── CORE TECHNOLOGY (나중에) ── */}
      <section style={{ background: "var(--color-cream)", padding: "clamp(5rem, 8vw, 9rem) 0" }}>
        <div className="section-inner-pad" style={{ maxWidth: "var(--content-wide)", margin: "0 auto", padding: "0 2.5rem" }}>
          <FadeSection>
            <div className="synbi-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(3rem, 6vw, 7rem)", alignItems: "start" }}>
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1.5rem", fontWeight: 500 }}>
                  Core Technology
                </p>
                <h2 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.5rem, 4.5vw, 5.5rem)",
                  fontWeight: 400,
                  color: "var(--color-text)",
                  lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: "2.5rem",
                }}>
                  {KR ? <>신비<br />콤플렉스™</> : <>SynBi<br />Complex™</>}
                </h2>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", lineHeight: 1.9, marginBottom: "2rem", maxWidth: "42ch" }}>
                  {KR
                    ? "Probiotics와 Prebiotics의 시너지, SynBiotics를 기반으로 설계된 성분 복합체. 피부 장벽 개선, 피부 생태계 균형, 주름 개선, 트러블 개선에 효과를 발휘하며 사균체(Heat-killed) 방식으로 안정성과 효과를 극대화했습니다."
                    : "An ingredient complex designed around SynBiotics — the synergy of Probiotics and Prebiotics. It strengthens the skin barrier, balances the skin ecosystem, improves wrinkles and blemishes, and maximises efficacy through a heat-killed postbiotic approach."}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {["#Longevity", "#Skin Barrier", "#Microbiome Balance", "#Anti-Wrinkle"].map(tag => (
                    <span key={tag} style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "var(--color-accent-red)", border: "1px solid var(--color-accent-red)", padding: "4px 12px", letterSpacing: "0.04em", fontWeight: 500 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
                {[
                  { name: "Bifidobacterium", role: "Skin Microbiome Balancing", desc: KR ? "유해미생물 억제 및 피부탄력 강화" : "Inhibits harmful microbes, strengthens skin elasticity", bg: "var(--color-sky)" },
                  { name: "Lactobacillus", role: "Brightening · Anti-Wrinkle", desc: KR ? "멜라닌 합성 저해 및 피부 주름 개선" : "Inhibits melanin synthesis, reduces wrinkles", bg: "#f0f0ea" },
                  { name: "Lactococcus", role: "Skin Barrier Function", desc: KR ? "보습, pH 조절 및 Filaggrin 개선" : "Moisturises, regulates pH, improves Filaggrin", bg: "#f0f0ea" },
                  { name: "Streptococcus", role: "Improved Skin Barrier", desc: KR ? "히알루론산(HA) 생성, 항산화" : "Promotes HA production, antioxidant activity", bg: "var(--color-sky)" },
                ].map((s, i) => (
                  <div key={i} style={{ background: s.bg, padding: "1.75rem 1.5rem", transition: "background 0.25s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#dde9f4")}
                    onMouseLeave={e => (e.currentTarget.style.background = s.bg)}
                  >
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "3px", letterSpacing: "0.03em" }}>{s.name}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "var(--color-accent-red)", fontWeight: 600, marginBottom: "6px", letterSpacing: "0.02em" }}>{s.role}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "var(--color-text-muted)", lineHeight: 1.65 }}>{s.desc}</p>
                  </div>
                ))}
                <div style={{ gridColumn: "1 / -1", background: "#1a2530", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-sky)", letterSpacing: "0.06em", flexShrink: 0 }}>Prebiotics +</span>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "rgba(244,245,235,0.55)", lineHeight: 1.6 }}>
                    {KR
                      ? "유익균 생장 지원 · Improved Skin Barrier · Immunomodulation · Anti-Inflammation"
                      : "Supports beneficial bacteria · Improved Skin Barrier · Immunomodulation · Anti-Inflammation"}
                  </p>
                </div>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ── FACE OIL FULL BLEED ── */}
      <section className="faceoil-section" style={{ position: "relative", height: "70vh", minHeight: "480px", overflow: "hidden" }}>
        <img src={faceoilImgPc} alt="BIFI BLANCHE Face Oil" className="faceoil-img-pc" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        <img src={faceoilImgMobile} alt="BIFI BLANCHE Face Oil" className="faceoil-img-mobile" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(26,37,48,0.22)" }} />

      </section>

      {/* ── PRODUCT PREVIEW ── */}
      <section className="product-preview-section" style={{ background: "var(--color-cream)", padding: "clamp(5rem, 8vw, 9rem) 0" }}>
        <div className="section-inner-pad" style={{ maxWidth: "var(--content-wide)", margin: "0 auto", padding: "0 2.5rem" }}>
          <FadeSection>
            <div className="product-preview-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.75rem", fontWeight: 500 }}>
                  {KR ? "Our Products" : "Our Products"}
                </p>
                {/* BEST SELLER — 폰트 절반 크기 */}
                <h2 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.1rem, 2vw, 2.2rem)",
                  fontWeight: 400,
                  color: "var(--color-text)",
                  lineHeight: 1.0,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}>
                  {KR ? "BEST SELLER" : "BEST SELLER"}
                </h2>
              </div>
              <Link href="/shop">
                <button
                  style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text)", background: "transparent", border: "1px solid var(--color-border)", padding: "10px 28px", cursor: "pointer", fontWeight: 500, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#1a2530"; e.currentTarget.style.color = "#f4f5eb"; e.currentTarget.style.borderColor = "#1a2530"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text)"; e.currentTarget.style.borderColor = "var(--color-border)"; }}
                >
                  {KR ? "전체 보기 →" : "View All →"}
                </button>
              </Link>
            </div>
          </FadeSection>

          {/* 3-col product grid — gap 추가 */}
          <div className="product-preview-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {[
              { img: serumBoxImg, productId: 1, volume: "40ml", name: KR ? "마이크로바이옴 수분세럼" : "Moisture Serum", desc: KR ? "4중 발효 복합체 · 미백·주름 이중 기능성 세럼" : "4-layer fermented complex · Dual-function brightening & anti-wrinkle" },
              { img: faceoilProductImg, productId: 5, volume: "40ml", name: KR ? "마이크로바이옴 스쿠알란 페이스오일" : "Microbiome Squalane Face Oil", desc: KR ? "식물성 스쿠알란 · 녹차씨 오일 · 피부 결 개선" : "Plant squalane · Green tea seed oil · Skin texture improvement" },
              { img: cleansingoilProductImg, productId: 4, volume: "130ml", name: KR ? "마이크로바이옴 클렌징오일" : "Microbiome Cleansing Oil", desc: KR ? "식물성 오일 베이스 · 가벼운 텍스처 · 워셔블" : "Plant oil base · Lightweight texture · Washable" },
            ].map((item, i) => (
              <FadeSection key={i} delay={i * 80}>
                <div
                  style={{ cursor: "pointer", display: "block" }}
                  onClick={() => openProduct(item.productId)}
                >
                  <div style={{ overflow: "hidden", position: "relative", background: "var(--color-surface-sky)" }}>
                    <img
                      src={item.img}
                      alt={item.name}
                      style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block", transition: "transform 600ms ease" }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>
                  <div style={{ padding: "1rem 0.25rem" }}>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-text)", fontWeight: 600, marginBottom: "4px" }}>
                      {KR ? (
                        <>
                          <span className="best-name-prefix">마이크로바이옴</span>
                          <br className="best-name-break" />
                          <span>{item.name.replace("마이크로바이옴 ", "")}</span>
                          {" "}
                          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontWeight: 400 }}>({item.volume})</span>
                        </>
                      ) : (
                        <>{item.name} <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontWeight: 400 }}>({item.volume})</span></>
                      )}
                    </p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
