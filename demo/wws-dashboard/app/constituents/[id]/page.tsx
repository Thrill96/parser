import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Tooltip } from "@/components/ui/Tooltip";
import { StarRating } from "@/components/ui/StarRating";
import { MlrBar } from "@/components/ui/MlrBar";
import { SourceTag } from "@/components/ui/SourceTag";
import { DsBadge } from "@/components/ui/DsBadge";
import {
  getConstituent,
  getWealthProfile,
  upgradeCandidates,
  tierColor,
} from "@/lib/data";
import { fmt, fmtCurrency } from "@/lib/format";
import { ProfileActions } from "./ProfileActions";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = getConstituent(id);
  if (!c) notFound();
  const wp = getWealthProfile(id);
  const upgrade = upgradeCandidates.find((u) => u.constituent_id === id);
  const tColor = tierColor(c.tier);

  return (
    <div className="space-y-4">
      <Link
        href="/constituents"
        className="dm text-xs text-[color:var(--color-text-3)] hover:text-[color:var(--color-text-2)] inline-flex items-center gap-1"
      >
        ← Back to constituents
      </Link>

      <Card>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">{c.name}</h1>
            <div className="flex gap-2 items-center flex-wrap">
              <span
                className="dm text-[11px] font-semibold px-2.5 py-0.5 rounded"
                style={{
                  background: `${tColor}20`,
                  color: tColor,
                  border: `1px solid ${tColor}40`,
                }}
              >
                {c.tier}
              </span>
              {wp && <DsBadge rating={wp.ds_rating} />}
              <span className="dm text-xs text-[color:var(--color-text-3)]">
                Since {c.first_gift_year}
              </span>
              <span className="dm text-xs text-[color:var(--color-text-3)]">
                {c.zip} ({c.city}, {c.state})
              </span>
            </div>
          </div>
          <div className="text-right space-y-0.5">
            <div className="dm text-[10px] uppercase tracking-widest text-[color:var(--color-text-3)]">
              WWS Lifetime
            </div>
            <div className="text-3xl font-semibold" style={{ color: "#C9A84C" }}>
              {fmtCurrency(c.lifetime_total)}
            </div>
            <div className="dm text-[11px] text-[color:var(--color-text-3)]">
              {c.gift_count} gift{c.gift_count !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
        <ProfileActions constituent={c} />
      </Card>

      {wp && (
        <Card glow>
          <div className="flex justify-between items-center mb-4">
            <div className="section-hdr mb-0" style={{ color: "#4B9CD3" }}>
              <Tooltip text="Everything DonorSearch knows about this person — likelihood to give, recommended ask amount, confirmed gifts to other organizations, real estate, political donations, board memberships.">
                DonorSearch Intelligence
              </Tooltip>
            </div>
            <div className="flex items-center gap-2">
              <DsBadge rating={wp.ds_rating} />
              <StarRating rating={wp.ds_rating} />
            </div>
          </div>

          <div
            className="grid gap-4 pb-4 mb-4 border-b"
            style={{
              gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
              borderColor: "rgba(255,255,255,0.04)",
            }}
          >
            <div>
              <div className="lbl">
                <Tooltip text="Most Likely to Respond — DonorSearch's AI score (0–100). 80+ very likely; 65–80 likely; below 65 needs cultivation.">
                  MLR Score
                </Tooltip>
              </div>
              <MlrBar score={wp.mlr_score} />
            </div>
            <div>
              <div className="lbl">
                <Tooltip text="Likelihood of a major gift ($10,000+) based on confirmed giving patterns to other orgs.">
                  Major Gift
                </Tooltip>
              </div>
              <div
                className="dm text-xs font-semibold"
                style={{ color: wp.major_gift_likelihood === "Very High" ? "#5BA67A" : "#C9A84C" }}
              >
                {wp.major_gift_likelihood}
              </div>
            </div>
            <div>
              <div className="lbl">
                <Tooltip text="Likelihood of an annual recurring gift based on consistent yearly giving to other orgs.">
                  Annual Gift
                </Tooltip>
              </div>
              <div className="dm text-xs font-semibold" style={{ color: "#5BA67A" }}>
                {wp.annual_gift_likelihood}
              </div>
            </div>
            <div>
              <div className="lbl">
                <Tooltip text="DonorSearch's recommended ask amount, calculated from confirmed giving to other orgs and total wealth indicators.">
                  Target Ask
                </Tooltip>
              </div>
              <div className="dm font-bold text-base" style={{ color: "#4B9CD3" }}>
                {fmt(wp.target_ask)}
              </div>
            </div>
            <div>
              <div className="lbl">
                <Tooltip text="Estimated net worth from real estate, SEC filings, business ownership.">
                  Est. Net Worth
                </Tooltip>
              </div>
              <div className="dm font-semibold text-sm">{wp.est_net_worth}</div>
            </div>
          </div>

          <div className="grid gap-6" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="dm text-[10px] uppercase tracking-wider" style={{ color: "#4B9CD3" }}>
                  <Tooltip text="Actual charitable gifts this person made to other organizations, verified through IRS 990 filings, annual reports, and donor lists.">
                    Confirmed Philanthropic Giving
                  </Tooltip>
                </div>
                <div className="dm text-xs font-bold" style={{ color: "#4B9CD3" }}>
                  {wp.external_total}
                </div>
              </div>
              <div>
                {wp.external_giving.map((g, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-1.5 border-b last:border-b-0"
                    style={{ borderColor: "rgba(255,255,255,0.03)" }}
                  >
                    <div className="min-w-0">
                      <div className="dm text-xs text-[color:var(--color-text-2)] truncate">
                        {g.org}
                      </div>
                      <div className="flex gap-1.5 items-center">
                        <span className="dm text-[10px] text-[color:var(--color-text-3)]">
                          {g.type} · {g.year}
                        </span>
                        <SourceTag source={g.source} />
                      </div>
                    </div>
                    <span className="dm text-xs font-semibold ml-2" style={{ color: "#C9A84C" }}>
                      {g.amount}
                    </span>
                  </div>
                ))}
              </div>
              {wp.foundation && (
                <div
                  className="mt-2 p-2 rounded text-[11px] dm"
                  style={{ background: "rgba(75,156,211,0.04)", color: "rgba(232,228,221,0.55)" }}
                >
                  <span style={{ color: "#4B9CD3", fontWeight: 500 }}>Foundation: </span>
                  {wp.foundation}
                </div>
              )}
            </div>

            <div>
              <div className="dm text-[10px] uppercase tracking-wider text-[color:var(--color-text-3)] mb-2">
                Wealth Indicators
              </div>
              <div>
                <div className="lbl">
                  <Tooltip text="Real estate holdings sourced from public property records. Multiple properties indicate strong giving capacity.">
                    Real Estate ({wp.real_estate_total} total)
                  </Tooltip>
                </div>
                {wp.real_estate.map((r, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-1 border-b last:border-b-0"
                    style={{ borderColor: "rgba(255,255,255,0.02)" }}
                  >
                    <div>
                      <div className="dm text-[11px] text-[color:var(--color-text-2)]">
                        {r.location}
                      </div>
                      <div className="dm text-[9px] text-[color:var(--color-text-3)]">
                        {r.type}
                      </div>
                    </div>
                    <span className="dm text-[11px] text-[color:var(--color-text-3)]">
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <div className="lbl">
                  <Tooltip text="Political contributions from FEC filings. High political giving signals comfort with major financial commitments.">
                    Political Giving
                  </Tooltip>
                </div>
                <div className="dm text-xs text-[color:var(--color-text-2)]">
                  {wp.political_giving}
                </div>
              </div>
              <div className="mt-2">
                <div className="lbl">
                  <Tooltip text="Nonprofit board memberships indicate deep philanthropic engagement.">
                    Board Affiliations
                  </Tooltip>
                </div>
                {wp.boards.map((b, i) => (
                  <div key={i} className="dm text-[11px] text-[color:var(--color-text-2)] py-0.5">
                    · {b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {upgrade && wp && (
        <Card
          glow
          className="!border-[rgba(75,156,211,0.3)]"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base" aria-hidden>↑</span>
            <span className="text-sm font-bold" style={{ color: "#4B9CD3" }}>
              STRONG CANDIDATE — {upgrade.target_tier} ({fmt(upgrade.target_ask)})
            </span>
          </div>
          <p className="dm text-xs text-[color:var(--color-text-2)] leading-relaxed">
            DonorSearch confirms {wp.external_total} in verified giving across{" "}
            {wp.external_giving.length} similar orgs — {Math.round(wp.target_ask / c.tier_amount)}x
            current WWS gift. MLR Score {wp.mlr_score}. {upgrade.signal}.
          </p>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="section-hdr">WWS Gift History</div>
          {c.gifts.length === 0 ? (
            <div className="dm text-xs text-[color:var(--color-text-3)]">
              No gifts on record.
            </div>
          ) : (
            c.gifts.map((g, i) => (
              <div
                key={i}
                className="flex justify-between py-1.5 border-b last:border-b-0"
                style={{ borderColor: "rgba(255,255,255,0.04)" }}
              >
                <div>
                  <div className="dm text-xs">{g.tier}</div>
                  <div className="dm text-[10px] text-[color:var(--color-text-3)]">
                    {g.year} · {g.method}
                  </div>
                </div>
                <span className="dm text-sm font-medium" style={{ color: "#C9A84C" }}>
                  ${g.amount.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </Card>

        <Card>
          <div className="section-hdr">Last 3 Communications</div>
          {[
            { date: "Mar 2026", channel: "Mailchimp", subject: "Spring Event Invite", status: "Opened" },
            { date: "Jan 2026", channel: "Paperless Post", subject: "Preview Night", status: "RSVP'd Yes" },
            { date: "Nov 2025", channel: "Mailchimp", subject: "Sponsorship Ask", status: "Opened" },
          ].map((m, i) => (
            <div
              key={i}
              className="py-1.5 border-b last:border-b-0"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              <div className="dm text-xs">{m.subject}</div>
              <div className="flex justify-between">
                <span className="dm text-[10px] text-[color:var(--color-text-3)]">
                  {m.date} · {m.channel}
                </span>
                <span
                  className="dm text-[10px]"
                  style={{
                    color: m.status.includes("RSVP")
                      ? "#5BA67A"
                      : "rgba(232,228,221,0.45)",
                  }}
                >
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <div className="section-hdr">Address</div>
          <div className="dm text-xs text-[color:var(--color-text-2)] space-y-0.5">
            <div>{c.address}</div>
            <div>
              {c.city}, {c.state} {c.zip}
            </div>
            <div className="pt-1.5 text-[color:var(--color-text-3)]">{c.email}</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
