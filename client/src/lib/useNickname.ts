import { useState, useEffect, useCallback } from "react";

function apiBase() {
  if (typeof window !== "undefined" && window.location.hostname.endsWith(".pplx.app")) {
    return "/port/5000";
  }
  return "";
}

export interface NicknameState {
  nickname: string | null;        // null = 미등록
  loading: boolean;
  error: string | null;
  register: (name: string) => Promise<{ ok: boolean; error?: string }>;
  refetch: () => void;
}

export function useNickname(): NicknameState {
  const [nickname, setNickname] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMe = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase()}/api/visitor/me`);
      const data = await res.json();
      setNickname(data.nickname || null);
    } catch {
      setNickname(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const register = useCallback(async (name: string) => {
    setError(null);
    const res = await fetch(`${apiBase()}/api/visitor/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname: name }),
    });
    const data = await res.json();
    if (res.ok) {
      setNickname(data.nickname);
      return { ok: true };
    } else {
      setError(data.error || "오류가 발생했습니다");
      return { ok: false, error: data.error };
    }
  }, []);

  return { nickname, loading, error, register, refetch: fetchMe };
}
