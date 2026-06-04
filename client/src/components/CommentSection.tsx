import { useState, useEffect, useContext } from "react";
import { LangContext } from "@/lib/langContext";
import { useNickname } from "@/lib/useNickname";

function apiBase() {
  if (typeof window !== "undefined" && window.location.hostname.endsWith(".pplx.app")) {
    return "/port/5000";
  }
  return "";
}

interface Comment {
  id: number;
  post_id: number;
  ip: string;
  nickname: string;
  content: string;
  created_at: number;
}

function formatDate(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const POST_PASSWORD = "3535";

interface Props {
  postId: number;
}

export default function CommentSection({ postId }: Props) {
  const { lang } = useContext(LangContext);
  const KR = lang === "KR";
  const { nickname, loading: nickLoading, register } = useNickname();

  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 닉네임 등록 폼
  const [showRegister, setShowRegister] = useState(false);
  const [regInput, setRegInput] = useState("");
  const [regChecking, setRegChecking] = useState(false);
  const [regAvailable, setRegAvailable] = useState<boolean | null>(null);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSubmitting, setRegSubmitting] = useState(false);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await fetch(`${apiBase()}/api/posts/${postId}/comments`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch {
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => { fetchComments(); }, [postId]);

  // 닉네임 중복 체크 (디바운스)
  useEffect(() => {
    if (regInput.trim().length < 2) { setRegAvailable(null); return; }
    setRegChecking(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`${apiBase()}/api/visitor/check?nickname=${encodeURIComponent(regInput.trim())}`);
        const data = await res.json();
        setRegAvailable(data.available);
      } finally {
        setRegChecking(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [regInput]);

  async function handleRegister() {
    if (!regInput.trim() || regAvailable === false) return;
    setRegSubmitting(true);
    setRegError(null);
    const result = await register(regInput.trim());
    setRegSubmitting(false);
    if (result.ok) {
      setShowRegister(false);
      setRegInput("");
    } else {
      setRegError(result.error || "오류가 발생했습니다");
    }
  }

  async function handleSubmitComment() {
    if (!commentText.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`${apiBase()}/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setCommentText("");
        fetchComments();
      } else {
        setSubmitError(data.error || "오류가 발생했습니다");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteComment(id: number, isOwner: boolean) {
    if (!window.confirm(KR ? "댓글을 삭제하시겠습니까?" : "Delete this comment?")) return;
    const body: any = {};
    if (!isOwner) body.password = POST_PASSWORD;
    await fetch(`${apiBase()}/api/posts/${postId}/comments/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    fetchComments();
  }

  const inputStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: "0.82rem",
    border: "1px solid var(--color-border)",
    background: "var(--color-bg)",
    color: "var(--color-text)",
    padding: "10px 14px",
    outline: "none",
    letterSpacing: "0.02em",
    boxSizing: "border-box" as const,
    width: "100%",
  };

  return (
    <div style={{ marginTop: "2rem", borderTop: "1px solid var(--color-border)", paddingTop: "1.5rem" }}>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1.25rem", fontWeight: 500 }}>
        {KR ? `댓글 ${comments.length}` : `Comments ${comments.length}`}
      </p>

      {/* 댓글 목록 */}
      {loadingComments ? (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--color-text-muted)", padding: "1rem 0" }}>{KR ? "불러오는 중..." : "Loading..."}</p>
      ) : comments.length === 0 ? (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-text-muted)", padding: "0.75rem 0", lineHeight: 1.7 }}>
          {KR ? "첫 번째 댓글을 남겨보세요." : "Be the first to comment."}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: "1.5rem" }}>
          {comments.map(c => (
            <div key={c.id} style={{ padding: "0.9rem 0", borderBottom: "1px solid var(--color-border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text)", letterSpacing: "0.02em" }}>
                  {c.nickname}
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "var(--color-text-muted)", letterSpacing: "0.02em" }}>
                  {formatDate(c.created_at)}
                </span>
                {/* 본인 댓글 삭제 버튼 — 현재 닉네임 비교 */}
                {nickname && nickname === c.nickname && (
                  <button
                    onClick={() => handleDeleteComment(c.id, true)}
                    style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", padding: "0", marginLeft: "auto", letterSpacing: "0.04em" }}
                  >
                    {KR ? "삭제" : "Delete"}
                  </button>
                )}
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--color-text)", lineHeight: 1.75, margin: 0, whiteSpace: "pre-wrap" }}>
                {c.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 닉네임 미등록 상태 */}
      {!nickLoading && !nickname && !showRegister && (
        <div style={{ background: "var(--color-surface-sky, #eaf2f9)", padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.6 }}>
            {KR ? "댓글을 작성하려면 닉네임을 등록해주세요. (IP 1개당 닉네임 1개)" : "Register a nickname to leave a comment. (1 nickname per IP)"}
          </p>
          <button
            onClick={() => setShowRegister(true)}
            style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "#1a2530", color: "#f4f5eb", border: "none", padding: "9px 20px", cursor: "pointer", flexShrink: 0 }}
          >
            {KR ? "닉네임 등록" : "Set Nickname"}
          </button>
        </div>
      )}

      {/* 닉네임 등록 폼 */}
      {showRegister && !nickname && (
        <div style={{ background: "var(--color-surface, #f9f9f6)", border: "1px solid var(--color-border)", padding: "1.25rem", marginBottom: "1rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.75rem", fontWeight: 500 }}>
            {KR ? "닉네임 등록 (2~20자, 변경 불가)" : "Set Nickname (2–20 chars, permanent)"}
          </p>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "160px" }}>
              <input
                type="text"
                value={regInput}
                maxLength={20}
                onChange={e => { setRegInput(e.target.value); setRegError(null); }}
                onKeyDown={e => { if (e.key === "Enter") handleRegister(); }}
                placeholder={KR ? "사용할 닉네임 입력" : "Enter nickname"}
                style={inputStyle}
              />
              {regInput.trim().length >= 2 && (
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", marginTop: "4px",
                  color: regChecking ? "var(--color-text-muted)" : regAvailable === true ? "#27ae60" : regAvailable === false ? "var(--color-accent-red)" : "var(--color-text-muted)"
                }}>
                  {regChecking ? (KR ? "확인 중..." : "Checking...") :
                    regAvailable === true ? (KR ? "✓ 사용 가능한 닉네임입니다" : "✓ Available") :
                    regAvailable === false ? (KR ? "✗ 이미 사용 중인 닉네임입니다" : "✗ Already taken") : ""}
                </p>
              )}
              {regError && <p style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "var(--color-accent-red)", marginTop: "4px" }}>{regError}</p>}
            </div>
            <button
              onClick={handleRegister}
              disabled={regSubmitting || regAvailable !== true || regInput.trim().length < 2}
              style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", background: regAvailable === true ? "var(--color-accent-red)" : "#ccc", color: "#fff", border: "none", padding: "10px 20px", cursor: regAvailable === true ? "pointer" : "not-allowed", flexShrink: 0, letterSpacing: "0.06em" }}
            >
              {regSubmitting ? (KR ? "등록 중..." : "...") : (KR ? "등록" : "Register")}
            </button>
            <button
              onClick={() => { setShowRegister(false); setRegInput(""); setRegError(null); }}
              style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", background: "transparent", color: "var(--color-text-muted)", border: "1px solid var(--color-border)", padding: "10px 16px", cursor: "pointer", flexShrink: 0 }}
            >
              {KR ? "취소" : "Cancel"}
            </button>
          </div>
        </div>
      )}

      {/* 댓글 입력창 — 닉네임 등록된 경우만 */}
      {!nickLoading && nickname && (
        <div style={{ marginTop: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--color-text-muted)", letterSpacing: "0.04em" }}>
              {KR ? `${nickname} 으로 댓글 작성` : `Commenting as ${nickname}`}
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
            <textarea
              value={commentText}
              onChange={e => { setCommentText(e.target.value); setSubmitError(null); }}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmitComment(); } }}
              placeholder={KR ? "댓글 입력... (Enter 전송, Shift+Enter 줄바꿈)" : "Write a comment... (Enter to send, Shift+Enter for newline)"}
              rows={2}
              maxLength={500}
              style={{ ...inputStyle, flex: 1, resize: "none", lineHeight: 1.65 }}
            />
            <button
              onClick={handleSubmitComment}
              disabled={submitting || !commentText.trim()}
              style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", background: commentText.trim() ? "#1a2530" : "#ccc", color: "#f4f5eb", border: "none", padding: "10px 18px", cursor: commentText.trim() ? "pointer" : "not-allowed", letterSpacing: "0.06em", flexShrink: 0, alignSelf: "stretch" }}
            >
              {submitting ? "..." : (KR ? "등록" : "Post")}
            </button>
          </div>
          {submitError && <p style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "var(--color-accent-red)", marginTop: "4px" }}>{submitError}</p>}
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "var(--color-text-muted)", marginTop: "4px", textAlign: "right" }}>
            {commentText.length}/500
          </p>
        </div>
      )}
    </div>
  );
}
