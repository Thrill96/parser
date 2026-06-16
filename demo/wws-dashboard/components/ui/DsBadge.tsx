import { Tooltip } from "./Tooltip";

export function DsBadge({ rating }: { rating: number }) {
  return (
    <Tooltip text="DonorSearch Rating (1-5). Composite score of donor potential based on confirmed giving history, wealth indicators, real estate, and philanthropic patterns. 5 = exceptional. 4 = strong. 3 = solid.">
      <span
        className="dm inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded"
        style={{
          background: "rgba(75,156,211,0.12)",
          color: "#4B9CD3",
          border: "1px solid rgba(75,156,211,0.25)",
        }}
      >
        DS: {rating}/5
      </span>
    </Tooltip>
  );
}
