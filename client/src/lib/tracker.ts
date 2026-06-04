/**
 * BIFI BLANCHE Analytics Tracker
 * 자동으로 유입/스크롤/클릭/체류/검색/이벤트를 추적하여 서버로 전송
 */

const ADMIN_TOKEN = "bifi2024xK9mPqR";

// 라이브 환경에서는 /port/5000 prefix 필요
function apiBase() {
  // 개발: localhost → 직접
  // 프로덕션: pplx.app → /port/5000 prefix
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && !window.location.hostname.startsWith("127.")) {
    return "/port/5000";
  }
  return "";
}

// ── ID helpers ─────────────────────────────────────────────────
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function getVisitorId(): string {
  let id = localStorage.getItem("bf_vid");
  if (!id) {
    id = uuid();
    localStorage.setItem("bf_vid", id);
  }
  return id;
}

function getVisitCount(): number {
  const n = parseInt(localStorage.getItem("bf_vc") || "0") + 1;
  localStorage.setItem("bf_vc", String(n));
  return n;
}

// ── UTM / Referrer parsing ──────────────────────────────────────
function parseReferrer(ref: string): string {
  if (!ref) return "direct";
  try {
    const url = new URL(ref);
    const host = url.hostname.replace("www.", "");
    if (host.includes("naver")) return "naver";
    if (host.includes("google")) return "google";
    if (host.includes("instagram")) return "instagram";
    if (host.includes("threads")) return "threads";
    if (host.includes("kakao")) return "kakao";
    if (host.includes("t.co") || host.includes("twitter")) return "twitter";
    if (host.includes("facebook")) return "facebook";
    if (host.includes("youtube")) return "youtube";
    return host;
  } catch {
    return "unknown";
  }
}

function getUTM() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source") || undefined,
    utm_medium: p.get("utm_medium") || undefined,
    utm_campaign: p.get("utm_campaign") || undefined,
    utm_content: p.get("utm_content") || undefined,
  };
}

function getDevice(): string {
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return "mobile";
  if (/Tablet|iPad/i.test(ua)) return "tablet";
  return "desktop";
}

// ── fetch with beacon fallback ──────────────────────────────────
function post(path: string, data: object, useSendBeacon = false) {
  const url = apiBase() + path;
  const body = JSON.stringify(data);
  if (useSendBeacon && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(url, blob);
  } else {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }
}

// ── Admin fetch helper ──────────────────────────────────────────
export async function adminFetch(path: string, days = 30) {
  const res = await fetch(`${apiBase()}${path}?days=${days}`, {
    headers: { "x-admin-token": ADMIN_TOKEN },
  });
  return res.json();
}

// ── Tracker class ───────────────────────────────────────────────
class Tracker {
  private sessionId: string;
  private visitorId: string;
  private pageViewId: number | null = null;
  private pageEntered: number = 0;
  private maxScroll: number = 0;
  private firstClickDone: boolean = false;
  private currentPage: string = "";
  private prevPage: string = "";

  constructor() {
    this.visitorId = getVisitorId();
    this.sessionId = uuid();
    this.currentPage = this.getPage();

    this.initSession();
    this.initPageView();
    this.initScrollTracker();
    this.initClickTracker();
    this.initVisibilityTracker();
  }

  private getPage() {
    const hash = window.location.hash.replace("#", "") || "/";
    return hash || "/";
  }

  private initSession() {
    const visitCount = getVisitCount();
    const utms = getUTM();
    const referrer = document.referrer;

    post("/api/track/session", {
      id: this.sessionId,
      visitor_id: this.visitorId,
      started_at: Date.now(),
      referrer: parseReferrer(referrer),
      referrer_raw: referrer,
      ...utms,
      landing_page: this.currentPage,
      device: getDevice(),
      user_agent: navigator.userAgent.substring(0, 200),
      is_returning: visitCount > 1 ? 1 : 0,
    });
  }

  private initPageView() {
    this.pageEntered = Date.now();
    this.maxScroll = 0;
    this.firstClickDone = false;

    post("/api/track/pageview", {
      session_id: this.sessionId,
      visitor_id: this.visitorId,
      page: this.currentPage,
      referrer_page: this.prevPage || null,
      entered_at: this.pageEntered,
    });

    // 서버에서 생성된 pageview id를 받아야 update할 수 있음
    // 편의상 entered_at + session_id 조합으로 identify
    this.pageViewId = null;
  }

