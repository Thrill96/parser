import type { ReactNode } from "react";

interface TooltipProps {
  text: string;
  children: ReactNode;
  className?: string;
}

export function Tooltip({ text, children, className = "" }: TooltipProps) {
  return (
    <span className={`tip ${className}`} tabIndex={0}>
      {children}
      <span className="tip-content" role="tooltip">
        {text}
      </span>
    </span>
  );
}
