import { ConstituentsBrowser } from "./ConstituentsBrowser";
import { constituents, wealthProfiles } from "@/lib/data";

export default function ConstituentsPage() {
  // Lightweight projection passed to the client component
  const list = constituents.map((c) => ({
    id: c.id,
    name: c.name,
    tier: c.tier,
    tier_amount: c.tier_amount,
    lifetime_total: c.lifetime_total,
    city: c.city,
    state: c.state,
    zip: c.zip,
    last_gift_year: c.last_gift_year,
    is_eagle: c.is_eagle,
    has_wealth: !!wealthProfiles[c.id],
  }));

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-semibold mb-1">Profiles</h1>
        <p className="dm text-sm text-[color:var(--color-text-3)]">
          {constituents.length.toLocaleString()} constituents · search by name, zip, or tier
        </p>
      </header>
      <ConstituentsBrowser list={list} />
    </div>
  );
}
