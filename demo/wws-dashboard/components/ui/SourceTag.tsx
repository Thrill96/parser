import { Tooltip } from "./Tooltip";

const SOURCES: Record<string, { label: string; cls: string; tip: string }> = {
  "990": {
    label: "IRS 990",
    cls: "src-990",
    tip:
      "Data from the organization's IRS Form 990 — a public tax filing all nonprofits must submit annually. Most reliable source of confirmed giving data.",
  },
  ar: {
    label: "Annual Report",
    cls: "src-ar",
    tip:
      "Data from the receiving organization's published annual report. Reliable, but may use giving ranges instead of exact amounts.",
  },
  dl: {
    label: "Donor List",
    cls: "src-dl",
    tip:
      "Data from public donor lists, event programs, or recognition walls. Confirms a relationship and general giving level.",
  },
};

export function SourceTag({ source }: { source: string }) {
  const s = SOURCES[source] ?? SOURCES.dl;
  return (
    <Tooltip text={s.tip} className="inline-block">
      <span className={`src-tag ${s.cls}`}>{s.label}</span>
    </Tooltip>
  );
}
