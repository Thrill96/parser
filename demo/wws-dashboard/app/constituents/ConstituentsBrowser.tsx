"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { fmt } from "@/lib/format";

type Item = {
  id: string;
  name: string;
  tier: string;
  tier_amount: number;
  lifetime_total: number;
  city: string;
  state: string;
  zip: string;
  last_gift_year: number;
  is_eagle: boolean;
  has_wealth: boolean;
};

const TIER_FILTERS = [
  "All",
  "Eagle Sponsors",
  "Benefactor",
  "Patron",
  "YCC",
  "Has DS Profile",
];

export function ConstituentsBrowser({ list }: { list: Item[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [limit, setLimit] = useState(50);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return list
      .filter((c) => {
        if (filter === "Eagle Sponsors" && !c.is_eagle) return false;
        if (filter === "Has DS Profile" && !c.has_wealth) return false;
        if (
          filter !== "All" &&
          filter !== "Eagle Sponsors" &&
          filter !== "Has DS Profile" &&
          c.tier !== filter
        )
          return false;
        if (!ql) return true;
        return (
          c.name.toLowerCase().includes(ql) ||
          c.zip.includes(ql) ||
          c.city.toLowerCase().includes(ql) ||
          c.tier.toLowerCase().includes(ql)
        );
      })
      .sort((a, b) => b.lifetime_total - a.lifetime_total);
  }, [list, q, filter]);

  const visible = filtered.slice(0, limit);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, zip, city…"
          className="dm flex-1 min-w-[220px] px-3 py-2 rounded text-sm"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(201,168,76,0.18)",
            color: "#E8E4DD",
          }}
        />
        <div className="flex flex-wrap gap-1.5">
          {TIER_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className="dm text-[11px] px-2.5 py-1.5 rounded font-medium transition"
              style={
                filter === t
                  ? {
                      background: "rgba(201,168,76,0.14)",
                      border: "1px solid rgba(201,168,76,0.4)",
                      color: "#C9A84C",
                    }
                  : {
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "rgba(232,228,221,0.55)",
                    }
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="dm text-[11px] text-[color:var(--color-text-3)]">
        {filtered.length} matches{filtered.length > limit ? ` · showing first ${limit}` : ""}
      </div>

      <div className="card !p-0 overflow-hidden">
        <div
          className="dm text-[10px] uppercase tracking-wider grid items-center gap-2 px-4 py-2 border-b"
          style={{
            gridTemplateColumns: "1.6fr 1fr 0.7fr 0.7fr 0.6fr",
            color: "rgba(232,228,221,0.35)",
            borderColor: "rgba(255,255,255,0.04)",
          }}
        >
          <div>Name</div>
          <div>Tier</div>
          <div>Lifetime</div>
          <div>Last gift</div>
          <div>City</div>
        </div>
        {visible.map((c, i) => (
          <Link
            key={c.id}
            href={`/constituents/${c.id}`}
            className="row-hover grid items-center gap-2 px-4 py-2.5 text-sm border-b last:border-b-0"
            style={{
              gridTemplateColumns: "1.6fr 1fr 0.7fr 0.7fr 0.6fr",
              borderColor: "rgba(255,255,255,0.04)",
              animation: `fadeUp ${0.2 + i * 0.005}s ease forwards`,
            }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="truncate">{c.name}</span>
              {c.has_wealth && (
                <span
                  className="dm text-[9px] px-1.5 py-0.5 rounded shrink-0"
                  style={{
                    background: "rgba(75,156,211,0.1)",
                    color: "#4B9CD3",
                    border: "1px solid rgba(75,156,211,0.25)",
                  }}
                  aria-label="Has DonorSearch profile"
                >
                  DS
                </span>
              )}
            </div>
            <div className="dm text-xs text-[color:var(--color-text-2)]">
              {c.tier}
            </div>
            <div className="dm font-medium" style={{ color: "#C9A84C" }}>
              {fmt(c.lifetime_total)}
            </div>
            <div className="dm text-xs text-[color:var(--color-text-3)]">
              {c.last_gift_year}
            </div>
            <div className="dm text-xs text-[color:var(--color-text-3)]">
              {c.city}
            </div>
          </Link>
        ))}
        {visible.length === 0 && (
          <div className="dm text-sm text-[color:var(--color-text-3)] py-12 text-center">
            No constituents match these filters.
          </div>
        )}
      </div>

      {filtered.length > limit && (
        <button
          onClick={() => setLimit((l) => l + 50)}
          className="dm text-xs px-3 py-2 rounded mx-auto block"
          style={{
            background: "rgba(75,156,211,0.08)",
            color: "#4B9CD3",
            border: "1px solid rgba(75,156,211,0.25)",
          }}
        >
          Show more
        </button>
      )}
    </div>
  );
}
