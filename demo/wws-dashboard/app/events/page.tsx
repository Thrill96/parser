import { Card } from "@/components/ui/Card";
import { events } from "@/lib/data";
import { fmt } from "@/lib/format";

export default function EventsPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-semibold mb-1">Events</h1>
        <p className="dm text-sm text-[color:var(--color-text-3)]">
          2026 event calendar — main show, preview night, and engagement events.
        </p>
      </header>

      <Card>
        <div className="section-hdr">2026 Event Calendar</div>
        {events.map((e) => {
          const sc =
            e.status === "completed"
              ? "#5BA67A"
              : e.status === "upcoming"
                ? "#C9A84C"
                : "rgba(232,228,221,0.25)";
          const bg =
            e.status === "completed"
              ? "rgba(91,166,122,0.15)"
              : e.status === "upcoming"
                ? "rgba(201,168,76,0.15)"
                : "rgba(255,255,255,0.05)";
          return (
            <div
              key={e.id}
              className="flex items-center gap-4 py-3 border-b last:border-b-0"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: sc }}
                aria-hidden
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{e.name}</div>
                <div className="dm text-[11px] text-[color:var(--color-text-3)]">
                  {e.date} · {e.type}
                </div>
              </div>
              <div
                className="dm text-xs font-medium hidden sm:block"
                style={{
                  color: e.attendees > 0 ? "#C9A84C" : "rgba(232,228,221,0.25)",
                }}
              >
                {e.attendees > 0 ? `${e.attendees.toLocaleString()} attendees` : "—"}
              </div>
              <div
                className="dm text-xs font-medium hidden sm:block"
                style={{ color: e.revenue > 0 ? "#C9A84C" : "rgba(232,228,221,0.25)" }}
              >
                {e.revenue > 0 ? fmt(e.revenue) : "—"}
              </div>
              <span
                className="dm text-[10px] uppercase tracking-widest font-medium px-2 py-1 rounded"
                style={{ background: bg, color: sc }}
              >
                {e.status}
              </span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
