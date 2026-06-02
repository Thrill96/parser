import Link from 'next/link';
import ProspectTool from '../components/ProspectTool.jsx';
import PromoteButton from '../components/PromoteButton.jsx';
import { scoreClass } from '../../lib/format.js';
import { getProspects } from '../../lib/dashboard-data.js';

export const dynamic = 'force-dynamic';

function oppClass(score) {
  // High opportunity = hot prospect = good (green).
  if (score >= 67) return 'good';
  if (score >= 34) return 'warn';
  return 'muted';
}

export default async function ProspectsPage() {
  let prospects = [];
  try {
    prospects = await getProspects();
  } catch {
    prospects = [];
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Prospecting</h1>
          <div className="sub">Bulk-audit businesses → ranked hit-list for outreach</div>
        </div>
        <Link href="/" className="pill" style={{ padding: '7px 12px' }}>
          ← Dashboard
        </Link>
      </div>

      <ProspectTool />

      <div className="panel">
        <h2>Hit-list — ranked by opportunity (worst AI visibility first)</h2>
        {prospects.length === 0 ? (
          <div className="muted">No prospects yet. Paste some above and audit them.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Business</th>
                <th>Opportunity</th>
                <th>AI visibility</th>
                <th>Schema</th>
                <th>AI recommends instead</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {prospects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.brand_name || p.domain}</strong>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {p.domain}
                      {p.location ? ` · ${p.location}` : ''}
                    </div>
                  </td>
                  <td>
                    <span className={`pill ${oppClass(p.opportunity_score)}`}>
                      {p.opportunity_score}
                    </span>
                  </td>
                  <td>
                    <span className={`pill ${scoreClass(p.ai_score)}`}>{p.ai_score}</span>
                    <span className="muted" style={{ fontSize: 11 }}>
                      {' '}
                      ({p.appeared}/{p.prompts_tested})
                    </span>
                  </td>
                  <td>
                    <span className={`pill ${scoreClass(p.schema_score)}`}>{p.schema_score}</span>
                  </td>
                  <td className="muted" style={{ fontSize: 12 }}>
                    {p.top_competitors && p.top_competitors.length
                      ? p.top_competitors.slice(0, 3).join(', ')
                      : '—'}
                  </td>
                  <td>
                    {p.promoted_domain_id ? (
                      <Link
                        href={`/?domain=${p.promoted_domain_id}`}
                        className="pill"
                        style={{ padding: '4px 10px' }}
                      >
                        View →
                      </Link>
                    ) : (
                      <PromoteButton prospect={p} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="muted" style={{ fontSize: 12, marginTop: 12 }}>
          <strong>Opportunity</strong> is highest when AI visibility and schema are both weak —
          i.e. the most to fix and the easiest to sell. <strong>Promote</strong> a hot prospect to
          run a full audit and generate their Shock Report.
        </p>
      </div>
    </div>
  );
}
