import { Card } from "@/components/ui/Card";
import { Tooltip } from "@/components/ui/Tooltip";
import { syncLog } from "@/lib/data";
import { relativeTime } from "@/lib/format";

const SOURCES = [
  { id: "etapestry", label: "eTapestry", icon: "🏛", color: "#C9A84C" },
  { id: "squarespace", label: "Squarespace", icon: "▢", color: "#5BA67A" },
  { id: "mailchimp", label: "Mailchimp", icon: "✉", color: "#D4A94B" },
  { id: "gmail", label: "Gmail", icon: "✉", color: "#4B9CD3" },
  { id: "donorsearch", label: "DonorSearch", icon: "◆", color: "#4B9CD3" },
];

export default function SyncPage() {
  // Tally per source
  const lastBy = SOURCES.map((s) => {
    const recent = syncLog
      .filter((e) => e.source === s.id)
      .sort((a, b) => b.started_at.localeCompare(a.started_at))[0];
    const successCount = syncLog.filter((e) => e.source === s.id && e.status === "success").length;
    const total = syncLog.filter((e) => e.source === s.id).length;
    return { ...s, recent, total, successCount };
  });

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-semibold mb-1">Sync Status</h1>
        <p className="dm text-sm text-[color:var(--color-text-3)] max-w-3xl">
          Every system connection, every sync run, every webhook delivery — fully
          observable. The dashboard never lies to you about what&rsquo;s up to date.
        </p>
      </header>

      <section
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}
      >
        {lastBy.map((s) => {
          const ok = s.recent?.status === "success";
          return (
            <Card key={s.id}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold" style={{ color: s.color }}>
                  {s.label}
                </span>
                <span
                  className="dm text-[9px] uppercase tracking-widest font-medium px-1.5 py-0.5 rounded"
                  style={{
                    background: ok ? "rgba(91,166,122,0.12)" : "rgba(220,60,60,0.1)",
                    color: ok ? "#5BA67A" : "#DC3C3C",
                  }}
                >
                  {ok ? "Healthy" : "Issue"}
                </span>
              </div>
              <div className="dm text-[11px] text-[color:var(--color-text-3)]">
                Last: {s.recent ? relativeTime(s.recent.started_at) : "never"}
              </div>
              <div className="dm text-[10px] text-[color:var(--color-text-3)] mt-0.5">
                {s.successCount}/{s.total} successful (last 24h)
              </div>
            </Card>
          );
        })}
      </section>

      <Card>
        <div className="flex justify-between items-center mb-3">
          <div className="section-hdr mb-0">
            <Tooltip text="Every sync action — webhook deliveries, scheduled jobs, manual triggers — with status and duration. This is your audit trail and your debugging surface.">
              Recent Sync Events
            </Tooltip>
          </div>
          <span className="dm text-[11px] text-[color:var(--color-text-3)]">
            {syncLog.length} events in last 24h
          </span>
        </div>

        <div
          className="dm text-[10px] uppercase tracking-wider grid gap-2 px-2 py-2 border-b"
          style={{
            gridTemplateColumns: "100px 100px 80px 90px 80px 1fr",
            color: "rgba(232,228,221,0.35)",
            borderColor: "rgba(255,255,255,0.04)",
          }}
        >
          <div>Source</div>
          <div>Type</div>
          <div>Status</div>
          <div className="text-right">Records</div>
          <div className="text-right">Duration</div>
          <div>When</div>
        </div>

        {syncLog.map((e, i) => {
          const src = SOURCES.find((s) => s.id === e.source);
          const ok = e.status === "success";
          return (
            <div
              key={e.id}
              className="grid items-center gap-2 px-2 py-2 text-sm border-b last:border-b-0"
              style={{
                gridTemplateColumns: "100px 100px 80px 90px 80px 1fr",
                borderColor: "rgba(255,255,255,0.03)",
                animation: `fadeUp ${0.1 + i * 0.01}s ease forwards`,
              }}
            >
              <div className="dm text-xs font-medium" style={{ color: src?.color }}>
                {src?.label ?? e.source}
              </div>
              <div className="dm text-[11px] text-[color:var(--color-text-3)]">
                {e.type}
              </div>
              <div>
                <span
                  className="dm text-[9px] uppercase tracking-widest font-medium px-1.5 py-0.5 rounded"
                  style={{
                    background: ok ? "rgba(91,166,122,0.1)" : "rgba(220,60,60,0.1)",
                    color: ok ? "#5BA67A" : "#DC3C3C",
                  }}
                >
                  {e.status}
                </span>
              </div>
              <div className="dm text-xs text-right" style={{ color: "#C9A84C" }}>
                {e.records_processed}
              </div>
              <div className="dm text-[11px] text-right text-[color:var(--color-text-3)]">
                {e.duration_ms}ms
              </div>
              <div className="dm text-[11px] text-[color:var(--color-text-2)]">
                {relativeTime(e.started_at)}
                {e.error && (
                  <span className="ml-2" style={{ color: "#DC3C3C" }}>
                    · {e.error}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
