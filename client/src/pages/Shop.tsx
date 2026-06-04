import { useState, useEffect, useContext } from "react";
import { STATIC_PRODUCTS, type StaticProduct as Product } from "@/data/staticProducts";
import { PRODUCT_DETAILS } from "@/data/productDetails";
import { LangContext } from "@/lib/langContext";
import { getTracker } from "@/lib/tracker";
import serumBoxImg from "@assets/serum-box.jpg";
import creamOpenImg from "@assets/cream-open.jpg";
import handcreamImg from "@assets/handcream.jpg";
import faceoilProductImg from "@assets/faceoil-product.jpg";
import eyelipProductImg from "@assets/eyelip-product.jpg";
import footcreamProductImg from "@assets/footcream-product.jpg";
import cleansingoilProductImg from "@assets/cleansingoil-product.jpg";

const LOCAL_IMAGES: Record<string, string> = {
  "/assets/serum-box.jpg": serumBoxImg,
  "/assets/cream-open.jpg": creamOpenImg,
  "/assets/handcream.jpg": handcreamImg,
  "/assets/faceoil-product.jpg": faceoilProductImg,
  "/assets/eyelip-product.jpg": eyelipProductImg,
  "/assets/footcream-product.jpg": footcreamProductImg,
  "/assets/cleansingoil-product.jpg": cleansingoilProductImg,
};

function getImg(path: string) {
  return LOCAL_IMAGES[path] || path;
}

const CATEGORIES_KR = [
  { key: "all", label: "전체" },
  { key: "serum", label: "세럼" },
  { key: "cream", label: "크림" },
  { key: "cleansing", label: "클렌징" },
  { key: "oil", label: "오일" },
  { key: "eye", label: "아이·립" },
  { key: "body", label: "바디" },
];

