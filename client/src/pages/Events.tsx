import { useState, useEffect, useContext, useRef } from "react";
import { LangContext } from "@/lib/langContext";
import CommentSection from "@/components/CommentSection";

function apiBase() {
  if (typeof window !== "undefined" && window.location.hostname.endsWith(".pplx.app")) {
    return "/port/5000";
  }
  return "";
}

interface Post {
  id: number;
  type: string;
  title: string;
  content: string;
  createdAt: number;
}

const POST_PASSWORD = "3535";

const EMOJI_LIST = [
  "😊","😍","🎉","✨","💕","🌸","🌿","💧","🔥","⭐",
  "💎","🌙","☀️","🍀","🦋","💐","🎀","👑","💫","🌈",
  "❤️","🧡","💛","💚","💙","💜","🖤","🤍","💗","💖",
  "👏","🙌","💪","🫶","🤗","😘","🥰","😎","🤩","🥳",
  "📸","📦","🛒","💄","🧴","✅","📌","💬","📣","🎁",
];

function formatDate(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`;
}

// [img:URL] 마크업을 파싱해 첫 번째 이미지 URL 반환 (썸네일용)
function extractFirstImage(content: string): string | null {
  const m = content.match(/\[img:([^\]]+)\]/);
  if (!m) return null;
  const url = m[1];
  return url.startsWith("/") ? `${apiBase()}${url}` : url;
}

// 텍스트 미리보기: [img:...] 태그 제거 후 앞 100자
function extractPreviewText(content: string): string {
  return content.replace(/\[img:[^\]]+\]/g, "").trim().slice(0, 120);
}

// 본문 렌더링: [img:URL] → <img> + 텍스트
function renderContent(content: string) {
  const parts = content.split(/(\[img:[^\]]+\])/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[img:(.+)\]$/);
    if (m) {
      const src = m[1].startsWith("/") ? `${apiBase()}${m[1]}` : m[1];
      return (
        <div key={i} style={{ margin: "1rem 0" }}>
          <img
            src={src}
            alt="첨부 이미지"
            style={{ maxWidth: "100%", maxHeight: "520px", objectFit: "contain", display: "block", borderRadius: "2px" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      );
    }
    return <span key={i} style={{ whiteSpace: "pre-wrap" }}>{part}</span>;
  });
}

// 게시글 수정/삭제 — 비밀번호 인증
function PostAdminButtons({ post, KR, onEdit, onDelete }: { post: Post; KR: boolean; onEdit: (p: Post) => void; onDelete: (id: number) => void }) {
  const [showPw, setShowPw] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [action, setAction] = useState<"edit"|"delete"|null>(null);

  function tryAction(act: "edit"|"delete") { setAction(act); setShowPw(true); setPw(""); setPwErr(false); }
  function confirm() {
    if (pw !== POST_PASSWORD) { setPwErr(true); return; }
    setShowPw(false);
    if (action === "edit") onEdit(post);
    if (action === "delete") onDelete(post.id);
  }
  return (
    <div style={{ marginTop: "1rem" }}>
      {!showPw ? (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => tryAction("edit")} style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", background: "transparent", border: "1px solid var(--color-border)", color: "var(--color-text-muted)", padding: "6px 16px", cursor: "pointer" }}>{KR ? "수정" : "Edit"}</button>
          <button onClick={() => tryAction("delete")} style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", background: "transparent", border: "1px solid var(--color-accent-red)", color: "var(--color-accent-red)", padding: "6px 16px", cursor: "pointer" }}>{KR ? "삭제" : "Delete"}</button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <input autoFocus type="password" value={pw}
            onChange={e => { setPw(e.target.value); setPwErr(false); }}
            onKeyDown={e => { if (e.key === "Enter") confirm(); if (e.key === "Escape") setShowPw(false); }}
            placeholder={KR ? "관리자 비밀번호" : "Admin password"}
            style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", border: `1px solid ${pwErr ? "var(--color-accent-red)" : "var(--color-border)"}`, padding: "6px 12px", width: "140px", outline: "none", background: "var(--color-bg)", color: "var(--color-text)" }}
          />
          <button onClick={confirm} style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", background: "#1a2530", color: "#f4f5eb", border: "none", padding: "6px 14px", cursor: "pointer" }}>{KR ? "확인" : "OK"}</button>
          <button onClick={() => setShowPw(false)} style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", background: "transparent", border: "1px solid var(--color-border)", color: "var(--color-text-muted)", padding: "6px 12px", cursor: "pointer" }}>{KR ? "취소" : "Cancel"}</button>
          {pwErr && <span style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "var(--color-accent-red)" }}>{KR ? "비밀번호 오류" : "Wrong password"}</span>}
        </div>
      )}
    </div>
  );
}

export default function Events() {
  const { lang } = useContext(LangContext);
  const KR = lang === "KR";

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [writeMode, setWriteMode] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [pwUnlocked, setPwUnlocked] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase()}/api/posts?type=event`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch { setPosts([]); } finally { setLoading(false); }
  };
  useEffect(() => { fetchPosts(); }, []);

  function handlePwCheck() {
    if (pwInput === POST_PASSWORD) { setPwUnlocked(true); setPwError(false); }
    else setPwError(true);
  }

  function insertAtCursor(text: string) {
    const ta = textareaRef.current;
    if (!ta) { setFormContent(prev => prev + text); return; }
    const start = ta.selectionStart ?? formContent.length;
    const end = ta.selectionEnd ?? formContent.length;
    const newContent = formContent.slice(0, start) + text + formContent.slice(end);
    setFormContent(newContent);
    setTimeout(() => { ta.focus(); ta.selectionStart = start + text.length; ta.selectionEnd = start + text.length; }, 0);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크: 압축 전 최대 10MB
    const MAX_FILE_MB = 10;
    const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;
    if (file.size > MAX_FILE_BYTES) {
      alert(KR ? `최대 ${MAX_FILE_MB}MB까지만 업로드 가능합니다.` : `Max ${MAX_FILE_MB}MB allowed.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      // Canvas 리사이즈 + JPEG 압축 (최대 1200px, quality 0.80)
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("FileReader 오류"));
        reader.onload = () => {
          const result = reader.result as string;
          const img = new Image();
          img.onerror = () => reject(new Error("이미지 로드 오류"));
          img.onload = () => {
            try {
              const MAX = 1200;
              let w = img.width || 100;
              let h = img.height || 100;
              if (w > MAX || h > MAX) {
                if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
                else { w = Math.round(w * MAX / h); h = MAX; }
              }
              const canvas = document.createElement("canvas");
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext("2d");
              if (!ctx) { reject(new Error("Canvas 오류")); return; }
              ctx.drawImage(img, 0, 0, w, h);
              const compressed = canvas.toDataURL("image/jpeg", 0.80);
              resolve(compressed);
            } catch (canvasErr) {
              // Canvas 실패 시 원본 그대로 사용
              resolve(result);
            }
          };
          img.src = result;
        };
        reader.readAsDataURL(file);
      });

      const res = await fetch(`${apiBase()}/api/upload-base64`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl, filename: file.name }),
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${errText}`);
      }
      const data = await res.json();
      if (data.url) {
        insertAtCursor(`[img:${data.url}]`);
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (err: any) {
      console.error("upload error:", err);
      alert(KR ? `이미지 업로드에 실패했습니다. (${err?.message || ""})` : `Image upload failed. (${err?.message || ""})`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit() {
    if (!formTitle.trim() || !formContent.trim()) return;
    setSubmitting(true);
    try {
      const url = editingId ? `${apiBase()}/api/posts/${editingId}` : `${apiBase()}/api/posts`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "event", title: formTitle, content: formContent, password: POST_PASSWORD }) });
      if (res.ok) { setFormTitle(""); setFormContent(""); setEditingId(null); setWriteMode(false); fetchPosts(); }
    } finally { setSubmitting(false); }
  }

  async function handleDelete(id: number) {
    if (!window.confirm(KR ? "정말 삭제하시겠습니까?" : "Delete this post?")) return;
    await fetch(`${apiBase()}/api/posts/${id}`, { method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: POST_PASSWORD }) });
    fetchPosts();
    if (selectedPost?.id === id) setSelectedPost(null);
  }

  function startEdit(post: Post) { setFormTitle(post.title); setFormContent(post.content); setEditingId(post.id); setWriteMode(true); setSelectedPost(null); }

  const inputStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
    border: "1px solid var(--color-border)", background: "var(--color-bg)",
    color: "var(--color-text)", padding: "10px 14px", width: "100%",
    outline: "none", letterSpacing: "0.02em", boxSizing: "border-box",
  };

  return (
    <div style={{ paddingTop: "5rem", minHeight: "80vh" }}>
      {/* 페이지 헤더 */}
      <section style={{ background: "var(--color-sky)", padding: "var(--space-16) 0 var(--space-12)" }}>
        <div style={{ maxWidth: "var(--content-wide)", margin: "0 auto", padding: "0 2.5rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(26,37,48,0.5)", marginBottom: "var(--space-3)", fontWeight: 500 }}>BIFI BLANCHE</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", color: "#1a2530", fontWeight: 600, lineHeight: 1.1 }}>
            {KR ? "이벤트" : "Events"}
          </h1>
        </div>
      </section>

      <section style={{ background: "var(--color-bg)", padding: "var(--space-12) 0 var(--space-24)" }}>
        <div style={{ maxWidth: "var(--content-wide)", margin: "0 auto", padding: "0 2.5rem" }}>

          {/* 작성 버튼 */}
          {!writeMode && (
            <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setWriteMode(true)}
                style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.1em", textTransform: "uppercase", background: "#1a2530", color: "#f4f5eb", border: "none", padding: "10px 24px", cursor: "pointer", fontWeight: 500 }}>
                {KR ? "+ 게시글 작성" : "+ Write Post"}
              </button>
            </div>
          )}

          {/* 작성/수정 폼 */}
          {writeMode && (
            <div style={{ background: "var(--color-surface, #f9f9f6)", border: "1px solid var(--color-border)", padding: "2rem", marginBottom: "2.5rem" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1.5rem", fontWeight: 500 }}>
                {editingId ? (KR ? "게시글 수정" : "Edit Post") : (KR ? "새 게시글 작성" : "New Post")}
              </p>
              {!pwUnlocked ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "320px" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>{KR ? "작성 비밀번호를 입력하세요" : "Enter write password"}</p>
                  <input type="password" value={pwInput} onChange={e => { setPwInput(e.target.value); setPwError(false); }}
                    onKeyDown={e => { if (e.key === "Enter") handlePwCheck(); }} placeholder="비밀번호" style={inputStyle} />
                  {pwError && <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--color-accent-red)" }}>{KR ? "비밀번호가 틀렸습니다" : "Wrong password"}</p>}
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button onClick={handlePwCheck} style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", background: "#1a2530", color: "#f4f5eb", border: "none", padding: "10px 24px", cursor: "pointer" }}>{KR ? "확인" : "Confirm"}</button>
                    <button onClick={() => { setWriteMode(false); setPwInput(""); setPwError(false); setEditingId(null); }} style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", background: "transparent", color: "var(--color-text-muted)", border: "1px solid var(--color-border)", padding: "10px 24px", cursor: "pointer" }}>{KR ? "취소" : "Cancel"}</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <input type="text" value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder={KR ? "제목" : "Title"} style={inputStyle} />
                  {/* 툴바 */}
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ position: "relative" }}>
                      <button type="button" onClick={() => setShowEmoji(v => !v)}
                        style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", background: "var(--color-surface,#f9f9f6)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)", padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                        😊 {KR ? "이모티콘" : "Emoji"}
                      </button>
                      {showEmoji && (
                        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 50, background: "var(--color-bg)", border: "1px solid var(--color-border)", padding: "12px", width: "280px", display: "flex", flexWrap: "wrap", gap: "4px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
                          {EMOJI_LIST.map(emoji => (
                            <button key={emoji} type="button" onClick={() => { insertAtCursor(emoji); setShowEmoji(false); }}
                              style={{ fontSize: "1.3rem", background: "none", border: "none", cursor: "pointer", padding: "4px 6px", borderRadius: "4px", lineHeight: 1 }}
                              onMouseEnter={e => (e.currentTarget.style.background = "var(--color-surface-sky,#eaf2f9)")}
                              onMouseLeave={e => (e.currentTarget.style.background = "none")}>{emoji}</button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                      style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", background: "var(--color-surface,#f9f9f6)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)", padding: "6px 12px", cursor: uploading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "4px", opacity: uploading ? 0.6 : 1 }}>
                      📷 {uploading ? (KR ? "업로드 중..." : "Uploading...") : (KR ? "이미지" : "Image")}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "var(--color-text-muted)" }}>{KR ? "최대 10MB · 커서 위치에 삽입" : "Max 10MB · Inserts at cursor"}</span>
                  </div>
                  <textarea ref={textareaRef} value={formContent} onChange={e => setFormContent(e.target.value)}
                    placeholder={KR ? "내용을 입력하세요..." : "Enter content..."} rows={12}
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.75 }} onClick={() => setShowEmoji(false)} />
                  {/* 미리보기 */}
                  {formContent && (
                    <div style={{ border: "1px dashed var(--color-border)", padding: "1rem 1.25rem", background: "var(--color-bg)" }}>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.75rem", fontWeight: 500 }}>{KR ? "미리보기" : "Preview"}</p>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-text)", lineHeight: 1.9 }}>
                        {renderContent(formContent)}
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                    <button onClick={() => { setWriteMode(false); setPwInput(""); setPwUnlocked(false); setFormTitle(""); setFormContent(""); setEditingId(null); setShowEmoji(false); }}
                      style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", background: "transparent", color: "var(--color-text-muted)", border: "1px solid var(--color-border)", padding: "10px 24px", cursor: "pointer" }}>{KR ? "취소" : "Cancel"}</button>
                    <button onClick={handleSubmit} disabled={submitting || !formTitle.trim() || !formContent.trim()}
                      style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", background: "var(--color-accent-red)", color: "#fff", border: "none", padding: "10px 28px", cursor: "pointer", opacity: submitting ? 0.6 : 1 }}>
                      {submitting ? (KR ? "저장 중..." : "Saving...") : (editingId ? (KR ? "수정 완료" : "Save") : (KR ? "게시하기" : "Publish"))}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 게시글 목록 — 카드형 (썸네일 좌 + 제목/미리보기 우) */}
          {loading ? (
            <div style={{ padding: "4rem 0", textAlign: "center", color: "var(--color-text-muted)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}>{KR ? "불러오는 중..." : "Loading..."}</div>
          ) : posts.length === 0 ? (
            <div style={{ padding: "6rem 0", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "var(--color-text-muted)" }}>{KR ? "등록된 이벤트가 없습니다" : "No events yet"}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 0, borderTop: "1px solid var(--color-border)" }}>
              {posts.map(post => {
                const thumb = extractFirstImage(post.content);
                const preview = extractPreviewText(post.content);
                const isOpen = selectedPost?.id === post.id;
                return (
                  <div key={post.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    {/* 카드 헤더: 썸네일 + 제목/미리보기 */}
                    <div
                      onClick={() => setSelectedPost(isOpen ? null : post)}
                      style={{ display: "flex", gap: "1.25rem", padding: "1.5rem 0", cursor: "pointer", alignItems: "flex-start",
                        transition: "background 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--color-surface,#f9f9f6)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* 썸네일 */}
                      {thumb && (
                        <div style={{ flexShrink: 0, width: "clamp(80px, 20vw, 140px)", aspectRatio: "4/3", overflow: "hidden", background: "var(--color-surface,#f0f0ea)" }}>
                          <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = "none"; }} />
                        </div>
                      )}
                      {/* 텍스트 */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", letterSpacing: "0.06em", marginBottom: "0.35rem" }}>{formatDate(post.createdAt)}</p>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600, color: "var(--color-text)", lineHeight: 1.35, margin: "0 0 0.5rem" }}>{post.title}</h3>
                        {preview && (
                          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--color-text-muted)", lineHeight: 1.65, margin: 0,
                            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>
                            {preview}{preview.length === 120 ? "..." : ""}
                          </p>
                        )}
                      </div>
                      {/* 열기/닫기 */}
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "var(--color-text-muted)", flexShrink: 0, paddingTop: "1.5rem" }}>{isOpen ? "▲" : "▼"}</span>
                    </div>

                    {/* 펼쳐진 본문 */}
                    {isOpen && (
                      <div style={{ padding: "0 0 1.5rem", borderTop: "1px solid var(--color-border)", paddingTop: "1.25rem" }}>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-text)", lineHeight: 1.9 }}>
                          {renderContent(post.content)}
                        </div>
                        <PostAdminButtons post={post} KR={KR} onEdit={startEdit} onDelete={handleDelete} />
                        <CommentSection postId={post.id} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
