import { Card } from "@/components/ui/Card";
import { Tooltip } from "@/components/ui/Tooltip";
import { constituents } from "@/lib/data";
import { fmt } from "@/lib/format";

const TIERS = [
  { name: "Presenting Eagle", amount: 50000, color: "#C9A84C" },
  { name: "Platinum Eagle", amount: 25000, color: "#A0A7B5" },
  { name: "Gold Eagle", amount: 10000, color: "#D4A94B" },
  { name: "Silver Eagle", amount: 5000, color: "#8A939F" },
  { name: "Bronze Eagle", amount: 2500, color: "#B87A4B" },
];

export default function SponsorsPage() {
  const counts = TIERS.map((t) => ({
    ...t,
    count: constituents.filter((c) => c.tier === t.name).length,
  }));
  const total = counts.reduce((s, t) => s + t.count * t.amount, 0);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-semibold mb-1">Sponsors</h1>
        <p className="dm text-sm text-[color:var(--color-text-3)]">
          Eagle Sponsorship breakdown for FY2026.
        </p>
      </header>

      <Card>
        <div className="section-hdr">
          <Tooltip text="Eagle Sponsorships are the five core giving tiers. Largest single source of event revenue.">
            Eagle Tier Breakdown
          </Tooltip>{" "}
          (2026)
        </div>

        {counts.map((t) => {
          const sub = t.count * t.amount;
          const pct = total > 0 ? (sub / total) * 100 : 0;
          return (
            <div key={t.name} className="mb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: t.color }}
                  aria-hidden
                />
                <span className="text-sm font-semibold" style={{ color: t.color }}>
                  {t.name}
                </span>
                <span
                  className="dm text-[11px] ml-auto"
                  style={{ color: "rgba(232,228,221,0.4)" }}
                >
                  {t.count} × {fmt(t.amount)}
                </span>
                <span className="dm text-sm font-semibold" style={{ color: "#C9A84C" }}>
                  {fmt(sub)}
                </span>
              </div>
              <div
                className="h-1.5 rounded overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <div
                  className="h-full rounded transition-all"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${t.color}, ${t.color}88)`,
                  }}
                />
              </div>
            </div>
          );
        })}

        <div
          className="pt-3 mt-2 border-t flex justify-between"
          style={{ borderColor: "rgba(201,168,76,0.15)" }}
        >
          <span className="dm text-sm text-[color:var(--color-text-3)]">
            Total Eagle Sponsorships
          </span>
          <span className="text-base font-bold" style={{ color: "#C9A84C" }}>
            {fmt(total)}
          </span>
        </div>
      </Card>
    </div>
  );
}