const CATEGORIES_EN = [
  { key: "all", label: "All" },
  { key: "serum", label: "Serum" },
  { key: "cream", label: "Cream" },
  { key: "cleansing", label: "Cleansing" },
  { key: "oil", label: "Oil" },
  { key: "eye", label: "Eye·Lip" },
  { key: "body", label: "Body" },
];

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [tab, setTab] = useState<"desc" | "ingredients" | "review">("desc");
  const { lang } = useContext(LangContext);
  const KR = lang === "KR";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  const detail = PRODUCT_DETAILS[product.nameKo];

  return (
    <div
      className="modal-wrapper"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
      onClick={onClose}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(26,37,48,0.5)", backdropFilter: "blur(4px)" }} />
      <div
        className="modal-inner"
        style={{
          position: "relative",
          background: "var(--color-bg)",
          maxWidth: "900px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          display: "grid",
          gridTemplateColumns: "1fr 1.1fr",
        }}
        onClick={e => e.stopPropagation()}
        data-testid="modal-product"
      >
        {/* 제품 이미지 */}
        <div className="modal-img-panel" style={{ background: "var(--color-sky)", overflow: "hidden", position: "sticky", top: 0, maxHeight: "90vh" }}>
          <img
            src={getImg(product.image)}
            alt={product.nameKo}
            style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: "400px" }}
          />
        </div>

        {/* 제품 상세 */}
        <div className="modal-detail-panel" style={{ padding: "var(--space-10)", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            data-testid="button-close-modal"
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-muted)",
              fontSize: "1.4rem",
              lineHeight: 1,
              padding: "4px 8px",
              fontFamily: "var(--font-body)",
            }}
          >
            ×
          </button>

          {/* 제품 헤더 */}
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "var(--space-2)", fontWeight: 500 }}>
              BIFI BLANCHE
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", color: "var(--color-text)", fontWeight: 600, marginBottom: "var(--space-1)", lineHeight: 1.25 }}>
              {KR ? product.nameKo : product.name}
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
              {KR ? product.name : product.nameKo} · {product.volume}
            </p>
          </div>

          {/* 자극 지수 배지 */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-3)", background: "var(--color-surface-sky)", padding: "10px 16px", width: "fit-content" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "var(--color-accent-red)", fontWeight: 700, lineHeight: 1 }}>0.00</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: 1.5 }}>{KR ? "피부 자극 지수" : "Skin Irritation Index"}<br />{KR ? "Skin Irritation Index" : "피부 자극 지수"}</span>
          </div>

          {/* 탭 메뉴 */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--color-border)", gap: 0 }}>
            {(["desc", "ingredients", "review"] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); if (t === "ingredients") getTracker().trackIngredientClick(product?.nameKo || ""); }}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.08em",
                  fontWeight: tab === t ? 600 : 400,
                  color: tab === t ? "var(--color-accent-red)" : "var(--color-text-muted)",
                  background: "transparent",
                  border: "none",
                  borderBottom: tab === t ? "2px solid var(--color-accent-red)" : "2px solid transparent",
                  padding: "10px 20px 10px 0",
                  cursor: "pointer",
                  marginBottom: "-1px",
                }}
              >
                {t === "desc" ? (KR ? "제품 설명" : "Description") : t === "ingredients" ? (KR ? "성분 안내" : "Ingredients") : (KR ? "리뷰" : "Reviews")}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          {tab === "desc" && detail && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              {/* 짧은 설명 */}
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-text)", lineHeight: 1.85 }}>
                {KR ? detail.longDesc : detail.longDescEn}
              </p>

              {/* 추천 피부 고민 */}
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "var(--space-2)", fontWeight: 500 }}>
                  {KR ? "추천 피부 고민" : "Skin Concerns"}
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-text)", lineHeight: 1.75 }}>
                  {KR ? detail.skinConcern : detail.skinConcernEn}
                </p>
              </div>

              {/* 핵심 성분 */}
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "var(--space-3)", fontWeight: 500 }}>
                  {KR ? "핵심 성분" : "Key Ingredients"}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  {detail.keyIngredients.map((ki, i) => (
                    <div
                      key={i}
                      style={{ borderLeft: "2px solid var(--color-sky-dark)", paddingLeft: "var(--space-4)", paddingTop: "2px", paddingBottom: "2px" }}
                    >
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text)", marginBottom: "2px" }}>
                        {KR ? ki.name : ki.nameEn}
                      </p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--color-accent-red)", fontWeight: 500, marginBottom: "4px", letterSpacing: "0.04em" }}>
                        {KR ? ki.role : ki.roleEn}
                      </p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: 1.75 }}>
                        {KR ? ki.description : ki.descriptionEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "review" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", alignItems: "center", padding: "2rem 0" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", textAlign: "center", lineHeight: 1.8 }}>
                {KR
                  ? "네이버 스마트스토어에서 실제 구매 고객 리뷰를 확인하실 수 있습니다."
                  : "Read verified customer reviews on Naver Smart Store."}
              </p>
              <a
                href={(product as any).storeUrl || "https://smartstore.naver.com/seasonglass"}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
                onClick={() => getTracker().trackStoreClick()}
              >
                <button style={{
                  background: "#03C75A",
                  color: "#fff",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                  padding: "14px 32px",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "2px",
                }}>
                  {KR ? "네이버 리뷰 보러가기 →" : "View Reviews on Naver →"}
                </button>
              </a>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "var(--color-text-muted)", textAlign: "center" }}>
                {KR ? "* 리뷰는 실제 구매 고객만 작성 가능합니다" : "* Reviews are written by verified purchasers only"}
              </p>
            </div>
          )}

          {tab === "ingredients" && detail && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "var(--space-3)", fontWeight: 500 }}>
                  {KR ? "전성분" : "Full Ingredients"}
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--color-text-muted)", lineHeight: 2, letterSpacing: "0.01em" }}>
                  {detail.fullIngredients}
                </p>
              </div>
              <div style={{ background: "var(--color-surface-sky)", padding: "var(--space-4)", borderLeft: "2px solid var(--color-sky-dark)" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: 1.8 }}>
                  {KR
                    ? <>전 제품 피부 자극 지수 0.00으로, 피부 자극이 관찰되지 않은 것으로 평가 시험 완료하였습니다.<br />향에 민감하거나 알레르기가 있는 경우, 사용 전 패치 테스트를 권장합니다.</>
                    : <>All products have a skin irritation index of 0.00, confirmed by dermatological testing.<br />If you are sensitive to fragrance or have known allergies, we recommend a patch test before use.</>}
                </p>
              </div>
            </div>
          )}

          {/* 스마트스토어 버튼 - 제품별 개별 링크 */}
          <a
            href={(product as any).storeUrl || "https://smartstore.naver.com/seasonglass"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", marginTop: "auto" }}
            onClick={() => getTracker().trackStoreClick()}
          >
            <button
              style={{
                width: "100%",
                background: "#1a2530",
                color: "#f4f5eb",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 500,
                padding: "16px",
                border: "none",
                cursor: "pointer",
                transition: "background var(--transition-interactive)",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--color-accent-red)")}
              onMouseLeave={e => (e.currentTarget.style.background = "#1a2530")}
            >
              {KR ? "구매하러가기" : "Buy Now"}
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { lang } = useContext(LangContext);
  const KR = lang === "KR";
  const CATEGORIES = KR ? CATEGORIES_KR : CATEGORIES_EN;

  const products: Product[] = STATIC_PRODUCTS;
  const isLoading = false;

  // BEST SELLER 딥링크: localStorage productId 읽어 모달 자동 오픈
  const tryOpenProduct = (prods: Product[]) => {
    const openId = localStorage.getItem("bifi_open_product");
    if (!openId) return;
    localStorage.removeItem("bifi_open_product");
    const target = prods.find(p => String(p.id) === openId);
    if (target) {
      setSelectedProduct(target);
      getTracker().trackProductView(target.nameKo);
    }
  };

  useEffect(() => {
    if (!products || products.length === 0) return;
    tryOpenProduct(products);
  }, [products]);

  // 이미 /shop 페이지일 때 Home에서 커스텀 이벤트로 모달 오픈 요청
  useEffect(() => {
    const handler = () => {
      if (products && products.length > 0) tryOpenProduct(products);
    };
    window.addEventListener("bifi:openProduct", handler);
    return () => window.removeEventListener("bifi:openProduct", handler);
  }, [products]);

  // localStorage에서 검색어 읽기 (Nav 검색 → bifi_search_query)
  useEffect(() => {
    const applySearch = () => {
      const q = localStorage.getItem("bifi_search_query");
      if (q) {
        localStorage.removeItem("bifi_search_query");
        setSearchQuery(q);
        setActiveCategory("all");
      }
    };
    // 마운트 시 즉시 적용
    applySearch();
    // 이미 /shop 페이지에 있을 때 Nav에서 보내는 커스텀 이벤트
    window.addEventListener("bifi:search", applySearch);
    return () => window.removeEventListener("bifi:search", applySearch);
  }, []);

  // 검색어 + 카테고리 필터 적용
  const filtered = products?.filter(p => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    if (!searchQuery.trim()) return matchCat;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      p.nameKo.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q) ||
      (p.descriptionKo || "").toLowerCase().includes(q);
    return matchCat && matchSearch;
  }) ?? [];

  return (
    <div style={{ paddingTop: "5rem" }}>
      {/* 페이지 헤더 */}
      <section style={{ background: "var(--color-sky)", padding: "var(--space-16) 0 var(--space-12)" }}>
        <div className="shop-header-inner" style={{ maxWidth: "var(--content-wide)", margin: "0 auto", padding: "0 2.5rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(26,37,48,0.5)", marginBottom: "var(--space-3)", fontWeight: 500 }}>
            Microbiome Collection
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", color: "#1a2530", fontWeight: 600, lineHeight: 1.1 }}>
            {KR ? "전체 제품" : "All Products"}
          </h1>
        </div>
      </section>

      {/* 검색 결과 바 */}
      {searchQuery && (
        <div style={{ background: "var(--color-surface-sky, #eaf2f9)", borderBottom: "1px solid var(--color-border)", padding: "0.75rem 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", letterSpacing: "0.06em" }}>
            {KR ? `"${searchQuery}" 검색 결과 ${filtered.length}건` : `${filtered.length} results for "${searchQuery}"`}
          </p>
          <button
            onClick={() => { setSearchQuery(""); window.location.hash = "/shop"; }}
            style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", background: "none", border: "none", cursor: "pointer", color: "var(--color-accent-red)", padding: 0, letterSpacing: "0.06em" }}
          >
            {KR ? "검색 초기화 ×" : "Clear ×"}
          </button>
        </div>
      )}

      {/* 카테고리 필터 */}
      <section className="shop-filter-sticky" style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)", position: "sticky", top: "56px", zIndex: 20 }}>
        <div className="shop-filter-inner" style={{ maxWidth: "var(--content-wide)", margin: "0 auto", padding: "0 2.5rem" }}>
          <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                data-testid={`button-filter-${cat.key}`}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.1em",
                  padding: "1rem 1.5rem",
                  background: "transparent",
                  border: "none",
                  borderBottom: activeCategory === cat.key ? "2px solid var(--color-accent-red)" : "2px solid transparent",
                  color: activeCategory === cat.key ? "var(--color-accent-red)" : "var(--color-text-muted)",
                  fontWeight: activeCategory === cat.key ? 600 : 400,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "color var(--transition-interactive), border-color var(--transition-interactive)",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 제품 그리드 */}
      <section style={{ background: "var(--color-bg)", padding: "var(--space-12) 0 var(--space-24)" }}>
        <div style={{ maxWidth: "var(--content-wide)", margin: "0 auto", padding: "0 2.5rem" }}>
          {isLoading ? (
            <div className="shop-product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-6)" }}>
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} style={{ background: "var(--color-surface)", padding: "var(--space-4)" }}>
                  <div style={{ background: "var(--color-sky)", aspectRatio: "3/4", marginBottom: "var(--space-4)" }} />
                  <div style={{ height: "16px", background: "var(--color-divider)", marginBottom: "8px", width: "80%" }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="shop-product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-6)" }}>
              {filtered.map((product, i) => {
                const detail = PRODUCT_DETAILS[product.nameKo];
                return (
                  <div
                    key={product.id}
                    data-testid={`card-product-${product.id}`}
                    onClick={() => { setSelectedProduct(product); getTracker().trackProductView(product.nameKo); }}
                    className="fade-in visible"
                    style={{ cursor: "pointer", transitionDelay: `${i * 60}ms` }}
                  >
                    <div style={{ overflow: "hidden", marginBottom: "var(--space-4)", position: "relative", background: "var(--color-surface-sky)" }}>
                      <img
                        src={getImg(product.image)}
                        alt={product.nameKo}
                        style={{
                          width: "100%",
                          aspectRatio: "3/4",
                          objectFit: "cover",
                          transition: "transform 500ms ease",
                          display: "block",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                      />
                    </div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-text)", marginBottom: "var(--space-1)", fontWeight: 500 }}>
                      {KR ? product.nameKo : product.name}
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontWeight: 400, marginLeft: "6px" }}>({product.volume})</span>
                    </p>
                    {detail && (
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                        {KR ? detail.shortDesc : detail.shortDescEn}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "var(--space-24) 0", color: "var(--color-text-muted)" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)" }}>{KR ? "해당 카테고리 제품이 없습니다" : "No products in this category"}</p>
            </div>
          )}
        </div>
      </section>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
