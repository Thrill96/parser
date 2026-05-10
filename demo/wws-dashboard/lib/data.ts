import constituentsJson from "./data/constituents.json";
import wealthProfilesJson from "./data/wealth-profiles.json";
import upgradeCandidatesJson from "./data/upgrade-candidates.json";
import prospectsJson from "./data/prospects.json";
import zipStatsJson from "./data/zip-stats.json";
import unmatchedJson from "./data/unmatched.json";
import syncLogJson from "./data/sync-log.json";
import eventsJson from "./data/events.json";
import type {
  Constituent,
  WealthProfile,
  UpgradeCandidate,
  Prospect,
  ZipStat,
  Unmatched,
  SyncLogEntry,
  WWSEvent,
} from "./types";

export const constituents = constituentsJson as Constituent[];
export const wealthProfiles = wealthProfilesJson as Record<string, WealthProfile>;
export const upgradeCandidates = upgradeCandidatesJson as UpgradeCandidate[];
export const prospects = prospectsJson as Prospect[];
export const zipStats = zipStatsJson as ZipStat[];
export const unmatched = unmatchedJson as Unmatched[];
export const syncLog = syncLogJson as SyncLogEntry[];
export const events = eventsJson as WWSEvent[];

export function getConstituent(id: string): Constituent | undefined {
  return constituents.find((c) => c.id === id);
}

export function getWealthProfile(id: string): WealthProfile | undefined {
  return wealthProfiles[id];
}

export const tierOrder = [
  "Presenting Eagle",
  "Platinum Eagle",
  "Gold Eagle",
  "Silver Eagle",
  "Bronze Eagle",
  "Benefactor",
  "Patron",
  "Bronze",
  "YCC",
  "Luncheon",
  "Design Panel",
  "Saturday Lecture",
  "Sunday Lecture",
  "General Admission",
];

export function tierColor(tier: string): string {
  const map: Record<string, string> = {
    "Presenting Eagle": "#C9A84C",
    "Platinum Eagle": "#A0A7B5",
    "Gold Eagle": "#D4A94B",
    "Silver Eagle": "#8A939F",
    "Bronze Eagle": "#B87A4B",
    Benefactor: "#C9A84C",
    Patron: "#D4A94B",
    Bronze: "#B87A4B",
    YCC: "#4B9CD3",
    Luncheon: "#A0A7B5",
    "Design Panel": "#8A939F",
  };
  return map[tier] ?? "#A0A7B5";
}

export function totalRevenueByYear(): Record<number, number> {
  const out: Record<number, number> = {};
  for (const c of constituents) {
    for (const g of c.gifts) {
      out[g.year] = (out[g.year] ?? 0) + g.amount;
    }
  }
  return out;
}

export function topConstituents(n: number): Constituent[] {
  return [...constituents]
    .sort((a, b) => b.lifetime_total - a.lifetime_total)
    .slice(0, n);
}
