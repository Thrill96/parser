import type { ReactNode } from "react";
import { Card } from "./Card";

interface KpiProps {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  glow?: boolean;
  alert?: boolean;
  badge?: ReactNode;
}

export function Kpi({ label, value, sub, glow, alert, badge }: KpiProps) {
  const valueColor = alert
    ? "#DC3C3C"
    : glow
      ? "#4B9CD3"
      : "#E8E4DD";
  return (
    <Card
      glow={glow}
      className={alert ? "" : ""}
      {...(alert ? { style: { borderColor: "rgba(220,60,60,0.15)" } } : {})}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="section-hdr mb-0">{label}</div>
        {badge}
      </div>
      <div
        className="text-[28px] font-semibold leading-none mb-1.5"
        style={{ color: valueColor, fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      {sub && (
        <div className="dm text-[11px] text-[color:var(--color-text-3)]">
          {sub}
        </div>
      )}
    </Card>
  );
}
