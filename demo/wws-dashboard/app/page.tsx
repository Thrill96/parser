import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Kpi } from "@/components/ui/Kpi";
import { Tooltip } from "@/components/ui/Tooltip";
import {
  constituents,
  upgradeCandidates,
  prospects,
  unmatched,
  totalRevenueByYear,
} from "@/lib/data";
import { fmt } from "@/lib/format";

export default function OverviewPage() {
  const eagleRevenue = constituents
    .filter((c) => c.is_eagle)
    .reduce((s, c) => s + c.tier_amount, 0);
  const eagleCount = constituents.filter((c) => c.is_eagle).length;
  const upgradeRevenue = upgradeCandidates.reduce((s, u) => s + u.gap, 0);
  const revenueByYear = totalRevenueByYear();

  const cur2026 = revenueByYear[2026] ?? 0;
  const projected = cur2026 + upgradeRevenue + 85_000;

  const years = [2022, 2023, 2024, 2025, 2026];
  const chartData = years.map((y) => ({
    year: y,
    total: revenueByYear[y] ?? 0,
    gap: y === 2024 || y === 2025,
  }));
  const maxRev = Math.max(...chartData.map((d) => d.total));

  const alerts = [
    {
      kind: "unmatched" as const,
      label: `${unmatched.length} Squarespace orders waiting to match`,
      sub: "$6,300 in unreconciled gifts",
      href: "/unmatched",
    },
    {
      kind: "upgrade" as const,
      label: `${upgradeCandidates.length} upgrade candidates flagged by DonorSearch`,
      sub: `+${fmt(upgradeRevenue)} potential if all convert`,
      href: "/upgrades",
    },
    {
      kind: "prospect" as const,
      label: `${prospects.length} new prospects discovered this week`,
      sub: "Verified giving to Smithsonian, Phillips, National Trust",
      href: "/prospecting",
    },
  ];

  return (
    <div className="space-y-6">
      <section
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}
      >
        <Kpi
          label="2026 Eagle Sponsorships"
          value={fmt(eagleRevenue)}
          sub={`${eagleCount} sponsors across 5 tiers`}
        />
        <Kpi
          glow
          label={
            <Tooltip text="Existing sponsors whose DonorSearch data shows they give significantly more to other organizations than they currently give to WWS.">
              Upgrade Opportunities
            </Tooltip>
          }
          value={fmt(upgradeRevenue)}
          sub={`${upgradeCandidates.length} candidates · DS verified`}
          badge={
            <Tooltip text="Verified through IRS 990 filings, annual reports, and donor lists.">
              <span className="ds-tag">DS</span>
            </Tooltip>
          }
        />
        <Kpi
          glow
          label={
            <Tooltip text="High-net-worth individuals with confirmed giving to arts/preservation orgs but zero relationship with WWS.">
              New Prospect Pipeline
            </Tooltip>
          }
          value={String(prospects.length)}
          sub="verified giving to similar orgs"
          badge={
            <Tooltip text="DonorSearch's database of 240M+ verified charitable gift records.">
              <span className="ds-tag">DS</span>
            </Tooltip>
          }
        />
        <Kpi
          alert
          label={
            <Tooltip text="No donations or attendance logged in eTapestry for 2024-2025. Reconciliation with SquareSpace + Mailchimp records is needed.">
              Data Gap
            </Tooltip>
          }
          value="2 Years"
          sub="2024–2025 · reconciliation needed"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {alerts.map((a) => (
          <Link
            key={a.kind}
            href={a.href}
            className="card flex flex-col gap-2 transition hover:-translate-y-px"
            style={{ borderColor: "rgba(75,156,211,0.18)" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full pulse-soft"
                style={{ background: "#4B9CD3" }}
                aria-hidden
              />
              <span className="dm text-[10px] uppercase tracking-[0.1em] font-medium" style={{ color: "#4B9CD3" }}>
                Action needed
              </span>
            </div>
            <div className="text-[15px] font-semibold leading-tight">{a.label}</div>
            <div className="dm text-[11px] text-[color:var(--color-text-3)]">
              {a.sub}
            </div>
            <div className="dm text-[11px] mt-1" style={{ color: "#4B9CD3" }}>
              Resolve →
            </div>
          </Link>
        ))}
      </section>

      <section
        className="grid gap-4"
        style={{ gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr)" }}
      >
        <Card>
          <div className="section-hdr">Revenue by Year</div>
          <div className="flex items-end gap-3 h-[180px]">
            {chartData.map((d) => {
              if (d.gap) {
                return (
                  <div key={d.year} className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                      className="gap-bar w-full h-[150px] rounded flex items-center justify-center"
                      role="img"
                      aria-label={`${d.year} — no data`}
                    >
                      <span
                        className="dm text-[9px] uppercase tracking-widest"
                        style={{ color: "rgba(220,60,60,0.7)" }}
                      >
                        Data Gap
                      </span>
                    </div>
                    <div className="dm text-xs text-[color:var(--color-text-3)]">
                      {d.year}
                    </div>
                  </div>
                );
              }
              const h = maxRev > 0 ? (d.total / maxRev) * 150 : 0;
              return (
                <div key={d.year} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="dm text-xs font-medium" style={{ color: "#C9A84C" }}>
                    {fmt(d.total)}
                  </div>
                  <div
                    className="w-full rounded"
                    style={{
                      height: `${h}px`,
                      background: "linear-gradient(180deg,#C9A84C,#8B6914)",
                    }}
                  />
                  <div className="dm text-xs text-[color:var(--color-text-3)]">
                    {d.year}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card glow>
          <div className="flex justify-between items-center mb-4">
            <div className="section-hdr mb-0">
              <Tooltip text="What sponsorship revenue could look like if upgrade candidates and new prospects convert. Based on DonorSearch-verified giving patterns.">
                Revenue Growth Map
              </Tooltip>
            </div>
            <Tooltip text="Every projection backed by DonorSearch — confirmed giving verified through public records.">
              <span className="ds-tag">DS Verified</span>
            </Tooltip>
          </div>
          {[
            { l: "Current Eagle Revenue", v: fmt(eagleRevenue), c: "#C9A84C", b: false },
            { l: `If ${upgradeCandidates.length} upgrades convert`, v: `+${fmt(upgradeRevenue)}`, c: "#4B9CD3", b: false },
            { l: "If 3 new prospects convert", v: "+$85K", c: "#4B9CD3", b: false },
            { l: "Projected potential", v: fmt(projected), c: "#E8E4DD", b: true },
          ].map((r, i) => (
            <div
              key={i}
              className={`flex justify-between py-2.5 ${i < 3 ? "border-b" : ""}`}
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              <span className="dm text-xs text-[color:var(--color-text-2)]">{r.l}</span>
              <span
                className="dm font-medium"
                style={{
                  color: r.c,
                  fontSize: r.b ? 16 : 13,
                  fontWeight: r.b ? 700 : 500,
                }}
              >
                {r.v}
              </span>
            </div>
          ))}
          <div
            className="mt-3 p-2.5 rounded text-[11px] leading-relaxed dm"
            style={{ background: "rgba(75,156,211,0.05)", color: "#4B9CD3" }}
          >
            DonorSearch verified each upgrade through IRS 990 filings and donor
            lists. One Platinum upgrade pays for everything.
          </div>
        </Card>
      </section>
    </div>
  );
}
