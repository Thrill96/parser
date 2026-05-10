import { Card } from "@/components/ui/Card";
import { Tooltip } from "@/components/ui/Tooltip";
import { zipStats } from "@/lib/data";
import { fmt } from "@/lib/format";

export default function GeographyPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-semibold mb-1">Geography</h1>
        <p className="dm text-sm text-[color:var(--color-text-3)] max-w-3xl">
          Donor concentration and{" "}
          <Tooltip text="Philanthropic Density measures not just how many wealthy people live in a zip code, but how many of them are actively giving to arts, culture, and preservation causes.">
            philanthropic density
          </Tooltip>{" "}
          by zip code. DonorSearch surfaces untapped capacity — places where
          arts/preservation givers cluster but WWS has zero reach.
        </p>
      </header>

      <Card>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div className="section-hdr mb-0">
            Donor Concentration + Untapped Capacity
          </div>
          <Tooltip text="Each row enriched with DonorSearch data showing verified philanthropic activity in that zip code.">
            <span className="ds-tag">DS Enriched</span>
          </Tooltip>
        </div>

        <div
          className="dm text-[10px] uppercase tracking-wider grid items-center gap-2 px-2 py-2 border-b"
          style={{
            gridTemplateColumns: "60px 1.5fr 60px 80px 80px 70px 90px",
            color: "rgba(232,228,221,0.35)",
            borderColor: "rgba(255,255,255,0.04)",
          }}
        >
          <div>ZIP</div>
          <div>Area</div>
          <div className="text-center">Donors</div>
          <div>Giving</div>
          <div>Wealth</div>
          <div className="text-center">
            <Tooltip text="Number of people in this zip with confirmed giving to arts/culture/preservation orgs.">
              DS Match
            </Tooltip>
          </div>
          <div>
            <Tooltip text="Estimated total giving capacity of untapped DS Matches in this zip — based on confirmed giving to other orgs.">
              Untapped $
            </Tooltip>
          </div>
        </div>

        {zipStats.map((z, i) => {
          const hot = z.ds_matches > 30;
          return (
            <div
              key={z.zip}
              className="row-hover grid items-center gap-2 px-2 py-2.5 text-sm border-b last:border-b-0"
              style={{
                gridTemplateColumns: "60px 1.5fr 60px 80px 80px 70px 90px",
                background: hot ? "rgba(75,156,211,0.02)" : undefined,
                borderColor: "rgba(255,255,255,0.03)",
                animation: `fadeUp ${0.15 + i * 0.02}s ease forwards`,
              }}
            >
              <div className="dm text-xs font-semibold" style={{ color: "#C9A84C" }}>
                {z.zip}
              </div>
              <div className="dm text-xs text-[color:var(--color-text-2)]">
                {z.area}
              </div>
              <div className="dm text-xs text-[color:var(--color-text-3)] text-center">
                {z.donors}
              </div>
              <div className="dm text-xs font-medium" style={{ color: "#C9A84C" }}>
                {fmt(z.giving)}
              </div>
              <div
                className="dm text-[11px] font-medium"
                style={{
                  color: z.wealth === "Very High" ? "#4B9CD3" : "#C9A84C",
                }}
              >
                {z.wealth}
              </div>
              <div
                className="dm text-xs text-center"
                style={{
                  color: hot ? "#4B9CD3" : "rgba(232,228,221,0.5)",
                  fontWeight: hot ? 600 : 400,
                }}
              >
                {z.ds_matches}
              </div>
              <div
                className="dm text-xs"
                style={{
                  color: hot ? "#4B9CD3" : "rgba(232,228,221,0.5)",
                  fontWeight: hot ? 600 : 400,
                }}
              >
                {z.untapped_capacity}
              </div>
            </div>
          );
        })}
      </Card>

      <Card glow>
        <div className="dm text-[11px] uppercase tracking-widest mb-3" style={{ color: "#4B9CD3" }}>
          <Tooltip text="DS Matches are individuals in each zip code with verified charitable giving to arts/culture/preservation orgs. Real donors writing real checks to causes like yours.">
            What &ldquo;DS Matches&rdquo; Means
          </Tooltip>
        </div>
        <div className="dm text-xs leading-relaxed text-[color:var(--color-text-2)]">
          DS Matches are individuals in each zip code who have{" "}
          <span style={{ color: "#4B9CD3", fontWeight: 600 }}>
            confirmed charitable giving to arts, culture, or historic preservation
            organizations
          </span>{" "}
          in DonorSearch&rsquo;s database of 240M+ gift records. These aren&rsquo;t
          just wealthy residents — they&rsquo;re proven philanthropic givers to
          causes like yours. Potomac alone has{" "}
          <span style={{ color: "#4B9CD3" }}>61 DS Matches with zero WWS relationship</span>.
          McLean has 48. People already writing five- and six-figure checks to
          Smithsonian, Phillips Collection, and the National Trust.
        </div>
      </Card>
    </div>
  );
}
