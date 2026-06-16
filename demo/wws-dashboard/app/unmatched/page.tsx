import { unmatched } from "@/lib/data";
import { UnmatchedQueue } from "./UnmatchedQueue";

export default function UnmatchedPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-semibold mb-1">Unmatched Transactions</h1>
          <p className="dm text-sm text-[color:var(--color-text-3)]">
            Squarespace orders the system couldn&rsquo;t auto-match against eTapestry.
            Resolve to log the gift and update the donor record.
          </p>
        </div>
        <div
          className="card flex items-center gap-3 px-4 py-2"
          style={{ borderColor: "rgba(220,60,60,0.2)" }}
        >
          <span
            className="w-2 h-2 rounded-full pulse-soft"
            style={{ background: "#DC3C3C" }}
            aria-hidden
          />
          <span className="dm text-xs">
            {unmatched.length} pending · ${unmatched.reduce((s, u) => s + u.amount, 0).toLocaleString()} unreconciled
          </span>
        </div>
      </header>

      <UnmatchedQueue items={unmatched} />
    </div>
  );
}
