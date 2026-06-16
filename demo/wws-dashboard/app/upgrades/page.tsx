import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Kpi } from "@/components/ui/Kpi";
import { StarRating } from "@/components/ui/StarRating";
import { MlrBar } from "@/components/ui/MlrBar";
import { Tooltip } from "@/components/ui/Tooltip";
import {
  upgradeCandidates,
  getConstituent,
  tierColor,
} from "@/lib/data";
import { fmt } from "@/lib/format";

export default function UpgradesPage() {
  const total = upgradeCandidates.reduce((s, u) => s + u.gap, 0);
  const avgMlr = Math.round(
    upgradeCandidates.reduce((s, u) => s + u.mlr_score, 0) / upgradeCandidates.length,
  );

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-semibold mb-1">Upgrade Candidates</h1>
        <p className="dm text-sm text-[color:var(--color-text-3)] max-w-3xl">
          Existing sponsors whose DonorSearch profile shows they give significantly
          more to similar organizations than they currently give to WWS. Auto-flagged
          by comparing WWS gift against confirmed external philanthropic giving.
        </p>
      </header>

      <section
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}
      >
        <Kpi
          glow
          label="Candidates"
          value={String(upgradeCandidates.length)}
          sub="verified by DonorSearch"
        />
        <Kpi glow label="Total upgrade revenue" value={fmt(total)} sub="if all convert" />
        <Kpi
          label={
            <Tooltip text="Most Likely to Respond — DonorSearch's AI score. 80+ very likely; 65–80 likely.">
              Avg MLR Score
            </Tooltip>
          }
          value={String(avgMlr)}
        />
      </section>

      <Card>
        <div className="section-hdr">Ranked by MLR · DS Verified</div>
        {upgradeCandidates.map((u) => {
          const c = getConstituent(u.constituent_id);
          if (!c) return null;
          return (
            <Link
              href={`/constituents/${c.id}`}
              key={u.constituent_id}
              className="row-hover block py-3 px-2 border-b last:border-b-0"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold">{c.name}</span>
                  <span
                    className="dm text-[10px] px-2 py-0.5 rounded"
                    style={{
                      background: `${tierColor(u.current_tier)}18`,
                      color: tierColor(u.current_tier),
                    }}
                  >
                    {u.current_tier}
                  </span>
                  <span className="text-sm" style={{ color: "rgba(232,228,221,0.3)" }}>
                    →
                  </span>
                  <span
                    className="dm text-[10px] px-2 py-0.5 rounded font-semibold"
                    style={{ background: "rgba(75,156,211,0.1)", color: "#4B9CD3" }}
                  >
                    {u.target_tier}
                  </span>
                </div>
                <span className="dm text-base font-bold" style={{ color: "#4B9CD3" }}>
                  +{fmt(u.gap)}
                </span>
              </div>
              <div
                className="grid gap-3 items-center"
                style={{ gridTemplateColumns: "80px 110px 80px 1fr" }}
              >
                <div>
                  <div className="lbl">DS</div>
                  <StarRating rating={u.ds_rating} />
                </div>
                <div>
                  <div className="lbl">MLR</div>
                  <MlrBar score={u.mlr_score} />
                </div>
                <div>
                  <div className="lbl">Target ask</div>
                  <div className="dm text-xs font-medium" style={{ color: "#C9A84C" }}>
                    {fmt(u.target_ask)}
                  </div>
                </div>
                <div>
                  <div className="lbl">Signal</div>
                  <div className="dm text-[11px] text-[color:var(--color-text-2)]">
                    {u.signal}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </Card>
    </div>
  );
}
