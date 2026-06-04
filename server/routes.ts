import type { Express } from "express";
import type { Server } from "http";
import { storage, analyticsDb, postsStorage, visitorStorage, commentStorage, imageDb } from "./storage";
import path from "path";
import express from "express";

// ── Admin secret URL token ─────────────────────────────────────
// URL: /#/admin-bifi2024xK9mPqR
const ADMIN_TOKEN = "bifi2024xK9mPqR";

export async function registerRoutes(httpServer: Server, app: Express): Promise<void> {
  // Serve uploaded assets
  app.use("/assets", express.static(path.join(process.cwd(), "client/src/assets")));

  // ── 이미지 업로드 API (base64 → DB 저장) ─────────────────────
  app.post("/api/upload", express.raw({ type: "multipart/form-data", limit: "10mb" }), (req, res) => {
    // multer 없이 직접 multipart 파싱
    res.status(400).json({ error: "Use /api/upload-base64" });
  });

  // base64 업로드: 클라이언트가 FileReader로 base64 변환 후 전송
  app.post("/api/upload-base64", (req, res) => {
    const { dataUrl, filename } = req.body;
    if (!dataUrl || !dataUrl.startsWith("data:image/")) {
      return res.status(400).json({ error: "Invalid image data" });
    }
    // data:image/jpeg;base64,XXXX → DB에 그대로 저장
    const id = `img_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    // images 테이블에 저장
    (req.app as any)._imageDb = (req.app as any)._imageDb || new Map();
    (req.app as any)._imageDb.set(id, dataUrl);
    // SQLite에도 저장
    imageDb.save(id, dataUrl);
    res.json({ url: `/api/images/${id}` });
  });

  // 이미지 조회
  app.get("/api/images/:id", (req, res) => {
    const dataUrl = imageDb.get(req.params.id);
    if (!dataUrl) return res.status(404).send("Not found");
    const matches = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!matches) return res.status(400).send("Bad data");
    const mime = matches[1];
    const buf = Buffer.from(matches[2], "base64");
    res.setHeader("Content-Type", mime);
    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.send(buf);
  });

  // Products
  app.get("/api/products", (_req, res) => {
    const products = storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const product = storage.getProduct(id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  });

  // ── Analytics Track API ────────────────────────────────────

  // Session start
  app.post("/api/track/session", (req, res) => {
    try {
      analyticsDb.upsertSession(req.body);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: String(e) }); }
  });

  // Session end
  app.post("/api/track/session/end", (req, res) => {
    try {
      analyticsDb.endSession(req.body.id, req.body.ended_at);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: String(e) }); }
  });

  // Generic event
  app.post("/api/track/event", (req, res) => {
    try {
      analyticsDb.insertEvent(req.body);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: String(e) }); }
  });

  // Search
  app.post("/api/track/search", (req, res) => {
    try {
      analyticsDb.insertSearch(req.body);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: String(e) }); }
  });

  // Page view start
  app.post("/api/track/pageview", (req, res) => {
    try {
      analyticsDb.upsertPageView(req.body);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: String(e) }); }
  });

  // Page view end (update scroll + dwell)
  app.post("/api/track/pageview/end", (req, res) => {
    try {
      const { id, exited_at, max_scroll, time_spent } = req.body;
      analyticsDb.updatePageView(id, exited_at, max_scroll, time_spent);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: String(e) }); }
  });

  // ── Admin Dashboard API (token-gated) ───────────────────────
  function adminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = req.headers["x-admin-token"] || req.query.token;
    if (token !== ADMIN_TOKEN) return res.status(403).json({ error: "Forbidden" });
    next();
  }

  app.get("/api/admin/overview",       adminAuth, (req, res) => res.json(analyticsDb.getOverview(Number(req.query.days)||30)));
  app.get("/api/admin/referrers",      adminAuth, (req, res) => res.json(analyticsDb.getReferrers(Number(req.query.days)||30)));
  app.get("/api/admin/first-clicks",   adminAuth, (req, res) => res.json(analyticsDb.getFirstClicks(Number(req.query.days)||30)));
  app.get("/api/admin/journeys",       adminAuth, (req, res) => res.json(analyticsDb.getJourneys(Number(req.query.days)||30)));
  app.get("/api/admin/scroll-depths",  adminAuth, (req, res) => res.json(analyticsDb.getScrollDepths(Number(req.query.days)||30)));
  app.get("/api/admin/dwell-times",    adminAuth, (req, res) => res.json(analyticsDb.getDwellTimes(Number(req.query.days)||30)));
  app.get("/api/admin/exit-pages",     adminAuth, (req, res) => res.json(analyticsDb.getExitPages(Number(req.query.days)||30)));
  app.get("/api/admin/searches",       adminAuth, (req, res) => res.json(analyticsDb.getSearches(Number(req.query.days)||30)));
  app.get("/api/admin/segments",       adminAuth, (req, res) => res.json(analyticsDb.getVisitorSegments(Number(req.query.days)||30)));
  app.get("/api/admin/funnel",         adminAuth, (req, res) => res.json(analyticsDb.getFunnel(Number(req.query.days)||30)));
  app.get("/api/admin/timeline",       adminAuth, (req, res) => res.json(analyticsDb.getEventTimeline(Number(req.query.days)||7)));
  app.get("/api/admin/sessions",       adminAuth, (req, res) => res.json(analyticsDb.getRecentSessions(Number(req.query.limit)||20)));

  // ── Posts API (이벤트 / 아카이브) ────────────────────────────
  const POST_PASSWORD = "3535";

  // 게시글 목록 조회
  app.get("/api/posts", (req, res) => {
    const type = req.query.type as string;
    if (type !== "event" && type !== "archive") {
      return res.status(400).json({ error: "type must be event or archive" });
    }
    res.json(postsStorage.getPosts(type));
  });

  // 게시글 작성 (비밀번호 필요)
  app.post("/api/posts", (req, res) => {
    const { type, title, content, password } = req.body;
    if (password !== POST_PASSWORD) return res.status(403).json({ error: "Wrong password" });
    if (type !== "event" && type !== "archive") return res.status(400).json({ error: "Invalid type" });
    if (!title || !content) return res.status(400).json({ error: "title and content required" });
    const post = postsStorage.createPost({ type, title, content });
    res.json(post);
  });

  // 게시글 수정 (비밀번호 필요)
  app.put("/api/posts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content, password } = req.body;
    if (password !== POST_PASSWORD) return res.status(403).json({ error: "Wrong password" });
    if (!title || !content) return res.status(400).json({ error: "title and content required" });
    const post = postsStorage.updatePost(id, { title, content });
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json(post);
  });

  // 게시글 삭제 (비밀번호 필요)
  app.delete("/api/posts/:id", (req, res) => {
    const { password } = req.body;
    if (password !== POST_PASSWORD) return res.status(403).json({ error: "Wrong password" });
    const id = parseInt(req.params.id);
    postsStorage.deletePost(id);
    res.json({ ok: true });
  });

  // ── Visitor (닉네임) API ──────────────────────────────────────
  function getClientIp(req: express.Request): string {
    const forwarded = req.headers["x-forwarded-for"];
    if (forwarded) {
      const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0];
      return ip.trim();
    }
    return req.socket.remoteAddress || "unknown";
  }

  // 내 닉네임 조회 (IP 기반)
  app.get("/api/visitor/me", (req, res) => {
    const ip = getClientIp(req);
    const nickname = visitorStorage.getNickname(ip);
    res.json({ nickname, ip_hash: ip.replace(/\./g, "*").slice(0, -3) + "***" });
  });

  // 닉네임 등록
  app.post("/api/visitor/register", (req, res) => {
    const ip = getClientIp(req);
    const { nickname } = req.body;
    if (!nickname || nickname.trim().length < 2 || nickname.trim().length > 20) {
      return res.status(400).json({ error: "닉네임은 2~20자로 입력해주세요" });
    }
    const clean = nickname.trim().replace(/[<>&"]/g, "");
    const result = visitorStorage.register(ip, clean);
    if (!result.ok) {
      if (result.error === "already_registered") return res.status(409).json({ error: "이미 닉네임이 등록되어 있습니다" });
      if (result.error === "nickname_taken") return res.status(409).json({ error: "이미 사용 중인 닉네임입니다" });
    }
    res.json({ ok: true, nickname: clean });
  });

  // 닉네임 중복 체크
  app.get("/api/visitor/check", (req, res) => {
    const nickname = String(req.query.nickname || "").trim();
    res.json({ available: !visitorStorage.nicknameExists(nickname) });
  });

  // ── Comments API ──────────────────────────────────────────────
  // 댓글 목록
  app.get("/api/posts/:id/comments", (req, res) => {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ error: "Invalid id" });
    res.json(commentStorage.getComments(postId));
  });

  // 댓글 작성
  app.post("/api/posts/:id/comments", (req, res) => {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ error: "Invalid id" });
    const ip = getClientIp(req);
    const { content } = req.body;
    if (!content || content.trim().length === 0) return res.status(400).json({ error: "내용을 입력해주세요" });
    if (content.trim().length > 500) return res.status(400).json({ error: "500자 이내로 입력해주세요" });
    // 닉네임 미등록 시 거절
    const nickname = visitorStorage.getNickname(ip);
    if (!nickname) return res.status(403).json({ error: "먼저 닉네임을 등록해주세요" });
    const comment = commentStorage.addComment({ postId, ip, nickname, content: content.trim() });
    res.json(comment);
  });

  // 댓글 삭제 (본인 또는 관리자 비밀번호)
  app.delete("/api/posts/:postId/comments/:id", (req, res) => {
    const ip = getClientIp(req);
    const id = parseInt(req.params.id);
    const { password } = req.body;
    // 관리자 비밀번호로 삭제
    if (password === POST_PASSWORD) {
      commentStorage.adminDeleteComment(id);
      return res.json({ ok: true });
    }
    // 본인 삭제
    const ok = commentStorage.deleteComment(id, ip);
    if (!ok) return res.status(403).json({ error: "삭제 권한이 없습니다" });
    res.json({ ok: true });
  });
}
