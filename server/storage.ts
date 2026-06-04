import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq } from "drizzle-orm";
import { products, posts } from "@shared/schema";
import type { Product, InsertProduct, Post, InsertPost } from "@shared/schema";

const sqlite = new Database("data.db");
export const db = drizzle(sqlite, { schema: { products, posts } });

// ── Analytics Tables ──────────────────────────────────────────
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS analytics_sessions (
    id TEXT PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    started_at INTEGER NOT NULL,
    ended_at INTEGER,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    landing_page TEXT,
    device TEXT,
    user_agent TEXT,
    is_returning INTEGER DEFAULT 0,
    purchase_count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    visitor_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    page TEXT,
    target TEXT,
    value TEXT,
    scroll_depth INTEGER,
    time_on_page INTEGER,
    ts INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS analytics_searches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    visitor_id TEXT NOT NULL,
    query TEXT NOT NULL,
    results_count INTEGER DEFAULT 0,
    ts INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS analytics_page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    visitor_id TEXT NOT NULL,
    page TEXT NOT NULL,
    referrer_page TEXT,
    entered_at INTEGER NOT NULL,
    exited_at INTEGER,
    max_scroll INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0
  );
`);

// ── Analytics Storage API ─────────────────────────────────────
export const analyticsDb = {
  upsertSession(s: {
    id: string; visitor_id: string; started_at: number; referrer?: string;
    utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_content?: string;
    landing_page?: string; device?: string; user_agent?: string; is_returning?: number;
  }) {
    sqlite.prepare(`
      INSERT INTO analytics_sessions (id, visitor_id, started_at, referrer, utm_source, utm_medium, utm_campaign, utm_content, landing_page, device, user_agent, is_returning)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO NOTHING
    `).run(s.id, s.visitor_id, s.started_at, s.referrer||null, s.utm_source||null, s.utm_medium||null, s.utm_campaign||null, s.utm_content||null, s.landing_page||null, s.device||null, s.user_agent||null, s.is_returning||0);
  },

  endSession(id: string, ended_at: number) {
    sqlite.prepare(`UPDATE analytics_sessions SET ended_at=? WHERE id=?`).run(ended_at, id);
  },

  insertEvent(e: {
    session_id: string; visitor_id: string; event_type: string;
    page?: string; target?: string; value?: string;
    scroll_depth?: number; time_on_page?: number; ts: number;
  }) {
    sqlite.prepare(`
      INSERT INTO analytics_events (session_id, visitor_id, event_type, page, target, value, scroll_depth, time_on_page, ts)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(e.session_id, e.visitor_id, e.event_type, e.page||null, e.target||null, e.value||null, e.scroll_depth||null, e.time_on_page||null, e.ts);
  },

  insertSearch(s: { session_id: string; visitor_id: string; query: string; results_count?: number; ts: number }) {
    sqlite.prepare(`
      INSERT INTO analytics_searches (session_id, visitor_id, query, results_count, ts)
      VALUES (?, ?, ?, ?, ?)
    `).run(s.session_id, s.visitor_id, s.query, s.results_count||0, s.ts);
  },

  upsertPageView(pv: {
    session_id: string; visitor_id: string; page: string; referrer_page?: string;
    entered_at: number; exited_at?: number; max_scroll?: number; time_spent?: number;
  }) {
    sqlite.prepare(`
      INSERT INTO analytics_page_views (session_id, visitor_id, page, referrer_page, entered_at, exited_at, max_scroll, time_spent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(pv.session_id, pv.visitor_id, pv.page, pv.referrer_page||null, pv.entered_at, pv.exited_at||null, pv.max_scroll||0, pv.time_spent||0);
  },

  updatePageView(id: number, exited_at: number, max_scroll: number, time_spent: number) {
    sqlite.prepare(`UPDATE analytics_page_views SET exited_at=?, max_scroll=?, time_spent=? WHERE id=?`).run(exited_at, max_scroll, time_spent, id);
  },

  // ── Dashboard queries ──────────────────────────────────────
  getOverview(days = 30) {
    const since = Date.now() - days * 86400000;
    return {
      total_sessions: (sqlite.prepare(`SELECT COUNT(*) as c FROM analytics_sessions WHERE started_at >= ?`).get(since) as any).c,
      unique_visitors: (sqlite.prepare(`SELECT COUNT(DISTINCT visitor_id) as c FROM analytics_sessions WHERE started_at >= ?`).get(since) as any).c,
      returning_visitors: (sqlite.prepare(`SELECT COUNT(*) as c FROM analytics_sessions WHERE started_at >= ? AND is_returning=1`).get(since) as any).c,
      avg_session_duration: (sqlite.prepare(`SELECT AVG(ended_at - started_at) as v FROM analytics_sessions WHERE started_at >= ? AND ended_at IS NOT NULL`).get(since) as any).v || 0,
      total_page_views: (sqlite.prepare(`SELECT COUNT(*) as c FROM analytics_page_views WHERE entered_at >= ?`).get(since) as any).c,
    };
  },

  getReferrers(days = 30) {
    const since = Date.now() - days * 86400000;
    return sqlite.prepare(`
      SELECT referrer, utm_source, utm_medium, utm_campaign, utm_content, COUNT(*) as count
      FROM analytics_sessions WHERE started_at >= ?
      GROUP BY referrer, utm_source, utm_medium, utm_campaign, utm_content
      ORDER BY count DESC LIMIT 50
    `).all(since);
  },

  getFirstClicks(days = 30) {
    const since = Date.now() - days * 86400000;
    return sqlite.prepare(`
      SELECT target, COUNT(*) as count
      FROM analytics_events
      WHERE event_type='first_click' AND ts >= ?
      GROUP BY target ORDER BY count DESC LIMIT 30
    `).all(since);
  },

  getJourneys(days = 30) {
    const since = Date.now() - days * 86400000;
    return sqlite.prepare(`
      SELECT session_id, GROUP_CONCAT(page, ' → ') as path, COUNT(*) as steps
      FROM (
        SELECT session_id, page FROM analytics_page_views
        WHERE entered_at >= ? ORDER BY entered_at ASC
      )
      GROUP BY session_id ORDER BY steps DESC LIMIT 100
    `).all(since);
  },

  getScrollDepths(days = 30) {
    const since = Date.now() - days * 86400000;
    return sqlite.prepare(`
      SELECT page, AVG(max_scroll) as avg_scroll, MAX(max_scroll) as max_scroll_ever,
             COUNT(*) as views
      FROM analytics_page_views WHERE entered_at >= ?
      GROUP BY page ORDER BY avg_scroll DESC
    `).all(since);
  },

  getDwellTimes(days = 30) {
    const since = Date.now() - days * 86400000;
    return sqlite.prepare(`
      SELECT page, AVG(time_spent) as avg_time, MAX(time_spent) as max_time, COUNT(*) as views
      FROM analytics_page_views WHERE entered_at >= ? AND time_spent > 0
      GROUP BY page ORDER BY avg_time DESC
    `).all(since);
  },

  getExitPages(days = 30) {
    const since = Date.now() - days * 86400000;
    return sqlite.prepare(`
      SELECT page, COUNT(*) as exits
      FROM (
        SELECT session_id, page FROM analytics_page_views
        WHERE entered_at >= ?
        GROUP BY session_id HAVING entered_at = MAX(entered_at)
      ) GROUP BY page ORDER BY exits DESC
    `).all(since);
  },

  getSearches(days = 30) {
    const since = Date.now() - days * 86400000;
    return sqlite.prepare(`
      SELECT query, COUNT(*) as count FROM analytics_searches
      WHERE ts >= ? GROUP BY query ORDER BY count DESC LIMIT 50
    `).all(since);
  },

  getVisitorSegments(days = 30) {
    const since = Date.now() - days * 86400000;
    const now = Date.now();
    return {
      first_visit: (sqlite.prepare(`SELECT COUNT(DISTINCT visitor_id) as c FROM analytics_sessions WHERE started_at >= ? AND is_returning=0`).get(since) as any).c,
      returning: (sqlite.prepare(`SELECT COUNT(DISTINCT visitor_id) as c FROM analytics_sessions WHERE started_at >= ? AND is_returning=1`).get(since) as any).c,
      dormant: (sqlite.prepare(`
        SELECT COUNT(DISTINCT visitor_id) as c FROM analytics_sessions
        WHERE visitor_id IN (
          SELECT visitor_id FROM analytics_sessions GROUP BY visitor_id HAVING COUNT(*) > 1
        ) AND visitor_id NOT IN (
          SELECT visitor_id FROM analytics_sessions WHERE started_at >= ?
        )
      `).get(now - 30*86400000) as any).c,
    };
  },

  getFunnel(days = 30) {
    const since = Date.now() - days * 86400000;
    return {
      visited: (sqlite.prepare(`SELECT COUNT(DISTINCT session_id) as c FROM analytics_page_views WHERE entered_at >= ?`).get(since) as any).c,
      viewed_product: (sqlite.prepare(`SELECT COUNT(DISTINCT session_id) as c FROM analytics_events WHERE event_type='product_view' AND ts >= ?`).get(since) as any).c,
      clicked_ingredient: (sqlite.prepare(`SELECT COUNT(DISTINCT session_id) as c FROM analytics_events WHERE event_type='ingredient_click' AND ts >= ?`).get(since) as any).c,
      clicked_store: (sqlite.prepare(`SELECT COUNT(DISTINCT session_id) as c FROM analytics_events WHERE event_type='store_click' AND ts >= ?`).get(since) as any).c,
    };
  },

  getEventTimeline(days = 7) {
    const since = Date.now() - days * 86400000;
    return sqlite.prepare(`
      SELECT date(ts/1000, 'unixepoch', '+9 hours') as day, event_type, COUNT(*) as count
      FROM analytics_events WHERE ts >= ?
      GROUP BY day, event_type ORDER BY day ASC
    `).all(since);
  },

  getRecentSessions(limit = 20) {
    return sqlite.prepare(`
      SELECT s.*, 
        (SELECT GROUP_CONCAT(page, ' → ') FROM (
          SELECT page FROM analytics_page_views WHERE session_id=s.id ORDER BY entered_at ASC
        )) as path
      FROM analytics_sessions s ORDER BY started_at DESC LIMIT ?
    `).all(limit);
  },
};
// ─────────────────────────────────────────────────────────────

// Auto-migrate
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_ko TEXT NOT NULL,
    category TEXT NOT NULL,
    price INTEGER NOT NULL,
    description TEXT NOT NULL,
    description_ko TEXT NOT NULL,
    key_ingredient TEXT NOT NULL,
    image TEXT NOT NULL,
    volume TEXT NOT NULL,
    store_url TEXT
  )
`);
// 기존 테이블에 store_url 컬럼 없으면 추가
try { sqlite.exec(`ALTER TABLE products ADD COLUMN store_url TEXT`); } catch(_) {}

// Seed: store_url 없는 레코드가 있으면 전체 재시드
const storeUrlCheck = sqlite.prepare("SELECT COUNT(*) as count FROM products WHERE store_url IS NULL").get() as { count: number };
const existingCheck = sqlite.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
if (existingCheck.count === 0 || storeUrlCheck.count > 0) {
  sqlite.prepare("DELETE FROM products").run();
  const seedProducts: InsertProduct[] = [
    {
      name: "Microbiome Serum",
      nameKo: "마이크로바이옴 수분세럼",
      category: "serum",
      price: 45000,
      description: "A lightweight serum that hydrates deeply while protecting your skin's microbiome ecosystem.",
      descriptionKo: "피부 마이크로바이옴 생태계를 보호하며 깊은 수분을 공급하는 가벼운 세럼입니다.",
      keyIngredient: "프리바이오틱 + 발효 성분",
      image: "/assets/serum-box.jpg",
      volume: "40ml",
    },
    {
      name: "Microbiome Cream",
      nameKo: "마이크로바이옴 수분크림",
      category: "cream",
      price: 52000,
      description: "A nourishing cream that maintains skin balance and reinforces the natural moisture barrier.",
      descriptionKo: "피부 균형을 유지하고 자연 수분 장벽을 강화하는 영양 크림입니다.",
      keyIngredient: "프리바이오틱 + 발효 세라마이드",
      image: "/assets/cream-open.jpg",
      volume: "60g",
    },
    {
      name: "Hand Cream",
      nameKo: "마이크로바이옴 핸드크림",
      category: "body",
      price: 22000,
      description: "A lightweight hand cream that deeply moisturizes while maintaining the skin microbiome.",
      descriptionKo: "피부 마이크로바이옴을 유지하면서 깊은 보습을 제공하는 가벼운 핸드크림입니다.",
      keyIngredient: "프리바이오틱 + 식물성 버터",
      image: "/assets/handcream.jpg",
      volume: "30g",
    },
    {
      name: "Cleansing Oil",
      nameKo: "마이크로바이옴 클렌징오일",
      category: "cleansing",
      price: 38000,
      description: "A pure plant-based cleansing oil that gently removes makeup while protecting the skin microbiome.",
      descriptionKo: "피부 마이크로바이옴을 보호하며 메이크업을 깔끔하게 제거하는 식물성 클렌징오일입니다.",
      keyIngredient: "식물성 오일 블렌드",
      image: "/assets/cleansingoil-product.jpg",
      volume: "130ml",
    },
    {
      name: "Face Oil",
      nameKo: "마이크로바이옴 페이스오일",
      category: "oil",
      price: 55000,
      description: "A nourishing face oil with Jeju ROC-certified green tea seed oil that restores skin radiance.",
      descriptionKo: "제주 ROC 인증 녹차씨오일과 11종 프리미엄 식물성 오일이 담긴 페이스오일입니다.",
      keyIngredient: "녹차씨오일 + 식물성 스쿠알란",
      image: "/assets/faceoil-product.jpg",
      volume: "40ml",
    },
    {
      name: "Eye & Lip Contour Cream",
      nameKo: "마이크로바이옴 아이앤립컨투어크림",
      category: "eye",
      price: 48000,
      description: "A delicate contour cream formulated with peptides for the sensitive eye and lip area.",
      descriptionKo: "콜라겐 펩타이드로 눈가·입가를 탄탄하게 케어하는 컨투어 크림입니다.",
      keyIngredient: "트라이펩타이드-29 + 아르기렐린",
      image: "/assets/eyelip-product.jpg",
      volume: "20g",
    },
    {
      name: "Foot Cream",
      nameKo: "마이크로바이옴 풋크림",
      category: "body",
      price: 22000,
      description: "An intensive foot cream with rosemary essential oil for deep moisture and aromatherapy.",
      descriptionKo: "로즈마리 에센셜오일로 깊은 보습과 아로마테라피를 동시에 즐기는 풋크림입니다.",
      keyIngredient: "로즈마리 에센셜오일 + 시어버터",
      image: "/assets/footcream-product.jpg",
      volume: "70g",
    },
  ];

  const STORE_URLS: Record<string, string> = {
    "마이크로바이옴 수분세럼": "https://smartstore.naver.com/seasonglass/products/12155116667",
    "마이크로바이옴 수분크림": "https://smartstore.naver.com/seasonglass/products/12154586932",
    "마이크로바이옴 핸드크림": "https://smartstore.naver.com/seasonglass/products/12569339458",
    "마이크로바이옴 클렌징오일": "https://smartstore.naver.com/seasonglass/products/12154869450",
    "마이크로바이옴 페이스오일": "https://smartstore.naver.com/seasonglass/products/12477826981",
    "마이크로바이옴 아이앤립컨투어크림": "https://smartstore.naver.com/seasonglass/products/12544056248",
    "마이크로바이옴 풋크림": "https://smartstore.naver.com/seasonglass/products/12569372697",
  };

  const insert = sqlite.prepare(`
    INSERT INTO products (name, name_ko, category, price, description, description_ko, key_ingredient, image, volume, store_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const p of seedProducts) {
    insert.run(p.name, p.nameKo, p.category, p.price, p.description, p.descriptionKo, p.keyIngredient, p.image, p.volume, STORE_URLS[p.nameKo] || null);
  }
}

export interface IStorage {
  getProducts(): Product[];
  getProduct(id: number): Product | undefined;
}

export class Storage implements IStorage {
  getProducts(): Product[] {
    const rows = sqlite.prepare("SELECT * FROM products").all() as any[];
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      nameKo: r.name_ko,
      category: r.category,
      price: r.price,
      description: r.description,
      descriptionKo: r.description_ko,
      keyIngredient: r.key_ingredient,
      image: r.image,
      volume: r.volume,
      storeUrl: r.store_url,
    }));
  }
  getProduct(id: number): Product | undefined {
    const r = sqlite.prepare("SELECT * FROM products WHERE id = ?").get(id) as any;
    if (!r) return undefined;
    return {
      id: r.id,
      name: r.name,
      nameKo: r.name_ko,
      category: r.category,
      price: r.price,
      description: r.description,
      descriptionKo: r.description_ko,
      keyIngredient: r.key_ingredient,
      image: r.image,
      volume: r.volume,
      storeUrl: r.store_url,
    };
  }
}

export const storage = new Storage();

// ── Posts Storage ──────────────────────────────────────────────
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

export const postsStorage = {
  getPosts(type: "event" | "archive") {
    const rows = sqlite.prepare("SELECT * FROM posts WHERE type = ? ORDER BY created_at DESC").all(type) as any[];
    return rows.map(r => ({ ...r, createdAt: r.created_at }));
  },
  getPost(id: number) {
    const r = sqlite.prepare("SELECT * FROM posts WHERE id = ?").get(id) as any;
    if (!r) return r;
    return { ...r, createdAt: r.created_at };
  },
  createPost(data: { type: "event" | "archive"; title: string; content: string }) {
    const stmt = sqlite.prepare("INSERT INTO posts (type, title, content, created_at) VALUES (?, ?, ?, ?) RETURNING *");
    const r = stmt.get(data.type, data.title, data.content, Date.now()) as any;
    if (!r) return r;
    return { ...r, createdAt: r.created_at };
  },
  updatePost(id: number, data: { title: string; content: string }) {
    const stmt = sqlite.prepare("UPDATE posts SET title = ?, content = ? WHERE id = ? RETURNING *");
    const r = stmt.get(data.title, data.content, id) as any;
    if (!r) return r;
    return { ...r, createdAt: r.created_at };
  },
  deletePost(id: number) {
    sqlite.prepare("DELETE FROM posts WHERE id = ?").run(id);
  },
};

// ── Visitors (IP → 닉네임) + Comments ─────────────────────────
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS visitors (
    ip TEXT PRIMARY KEY,
    nickname TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    ip TEXT NOT NULL,
    nickname TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

export const visitorStorage = {
  // IP로 닉네임 조회
  getNickname(ip: string): string | null {
    const row = sqlite.prepare("SELECT nickname FROM visitors WHERE ip = ?").get(ip) as any;
    return row ? row.nickname : null;
  },
  // 닉네임 중복 체크
  nicknameExists(nickname: string): boolean {
    const row = sqlite.prepare("SELECT ip FROM visitors WHERE nickname = ?").get(nickname) as any;
    return !!row;
  },
  // 닉네임 등록 (IP 1개당 1개, 닉네임 유니크)
  register(ip: string, nickname: string): { ok: boolean; error?: string } {
    const existing = sqlite.prepare("SELECT nickname FROM visitors WHERE ip = ?").get(ip) as any;
    if (existing) return { ok: false, error: "already_registered" };
    const taken = sqlite.prepare("SELECT ip FROM visitors WHERE nickname = ?").get(nickname) as any;
    if (taken) return { ok: false, error: "nickname_taken" };
    sqlite.prepare("INSERT INTO visitors (ip, nickname, created_at) VALUES (?, ?, ?)").run(ip, nickname, Date.now());
    return { ok: true };
  },
};

export const commentStorage = {
  getComments(postId: number) {
    return sqlite.prepare("SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC").all(postId) as any[];
  },
  addComment(data: { postId: number; ip: string; nickname: string; content: string }) {
    const stmt = sqlite.prepare("INSERT INTO comments (post_id, ip, nickname, content, created_at) VALUES (?, ?, ?, ?, ?) RETURNING *");
    return stmt.get(data.postId, data.ip, data.nickname, data.content, Date.now()) as any;
  },
  deleteComment(id: number, ip: string): boolean {
    // 본인(ip) 또는 관리자(admin 플래그로 처리)만 삭제 가능
    const row = sqlite.prepare("SELECT ip FROM comments WHERE id = ?").get(id) as any;
    if (!row) return false;
    if (row.ip !== ip) return false;
    sqlite.prepare("DELETE FROM comments WHERE id = ?").run(id);
    return true;
  },
  adminDeleteComment(id: number): void {
    sqlite.prepare("DELETE FROM comments WHERE id = ?").run(id);
  },
};

// ── Image Storage (base64 in SQLite) ──────────────────────────
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS images (
    id TEXT PRIMARY KEY,
    data_url TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

export const imageDb = {
  save(id: string, dataUrl: string): void {
    sqlite.prepare("INSERT OR REPLACE INTO images (id, data_url, created_at) VALUES (?, ?, ?)").run(id, dataUrl, Date.now());
  },
  get(id: string): string | null {
    const row = sqlite.prepare("SELECT data_url FROM images WHERE id = ?").get(id) as any;
    return row ? row.data_url : null;
  },
};
