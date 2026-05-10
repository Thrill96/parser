"use client";
import { useState } from "react";
import type { Unmatched } from "@/lib/types";
import { fmtCurrency, relativeTime } from "@/lib/format";

type State = "pending" | "resolving" | "resolved";

interface ItemState {
  state: State;
  resolution?: string;
}

export function UnmatchedQueue({ items }: { items: Unmatched[] }) {
  const [states, setStates] = useState<Record<string, ItemState>>(() =>
    Object.fromEntries(items.map((i) => [i.id, { state: "pending" }])),
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = items.find((i) => i.id === activeId);

  const resolve = async (id: string, action: string) => {
    setStates((s) => ({ ...s, [id]: { state: "resolving" } }));
    setActiveId(null);
    await new Promise((r) => setTimeout(r, 1100));
    setStates((s) => ({ ...s, [id]: { state: "resolved", resolution: action } }));
  };

  return (
    <div className="space-y-3">
      {items.map((it) => {
        const s = states[it.id]?.state ?? "pending";
        const resolution = states[it.id]?.resolution;
        const isActive = activeId === it.id;
        return (
          <div
            key={it.id}
            className={`card transition-all ${s === "resolving" ? "slide-out-left" : ""}`}
            style={{
              borderColor:
                s === "resolved"
                  ? "rgba(91,166,122,0.4)"
                  : s === "pending"
                    ? "rgba(220,60,60,0.18)"
                    : undefined,
              background:
                s === "resolved" ? "rgba(91,166,122,0.04)" : undefined,
            }}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className="dm text-[10px] uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{
                      background:
                        s === "resolved"
                          ? "rgba(91,166,122,0.12)"
                          : "rgba(220,60,60,0.08)",
                      color: s === "resolved" ? "#5BA67A" : "#DC3C3C",
                    }}
                  >
                    {s === "resolved" ? "Resolved" : s === "resolving" ? "Resolving…" : "Pending"}
                  </span>
                  <span className="dm text-[11px] text-[color:var(--color-text-3)]">
                    Squarespace · {it.source_ref} · {relativeTime(it.received_at)}
                  </span>
                </div>
                <div className="text-lg font-semibold">
                  {it.customer_name} —{" "}
                  <span style={{ color: "#C9A84C" }}>
                    {fmtCurrency(it.amount)}
                  </span>
                </div>
                <div className="dm text-xs text-[color:var(--color-text-2)]">
                  {it.customer_email} · {it.reason}
                </div>
                {resolution && (
                  <div
                    className="dm text-xs mt-2 inline-flex items-center gap-1.5"
                    style={{ color: "#5BA67A" }}
                  >
                    ✓ {resolution} · synced to eTapestry · logged journal entry
                  </div>
                )}
              </div>
              {s === "pending" && (
                <button
                  onClick={() => setActiveId(isActive ? null : it.id)}
                  className="dm text-xs font-medium px-3 py-2 rounded transition"
                  style={{
                    background: "rgba(75,156,211,0.12)",
                    color: "#4B9CD3",
                    border: "1px solid rgba(75,156,211,0.3)",
                  }}
                >
                  {isActive ? "Cancel" : "Resolve"}
                </button>
              )}
            </div>
          </div>
        );
      })}

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Resolve unmatched transaction"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(11,17,32,0.7)", backdropFilter: "blur(4px)" }}
          onClick={() => setActiveId(null)}
        >
          <div
            className="card w-full max-w-lg space-y-4"
            style={{
              borderColor: "rgba(75,156,211,0.3)",
              boxShadow: "0 16px 80px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="dm text-[10px] uppercase tracking-widest text-[color:var(--color-ds)]">
                Squarespace Order
              </div>
              <div className="text-xl font-semibold mt-1">
                {active.customer_name}
              </div>
              <div className="dm text-xs text-[color:var(--color-text-2)]">
                {active.customer_email} · {fmtCurrency(active.amount)} ·{" "}
                {active.source_ref}
              </div>
            </div>

            {active.match_suggestion ? (
              <div
                className="rounded p-3"
                style={{
                  background: "rgba(75,156,211,0.08)",
                  border: "1px solid rgba(75,156,211,0.25)",
                }}
              >
                <div className="dm text-[10px] uppercase tracking-widest" style={{ color: "#4B9CD3" }}>
                  Probable Match
                </div>
                <div className="text-sm font-medium mt-1">
                  {active.match_suggestion}
                </div>
                <div className="dm text-[11px] text-[color:var(--color-text-3)]">
                  Confidence: {active.match_confidence}% · email differs from existing record
                </div>
              </div>
            ) : (
              <div
                className="rounded p-3"
                style={{
                  background: "rgba(232,228,221,0.04)",
                  border: "1px solid rgba(232,228,221,0.12)",
                }}
              >
                <div className="dm text-[11px] text-[color:var(--color-text-2)]">
                  No likely match in eTapestry. {active.reason}.
                </div>
              </div>
            )}

            <div className="space-y-2">
              {active.match_suggestion && (
                <button
                  onClick={() =>
                    resolve(active.id, `Matched to ${active.match_suggestion}`)
                  }
                  className="w-full dm text-sm font-medium py-2.5 rounded transition"
                  style={{
                    background: "#4B9CD3",
                    color: "#0B1120",
                  }}
                >
                  Match to {active.match_suggestion}
                </button>
              )}
              <button
                onClick={() =>
                  resolve(active.id, "Created new constituent + logged gift")
                }
                className="w-full dm text-sm font-medium py-2.5 rounded transition"
                style={{
                  background: "rgba(75,156,211,0.12)",
                  color: "#4B9CD3",
                  border: "1px solid rgba(75,156,211,0.3)",
                }}
              >
                Create new constituent + log gift
              </button>
              <button
                onClick={() => setActiveId(null)}
                className="w-full dm text-xs py-2 rounded text-[color:var(--color-text-3)] hover:text-[color:var(--color-text-2)]"
              >
                Cancel
              </button>
            </div>

            <div
              className="dm text-[10px] text-[color:var(--color-text-3)] flex items-start gap-2 pt-2 border-t"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              <span aria-hidden>ⓘ</span>
              <span>
                Resolution writes to eTapestry via API and adds a journal entry to the constituent record.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
