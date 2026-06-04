import { useEffect, useState, useCallback } from "react";
import { adminFetch } from "@/lib/tracker";

const TOKEN = "bifi2024xK9mPqR";

function apiBase() {
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && !window.location.hostname.startsWith("127.")) {
    return "/port/5000";
  }
  return "";
}
const DAYS_OPTIONS = [7, 14, 30, 90];

// ── helpers ──────────────────────────────────────────────────────
function fmt(ms: number) {
  if (!ms) return "0s";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}m ${rem}s`;
}
function pct(a: number, b: number) {
  if (!b) return "0%";
  return `${Math.round((a / b) * 100)}%`;
}
function parseReferrerLabel(r: any) {
  const src = r.utm_source || r.referrer || "direct";
  const campaign = r.utm_campaign ? ` [${r.utm_campaign}]` : "";
  const content = r.utm_content ? ` · ${r.utm_content}` : "";
  return `${src}${campaign}${content}`;
}

// ── Mini bar chart ────────────────────────────────────────────────
function Bar({ value, max, color = "#b9d0e9" }: { value: number; max: number; color?: string }) {
  const w = max ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ background: "#f0f0ea", height: "6px", borderRadius: "3px", marginTop: "4px" }}>
      <div style={{ width: `${w}%`, height: "100%", background: color, borderRadius: "3px", transition: "width 0.5s ease" }} />
    </div>
  );
}

// ── Funnel step ───────────────────────────────────────────────────
function FunnelStep({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const w = total ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "#1a2530" }}>{label}</span>
        <span style={{ fontSize: "0.75rem", color: "#888" }}>{value.toLocaleString()} ({pct(value, total)})</span>
      </div>
      <div style={{ background: "#f0f0ea", height: "10px", borderRadius: "5px" }}>
        <div style={{ width: `${w}%`, height: "100%", background: color, borderRadius: "5px", transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

// ── Section card ──────────────────────────────────────────────────
function Card({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e8e8e0",
      borderRadius: "4px",
      padding: "1.5rem",
      marginBottom: "1.25rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <h3 style={{ fontFamily: "Pretendard, sans-serif", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a2530", margin: 0 }}>{title}</h3>
        {badge && <span style={{ fontSize: "0.65rem", background: "#b9d0e9", color: "#1a2530", padding: "2px 8px", borderRadius: "2px", fontWeight: 600 }}>{badge}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Stat tile ─────────────────────────────────────────────────────
function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 700, color: "#1a2530", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", marginTop: "6px" }}>{label}</div>
      {sub && <div style={{ fontSize: "0.65rem", color: "#aaa", marginTop: "3px" }}>{sub}</div>}
    </div>
  );
}

// ── Row list item ─────────────────────────────────────────────────
function RowItem({ label, value, max, color }: { label: string; value: number; max: number; color?: string }) {
  return (
    <div style={{ marginBottom: "0.85rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
        <span style={{ color: "#1a2530", fontWeight: 500, maxWidth: "70%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
        <span style={{ color: "#666", fontWeight: 600 }}>{value.toLocaleString()}</span>
      </div>
      <Bar value={value} max={max} color={color} />
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────
function Empty() {
  return (
    <div style={{ textAlign: "center", padding: "2rem 0", color: "#bbb", fontSize: "0.75rem" }}>
      아직 데이터가 없습니다. 방문자가 유입되면 자동으로 표시됩니다.
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────
export default function Admin() {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const base = apiBase();
      const headers = { "x-admin-token": TOKEN };
      const q = `?days=${days}`;
      const [overview, referrers, firstClicks, journeys, scrolls, dwell, exits, searches, segments, funnel, timeline, sessions] = await Promise.all([
        fetch(`${base}/api/admin/overview${q}`, { headers }).then(r => r.json()),
        fetch(`${base}/api/admin/referrers${q}`, { headers }).then(r => r.json()),
        fetch(`${base}/api/admin/first-clicks${q}`, { headers }).then(r => r.json()),
        fetch(`${base}/api/admin/journeys${q}`, { headers }).then(r => r.json()),
        fetch(`${base}/api/admin/scroll-depths${q}`, { headers }).then(r => r.json()),
        fetch(`${base}/api/admin/dwell-times${q}`, { headers }).then(r => r.json()),
        fetch(`${base}/api/admin/exit-pages${q}`, { headers }).then(r => r.json()),
        fetch(`${base}/api/admin/searches${q}`, { headers }).then(r => r.json()),
        fetch(`${base}/api/admin/segments${q}`, { headers }).then(r => r.json()),
        fetch(`${base}/api/admin/funnel${q}`, { headers }).then(r => r.json()),
        fetch(`${base}/api/admin/timeline?days=7`, { headers }).then(r => r.json()),
        fetch(`${base}/api/admin/sessions?limit=20`, { headers }).then(r => r.json()),
      ]);
      setData({ overview, referrers, firstClicks, journeys, scrolls, dwell, exits, searches, segments, funnel, timeline, sessions });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [days]);

  useEffect(() => { load(); }, [load]);

  const tabs = [
    "개요",
    "유입 분석",
    "첫 클릭",
    "이동 경로",
    "스크롤",
    "체류 시간",
    "이탈 분석",
    "검색어",
    "고객 세그먼트",
    "전환 퍼널",
    "실시간 세션",
  ];

  const o = data.overview || {};
  const funnelData = data.funnel || {};

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f2", fontFamily: "Pretendard, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#1a2530", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: "#b9d0e9", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "2px" }}>BIFI BLANCHE</div>
          <div style={{ color: "#fff", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.04em" }}>Analytics Dashboard</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "#888", fontSize: "0.7rem" }}>기간:</span>
          {DAYS_OPTIONS.map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              style={{
                background: days === d ? "#b9d0e9" : "transparent",
                border: `1px solid ${days === d ? "#b9d0e9" : "#444"}`,
                color: days === d ? "#1a2530" : "#999",
                fontSize: "0.7rem", fontWeight: 600,
                padding: "4px 10px", borderRadius: "2px", cursor: "pointer",
                fontFamily: "Pretendard, sans-serif",
              }}
            >
              {d}일
            </button>
          ))}
          <button
            onClick={load}
            style={{ background: "#e40b2c", border: "none", color: "#fff", fontSize: "0.7rem", fontWeight: 600, padding: "5px 12px", borderRadius: "2px", cursor: "pointer", marginLeft: "0.5rem", fontFamily: "Pretendard, sans-serif" }}
          >
            새로고침
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e0", overflowX: "auto", display: "flex" }}>
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setActiveTab(i)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "0.75rem 1.1rem",
              fontSize: "0.72rem", fontWeight: activeTab === i ? 700 : 400,
              color: activeTab === i ? "#1a2530" : "#888",
              borderBottom: activeTab === i ? "2px solid #1a2530" : "2px solid transparent",
              whiteSpace: "nowrap", letterSpacing: "0.04em",
              fontFamily: "Pretendard, sans-serif",
              transition: "all 0.2s",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1.5rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#888", fontSize: "0.85rem" }}>데이터를 불러오는 중...</div>
        ) : (
          <>
            {/* 0: 개요 */}
            {activeTab === 0 && (
              <>
                <Card title="핵심 지표" badge={`최근 ${days}일`}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0", borderTop: "1px solid #f0f0ea" }}>
                    <Stat label="총 세션" value={o.total_sessions?.toLocaleString() || 0} />
                    <Stat label="순 방문자" value={o.unique_visitors?.toLocaleString() || 0} />
                    <Stat label="재방문자" value={o.returning_visitors?.toLocaleString() || 0} sub={pct(o.returning_visitors, o.unique_visitors)} />
                    <Stat label="페이지뷰" value={o.total_page_views?.toLocaleString() || 0} />
                    <Stat label="평균 체류" value={fmt(o.avg_session_duration || 0)} />
                  </div>
                </Card>

                <Card title="최근 7일 이벤트 흐름">
                  {(data.timeline || []).length === 0 ? <Empty /> : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.72rem" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #f0f0ea" }}>
                            {["날짜", "이벤트 타입", "횟수"].map(h => (
                              <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: "#888", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(data.timeline || []).map((row: any, i: number) => (
                            <tr key={i} style={{ borderBottom: "1px solid #f9f9f5" }}>
                              <td style={{ padding: "6px 8px", color: "#555" }}>{row.day}</td>
                              <td style={{ padding: "6px 8px", color: "#1a2530", fontWeight: 500 }}>{row.event_type}</td>
                              <td style={{ padding: "6px 8px", color: "#1a2530", fontWeight: 700 }}>{row.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </>
            )}

            {/* 1: 유입 분석 */}
            {activeTab === 1 && (
              <Card title="유입 경로 분석" badge={`최근 ${days}일`}>
                {(data.referrers || []).length === 0 ? <Empty /> : (() => {
                  const max = Math.max(...(data.referrers || []).map((r: any) => r.count));
                  const grouped: Record<string, number> = {};
                  (data.referrers || []).forEach((r: any) => {
                    const src = r.utm_source || r.referrer || "direct";
                    grouped[src] = (grouped[src] || 0) + r.count;
                  });
                  const sortedGrouped = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
                  const gmax = Math.max(...sortedGrouped.map(e => e[1]));
                  const srcColor: Record<string, string> = {
                    direct: "#1a2530",
                    naver: "#03C75A",
                    google: "#e40b2c",
                    instagram: "#d5da2f",
                    threads: "#b9d0e9",
                    kakao: "#FEE500",
                    sms: "#888",
                    email: "#b9d0e9",
                  };

                  return (
                    <>
                      <h4 style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", marginBottom: "1rem", marginTop: 0 }}>채널별 요약</h4>
                      {sortedGrouped.map(([src, cnt]) => (
                        <RowItem key={src} label={src} value={cnt} max={gmax} color={srcColor[src] || "#b9d0e9"} />
                      ))}

                      <div style={{ borderTop: "1px solid #f0f0ea", marginTop: "1.5rem", paddingTop: "1.5rem" }}>
                        <h4 style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", marginBottom: "1rem", marginTop: 0 }}>상세 유입 (캠페인 포함)</h4>
                        {(data.referrers || []).map((r: any, i: number) => (
                          <RowItem key={i} label={parseReferrerLabel(r)} value={r.count} max={max} color={srcColor[r.utm_source || r.referrer] || "#b9d0e9"} />
                        ))}
                      </div>
                    </>
                  );
                })()}
              </Card>
            )}

            {/* 2: 첫 클릭 */}
            {activeTab === 2 && (
              <Card title="첫 클릭 분석" badge="입장 후 첫 액션">
                {(data.firstClicks || []).length === 0 ? <Empty /> : (() => {
                  const max = Math.max(...(data.firstClicks || []).map((r: any) => r.count));
                  return (data.firstClicks || []).map((r: any, i: number) => (
                    <RowItem key={i} label={r.target || "(없음)"} value={r.count} max={max} color="#b9d0e9" />
                  ));
                })()}
              </Card>
            )}

            {/* 3: 이동 경로 */}
            {activeTab === 3 && (
              <Card title="고객 이동 경로" badge="세션별 페이지 여정">
                {(data.journeys || []).length === 0 ? <Empty /> : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.72rem" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #f0f0ea" }}>
                          {["이동 경로", "페이지 수"].map(h => (
                            <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: "#888", fontWeight: 600 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(data.journeys || []).slice(0, 30).map((j: any, i: number) => (
                          <tr key={i} style={{ borderBottom: "1px solid #f9f9f5" }}>
                            <td style={{ padding: "8px", color: "#444", lineHeight: 1.6, wordBreak: "break-word" }}>{j.path || "/"}</td>
                            <td style={{ padding: "8px", color: "#1a2530", fontWeight: 700, whiteSpace: "nowrap" }}>{j.steps}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            )}

            {/* 4: 스크롤 */}
            {activeTab === 4 && (
              <Card title="스크롤 깊이 분석" badge="페이지별 읽은 비율">
                {(data.scrolls || []).length === 0 ? <Empty /> : (data.scrolls || []).map((s: any, i: number) => (
                  <div key={i} style={{ marginBottom: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 600, color: "#1a2530" }}>{s.page || "/"}</span>
                      <span style={{ color: "#666" }}>평균 {Math.round(s.avg_scroll)}% · 최대 {Math.round(s.max_scroll_ever)}% · {s.views}뷰</span>
                    </div>
                    <div style={{ background: "#f0f0ea", height: "12px", borderRadius: "6px", position: "relative" }}>
                      <div style={{ width: `${Math.round(s.avg_scroll)}%`, height: "100%", background: "#b9d0e9", borderRadius: "6px" }} />
                      <div style={{ position: "absolute", top: 0, left: `${Math.round(s.max_scroll_ever)}%`, width: "2px", height: "100%", background: "#e40b2c", transform: "translateX(-50%)" }} />
                    </div>
                    <div style={{ display: "flex", gap: "1rem", fontSize: "0.65rem", color: "#aaa", marginTop: "4px" }}>
                      <span>■ 파랑: 평균 스크롤</span>
                      <span style={{ color: "#e40b2c" }}>■ 빨강: 최대 도달</span>
                    </div>
                  </div>
                ))}
              </Card>
            )}

            {/* 5: 체류 시간 */}
            {activeTab === 5 && (
              <Card title="체류 시간 분석" badge="페이지별 평균 체류">
                {(data.dwell || []).length === 0 ? <Empty /> : (() => {
                  const max = Math.max(...(data.dwell || []).map((d: any) => d.avg_time));
                  return (data.dwell || []).map((d: any, i: number) => (
                    <div key={i} style={{ marginBottom: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                        <span style={{ fontWeight: 600, color: "#1a2530" }}>{d.page || "/"}</span>
                        <span style={{ color: "#666" }}>평균 {fmt(d.avg_time)} · {d.views}뷰</span>
                      </div>
                      <Bar value={d.avg_time} max={max} color="#d5da2f" />
                    </div>
                  ));
                })()}
              </Card>
            )}

            {/* 6: 이탈 분석 */}
            {activeTab === 6 && (
              <>
                <Card title="이탈 페이지 분석" badge="마지막으로 본 페이지">
                  {(data.exits || []).length === 0 ? <Empty /> : (() => {
                    const max = Math.max(...(data.exits || []).map((e: any) => e.exits));
                    return (data.exits || []).map((e: any, i: number) => (
                      <RowItem key={i} label={e.page || "/"} value={e.exits} max={max} color="#e40b2c" />
                    ));
                  })()}
                </Card>
                <Card title="유입 대비 이탈률" badge="퍼널 관점">
                  <div style={{ padding: "1rem 0" }}>
                    <FunnelStep label="사이트 방문" value={funnelData.visited || 0} total={funnelData.visited || 0} color="#1a2530" />
                    <FunnelStep label="제품 상세 조회" value={funnelData.viewed_product || 0} total={funnelData.visited || 1} color="#b9d0e9" />
                    <FunnelStep label="성분 탭 클릭" value={funnelData.clicked_ingredient || 0} total={funnelData.visited || 1} color="#d5da2f" />
                    <FunnelStep label="스토어 링크 클릭" value={funnelData.clicked_store || 0} total={funnelData.visited || 1} color="#e40b2c" />
                  </div>
                </Card>
              </>
            )}

            {/* 7: 검색어 */}
            {activeTab === 7 && (
              <Card title="사이트 내 검색어" badge="모든 검색 키워드">
                {(data.searches || []).length === 0 ? <Empty /> : (() => {
                  const max = Math.max(...(data.searches || []).map((s: any) => s.count));
                  return (data.searches || []).map((s: any, i: number) => (
                    <RowItem key={i} label={s.query} value={s.count} max={max} color="#1a2530" />
                  ));
                })()}
              </Card>
            )}

            {/* 8: 고객 세그먼트 */}
            {activeTab === 8 && (
              <Card title="고객 세그먼트" badge={`최근 ${days}일`}>
                {!data.segments ? <Empty /> : (() => {
                  const seg = data.segments;
                  const total = (seg.first_visit || 0) + (seg.returning || 0);
                  return (
                    <div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1px", background: "#f0f0ea", border: "1px solid #f0f0ea", marginBottom: "1.5rem" }}>
                        {[
                          { label: "첫 방문자", value: seg.first_visit || 0, color: "#b9d0e9" },
                          { label: "재방문자", value: seg.returning || 0, color: "#1a2530" },
                          { label: "장기 미방문", value: seg.dormant || 0, color: "#e40b2c" },
                        ].map(s => (
                          <div key={s.label} style={{ background: "#fff", padding: "1.25rem", textAlign: "center" }}>
                            <div style={{ fontSize: "1.8rem", fontWeight: 700, color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: "0.7rem", color: "#888", marginTop: "4px" }}>{s.label}</div>
                            <div style={{ fontSize: "0.65rem", color: "#aaa" }}>{pct(s.value, total + (seg.dormant||0))}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ background: "#f7f7f2", borderRadius: "4px", padding: "1rem" }}>
                        <p style={{ fontSize: "0.72rem", color: "#666", margin: 0, lineHeight: 1.8 }}>
                          <strong>첫 방문자</strong>: 처음 방문한 신규 유저 |{" "}
                          <strong>재방문자</strong>: 이전에 방문 기록이 있는 유저 |{" "}
                          <strong>장기 미방문</strong>: 2회 이상 방문했지만 최근 30일 내 방문 없는 유저
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </Card>
            )}

            {/* 9: 전환 퍼널 */}
            {activeTab === 9 && (
              <Card title="구매 전환 퍼널" badge="방문 → 스토어 클릭">
                <p style={{ fontSize: "0.72rem", color: "#888", marginBottom: "1.5rem", marginTop: 0 }}>
                  각 단계에서 이탈하는 비율을 분석합니다. 스토어 클릭 = 네이버 스마트스토어 이동
                </p>
                <FunnelStep label="① 사이트 방문" value={funnelData.visited || 0} total={funnelData.visited || 0} color="#1a2530" />
                <FunnelStep label="② 제품 상세 조회" value={funnelData.viewed_product || 0} total={funnelData.visited || 1} color="#b9d0e9" />
                <FunnelStep label="③ 성분 안내 클릭" value={funnelData.clicked_ingredient || 0} total={funnelData.visited || 1} color="#d5da2f" />
                <FunnelStep label="④ 스토어 링크 클릭 (구매 의도)" value={funnelData.clicked_store || 0} total={funnelData.visited || 1} color="#e40b2c" />

                {funnelData.visited > 0 && (
                  <div style={{ marginTop: "1.5rem", background: "#f7f7f2", padding: "1rem", borderRadius: "4px" }}>
                    <div style={{ fontSize: "0.75rem", color: "#555", fontWeight: 600, marginBottom: "0.5rem" }}>전환율 요약</div>
                    <div style={{ fontSize: "0.72rem", color: "#777", lineHeight: 2 }}>
                      방문 → 제품조회: {pct(funnelData.viewed_product, funnelData.visited)}<br />
                      방문 → 스토어클릭: {pct(funnelData.clicked_store, funnelData.visited)}<br />
                      제품조회 → 스토어클릭: {pct(funnelData.clicked_store, funnelData.viewed_product || 1)}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* 10: 실시간 세션 */}
            {activeTab === 10 && (
              <Card title="최근 세션" badge="최신 20개">
                {(data.sessions || []).length === 0 ? <Empty /> : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.7rem" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #f0f0ea" }}>
                          {["시간", "유입", "기기", "신규/재방문", "이동 경로"].map(h => (
                            <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: "#888", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(data.sessions || []).map((s: any, i: number) => (
                          <tr key={i} style={{ borderBottom: "1px solid #f9f9f5" }}>
                            <td style={{ padding: "8px", color: "#666", whiteSpace: "nowrap" }}>
                              {new Date(s.started_at).toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                            </td>
                            <td style={{ padding: "8px" }}>
                              <span style={{ background: "#f0f0ea", padding: "2px 6px", borderRadius: "2px", color: "#444" }}>
                                {s.utm_source || s.referrer || "직접"}
                              </span>
                            </td>
                            <td style={{ padding: "8px", color: "#555" }}>{s.device || "-"}</td>
                            <td style={{ padding: "8px" }}>
                              <span style={{
                                background: s.is_returning ? "#1a2530" : "#b9d0e9",
                                color: s.is_returning ? "#b9d0e9" : "#1a2530",
                                padding: "2px 6px", borderRadius: "2px", fontSize: "0.65rem", fontWeight: 600,
                              }}>
                                {s.is_returning ? "재방문" : "신규"}
                              </span>
                            </td>
                            <td style={{ padding: "8px", color: "#444", maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {s.path || s.landing_page || "/"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            )}
          </>
        )}
      </div>

      {/* Footer note */}
      <div style={{ textAlign: "center", padding: "2rem", color: "#ccc", fontSize: "0.65rem", letterSpacing: "0.1em" }}>
        BIFI BLANCHE ADMIN · SECRET ACCESS · {window.location.origin}
      </div>
    </div>
  );
}
