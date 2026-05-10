import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  as?: "div" | "section" | "article";
}

export function Card({
  children,
  className = "",
  glow = false,
  as: Tag = "div",
}: CardProps) {
  return (
    <Tag className={`card ${glow ? "ds-glow" : ""} ${className}`}>
      {children}
    </Tag>
  );
}
