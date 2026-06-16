import { Card } from "@/components/ui/Card";
import { Tooltip } from "@/components/ui/Tooltip";
import { prospects, zipStats } from "@/lib/data";
import { ProspectDiscovery } from "./ProspectDiscovery";

export default function ProspectingPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-semibold mb-1">Prospect Discovery</h1>
        <p className="dm text-sm text-[color:var(--color-text-3)] max-w-3xl">
          Find people who match your ideal donor profile but have no relationship
          with WWS. Searches DonorSearch&rsquo;s database of 240M+ verified gift
          records by zip code, philanthropic interest, and giving capacity.
        </p>
      </header>

      <Card glow>
        <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
          <div className="text-base font-semibold">
            <Tooltip text="Filter prospects by their home zip code. We pre-loaded the DC-area zips with the highest untapped capacity.">
              Discover by ZIP
            </Tooltip>
          </div>
          <Tooltip text="DonorSearch scans 240M+ charitable gift records to find untapped donors in your target geographies.">
            <span className="ds-tag">DonorSearch Discovery</span>
          </Tooltip>
        </div>
        <ProspectDiscovery prospects={prospects} zips={zipStats.slice(0, 10)} />
      </Card>
    </div>
  );
}
