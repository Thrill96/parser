"use client";
import { useState } from "react";
import type { Prospect, ZipStat } from "@/lib/types";
import { StarRating } from "@/components/ui/StarRating";
import { MlrBar } from "@/components/ui/MlrBar";
import { Tooltip } from "@/components/ui/Tooltip";

interface Props {
  prospects: Prospect[];
  zips: ZipStat[];
}

type SearchState = "idle" | "searching" | "results";

export function ProspectDiscovery({ prospects, zips }: Props) {
  const [zip, setZip] = useState<string>(zips[0]?.zip ?? "");
  const [state, setState] = useState<SearchState>("idle");
  const [revealed, setRevealed] = useState<number>(0);

  const visible = prospects.filter(
    (p) => zip === "all" || p.zip === zip || zip === "",
  );

  const search = async () => {
    setState("searching");
    setRevealed(0);
    await new Promise((r) => setTimeout(r, 700));
    setState("results");
    // Stream results in
    for (let i = 1; i <= visible.length; i++) {
      await new Promise((r) => setTimeout(r, 220));
      setRevealed(i);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[240px]">
          <div className="lbl">Target ZIP</div>
          <select
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            disabled={state === "searching"}
            className="dm w-full px-3 py-2 rounded text-sm"
            style={{
              background: "rgba(0,0,0,0.3)",
              color: "#E8E4DD",
              border: "1px solid rgba(75,156,211,0.25)",
            }}
          >
            <option value="">All target zips</option>
            {zips.map((z) => (
              <option key={z.zip} value={z.zip}>
                {z.zip} — {z.area} ({z.ds_matches} DS matches, {z.untapped_capacity} untapped)
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={search}
          disabled={state === "searching"}
          className="dm text-sm font-semibold px-4 py-2 rounded transition"
          style={{
            background: state === "searching" ? "rgba(75,156,211,0.2)" : "#4B9CD3",
            color: "#0B1120",
            opacity: state === "searching" ? 0.7 : 1,
          }}
        >
          {state === "searching" ? "Scanning…" : "Find prospects"}
        </button>
      </div>

      {state === "idle" && (
        <div
          className="rounded p-4 text-center dm text-xs text-[color:var(--color-text-3)]"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.06)" }}
        >
          Pick a target zip and run a search. Most concentrated DC-area zips for
          arts/preservation giving are pre-loaded.
        </div>
      )}

      {state === "searching" && (
        <div className="space-y-2">
          {[
            "Querying DonorSearch (240M+ gift records)…",
            "Filtering for arts/culture/preservation affinity…",
            "Cross-referencing against existing WWS constituents…",
            "Scoring by MLR and giving capacity…",
          ].map((step, i) => (
            <div
              key={i}
              className="dm text-xs text-[color:var(--color-text-2)] flex items-center gap-2"
              style={{ animation: `fadeUp ${0.2 + i * 0.18}s ease forwards` }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full pulse-soft"
                style={{ background: "#4B9CD3" }}
                aria-hidden
              />
              {step}
            </div>
          ))}
        </div>
      )}

      {state === "results" && (
        <div className="space-y-2">
          <div className="dm text-[11px] text-[color:var(--color-text-3)] flex justify-between">
            <span>{revealed} prospect{revealed !== 1 ? "s" : ""} found</span>
            <span>Sorted by DS rating · MLR Score</span>
          </div>
          {visible.slice(0, revealed).map((p, i) => (
            <div
              key={p.id}
              className="card flex flex-col md:flex-row md:items-center gap-3 fade-up"
              style={{
                borderColor: "rgba(75,156,211,0.25)",
                animation: `fadeUp 0.35s ease ${i * 0.04}s both`,
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(75,156,211,0.25), rgba(75,156,211,0.05))",
                  color: "#4B9CD3",
                  border: "1px solid rgba(75,156,211,0.3)",
                }}
                aria-hidden
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold">{p.name}</span>
                  <span className="dm text-[10px] text-[color:var(--color-text-3)]">
                    {p.zip} ({p.area})
                  </span>
                  <span
                    className="dm text-[10px] px-2 py-0.5 rounded font-semibold"
                    style={{
                      background: "rgba(75,156,211,0.1)",
                      color: "#4B9CD3",
                      border: "1px solid rgba(75,156,211,0.2)",
                    }}
                  >
                    Target: {p.target_tier}
                  </span>
                </div>
                <div className="grid gap-3 mt-2" style={{ gridTemplateColumns: "70px 110px 1fr 1fr" }}>
                  <div>
                    <div className="lbl">DS</div>
                    <StarRating rating={p.ds_rating} />
                  </div>
                  <div>
                    <div className="lbl">MLR</div>
                    <MlrBar score={p.mlr_score} />
                  </div>
                  <div>
                    <div className="lbl">
                      <Tooltip text="Total annual charitable giving confirmed via DonorSearch's database. Verified, not estimated.">
                        Confirmed Giving
                      </Tooltip>
                    </div>
                    <div className="dm text-xs font-semibold" style={{ color: "#4B9CD3" }}>
                      {p.confirmed_giving}
                    </div>
                  </div>
                  <div>
                    <div className="lbl">Largest gift</div>
                    <div className="dm text-[11px]" style={{ color: "#C9A84C" }}>
                      {p.largest_gift.amount} → {p.largest_gift.org}
                    </div>
                  </div>
                </div>
                <div className="dm text-[11px] mt-1.5 text-[color:var(--color-text-2)]">
                  <span className="text-[color:var(--color-text-3)]">Affinity: </span>
                  {p.affinity}
                </div>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  className="dm text-[11px] px-2.5 py-1.5 rounded font-medium"
                  style={{
                    background: "#4B9CD3",
                    color: "#0B1120",
                  }}
                >
                  Add to FY27 list
                </button>
                <button
                  className="dm text-[11px] px-2.5 py-1.5 rounded"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(232,228,221,0.65)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  Open profile
                </button>
              </div>
            </div>
          ))}
          {revealed === visible.length && visible.length > 0 && (
            <div
              className="rounded p-3 dm text-xs text-center"
              style={{
                background: "rgba(75,156,211,0.05)",
                border: "1px solid rgba(75,156,211,0.2)",
                color: "#4B9CD3",
              }}
            >
              ✓ {visible.length} prospects scored · ready for cultivation queue
            </div>
          )}
        </div>
      )}
    </div>
  );
}
