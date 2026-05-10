"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/geography", label: "Geography" },
  { href: "/upgrades", label: "↑ Upgrades" },
  { href: "/prospecting", label: "🎯 Prospecting" },
  { href: "/events", label: "Events" },
  { href: "/constituents", label: "Profiles" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className="sticky top-0 z-50 px-7 py-4 flex items-center justify-between border-b"
        style={{
          background: "linear-gradient(135deg, #0B1120, #14213D)",
          borderColor: "rgba(201,168,76,0.2)",
        }}
      >
        <Link href="/" className="flex items-center gap-4 group">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold"
            style={{
              background: "linear-gradient(135deg, #C9A84C, #8B6914)",
              color: "#0B1120",
            }}
            aria-hidden
          >
            W
          </div>
          <div>
            <div
              className="text-base font-semibold tracking-wider"
              style={{ color: "#C9A84C", letterSpacing: "0.05em" }}
            >
              WASHINGTON WINTER SHOW
            </div>
            <div className="dm text-[11px] uppercase tracking-[0.15em] text-[color:var(--color-text-3)]">
              Donor Intelligence Dashboard
            </div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/sync"
            className="flex items-center gap-2 px-3 py-1.5 rounded border transition-colors"
            style={{
              background: "rgba(75,156,211,0.08)",
              borderColor: "rgba(75,156,211,0.2)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full pulse-soft"
              style={{ background: "#4B9CD3" }}
            />
            <span
              className="dm text-[10px] font-medium"
              style={{ color: "#4B9CD3" }}
            >
              DonorSearch Connected
            </span>
          </Link>
          <Link
            href="/sync"
            className="flex items-center gap-2 px-3 py-1.5 rounded border transition-colors"
            style={{
              background: "rgba(91,166,122,0.08)",
              borderColor: "rgba(91,166,122,0.2)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full pulse-soft"
              style={{ background: "#5BA67A" }}
            />
            <span
              className="dm text-[10px] font-medium"
              style={{ color: "#5BA67A" }}
            >
              Auto-Sync · Last 14 min ago
            </span>
          </Link>
        </div>
      </header>

      <nav
        className="px-7 py-3 flex gap-1 overflow-x-auto border-b"
        style={{ borderColor: "rgba(255,255,255,0.04)" }}
        aria-label="Main"
      >
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`dm whitespace-nowrap text-xs font-medium px-3.5 py-1.5 rounded-md border transition-all ${
                active
                  ? "border-[color:rgba(201,168,76,0.5)] bg-[color:rgba(201,168,76,0.12)] text-[color:var(--color-gold)]"
                  : "border-transparent text-[color:var(--color-text-3)] hover:text-[color:var(--color-text-2)]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <main className="flex-1 px-7 py-6 max-w-[1280px] w-full mx-auto fade-up">
        {children}
      </main>

      <footer
        className="mt-8 px-7 py-4 border-t flex flex-col sm:flex-row sm:justify-between gap-2"
        style={{ borderColor: "rgba(201,168,76,0.1)" }}
      >
        <span className="dm text-[11px] text-[color:var(--color-text-4)]">
          Data: eTapestry · SquareSpace · Mailchimp · Gmail · DonorSearch · Auto-Sync Active
        </span>
        <span className="dm text-[11px] text-[color:var(--color-text-4)]">
          Demo build · Mock data
        </span>
      </footer>
    </>
  );
}