  private endPageView() {
    const now = Date.now();
    const timeSpent = Math.round((now - this.pageEntered) / 1000);
    // sendBeacon으로 페이지 이탈 시에도 전송
    post("/api/track/event", {
      session_id: this.sessionId,
      visitor_id: this.visitorId,
      event_type: "page_exit",
      page: this.currentPage,
      scroll_depth: this.maxScroll,
      time_on_page: timeSpent,
      ts: now,
    }, true);
  }

  private initScrollTracker() {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrolled = doc.scrollTop + doc.clientHeight;
        const total = doc.scrollHeight;
        const pct = Math.round((scrolled / total) * 100);
        if (pct > this.maxScroll) {
          this.maxScroll = pct;
          // milestone 25/50/75/90/100
          for (const m of [25, 50, 75, 90, 100]) {
            if (pct >= m && (this.maxScroll - pct) <= 2) {
              this.trackEvent("scroll_milestone", { value: String(m), scroll_depth: pct });
            }
          }
        }
        ticking = false;
      });
    }, { passive: true });
  }

  private initClickTracker() {
    document.addEventListener("click", (e) => {
      const el = e.target as HTMLElement;
      const closest = el.closest("[data-track]") as HTMLElement | null;
      const tag = closest?.dataset.track || this.inferTarget(el);
      if (!tag) return;

      if (!this.firstClickDone) {
        this.firstClickDone = true;
        this.trackEvent("first_click", { target: tag });
      }
      this.trackEvent("click", { target: tag });
    });
  }

  private inferTarget(el: HTMLElement): string | null {
    // 링크
    const a = el.closest("a") as HTMLAnchorElement | null;
    if (a) {
      const href = a.getAttribute("href") || "";
      if (href.includes("smartstore") || href.includes("naver")) return "store_link";
      if (href.includes("/shop")) return "nav_shop";
      if (href === "/" || href === "/#/") return "nav_home";
      return `link:${href.substring(0, 40)}`;
    }
    // 버튼
    const btn = el.closest("button");
    if (btn) {
      const text = (btn.textContent || "").trim().substring(0, 30);
      return `btn:${text}`;
    }
    return null;
  }

  private initVisibilityTracker() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.endPageView();
    });
    window.addEventListener("pagehide", () => {
      this.endPageView();
      post("/api/track/session/end", { id: this.sessionId, ended_at: Date.now() }, true);
    });
  }

  // ── Public API ─────────────────────────────────────────────────
  trackEvent(type: string, extra: Record<string, string | number | undefined> = {}) {
    post("/api/track/event", {
      session_id: this.sessionId,
      visitor_id: this.visitorId,
      event_type: type,
      page: this.currentPage,
      ts: Date.now(),
      ...extra,
    });
  }

  trackSearch(query: string, resultsCount = 0) {
    post("/api/track/search", {
      session_id: this.sessionId,
      visitor_id: this.visitorId,
      query,
      results_count: resultsCount,
      ts: Date.now(),
    });
    this.trackEvent("search", { value: query });
  }

  trackPageChange(newPage: string) {
    this.endPageView();
    this.prevPage = this.currentPage;
    this.currentPage = newPage;
    this.initPageView();

    // GA4 SPA 페이지빰 이벤트
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "page_view", {
        page_path: newPage,
        page_location: window.location.href,
      });
    }
    // Meta Pixel SPA 페이지빰
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "PageView");
    }
  }

  trackProductView(productName: string) {
    this.trackEvent("product_view", { target: productName });
    // GA4
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "view_item", { item_name: productName });
    }
    // Meta Pixel
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "ViewContent", { content_name: productName });
    }
  }

  trackIngredientClick(productName: string) {
    this.trackEvent("ingredient_click", { target: productName });
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "ingredient_click", { item_name: productName });
    }
  }

  trackStoreClick() {
    this.trackEvent("store_click", { target: "smartstore" });
    // GA4
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "purchase_intent", { destination: "smartstore" });
    }
    // Meta Pixel
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "InitiateCheckout");
    }
  }
}

// Singleton
let trackerInstance: Tracker | null = null;

export function getTracker(): Tracker {
  if (!trackerInstance) trackerInstance = new Tracker();
  return trackerInstance;
}

export function initTracker() {
  if (typeof window === "undefined") return;
  trackerInstance = new Tracker();
}
