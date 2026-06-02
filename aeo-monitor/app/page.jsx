import ScoreCard from './components/ScoreCard.jsx';
import EngineBreakdown from './components/EngineBreakdown.jsx';
import SchemaCard from './components/SchemaCard.jsx';
import TrendChart from './components/TrendChart.jsx';
import ResultsTable from './components/ResultsTable.jsx';
import CompetitorView from './components/CompetitorView.jsx';
import Recommendations from './components/Recommendations.jsx';
import RunScanButton from './components/RunScanButton.jsx';
import DomainSwitcher from './components/DomainSwitcher.jsx';
import Link from 'next/link';
import {
  getPrimaryDomain,
  getAllDomains,
  getDomainById,
  getLatestVisibility,
  getVisibilityTrend,
  getLatestResults,
  getLatestSchemaAudit,
  getCompetitorStats,
  getLatestRecommendations,
} from '../lib/dashboard-data.js';

export const dynamic = 'force-dynamic';

function SetupNotice({ error }) {
  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>AEO Monitor</h1>
          <div className="sub">AI Engine Optimization tracking</div>
        </div>
      </div>
      <div className="empty">
        <h2 style={{ color: 'var(--text)' }}>Not configured yet</h2>
        <p>
          The database isn&apos;t reachable or no domain has been seeded.
          {error ? (
            <>
              <br />
              <code style={{ color: 'var(--bad)' }}>{error}</code>
            </>
          ) : null}
        </p>
        <p className="muted" style={{ maxWidth: 560, margin: '0 auto' }}>
          Set <code>TURSO_DATABASE_URL</code> (and <code>TURSO_AUTH_TOKEN</code> for a hosted DB),
          then run <code>npm run db:init</code> and <code>npm run db:seed</code>. See the README.
        </p>
      </div>
    </div>
  );
}

export default async function Dashboard({ searchParams }) {
  let domains;
  try {
    domains = await getAllDomains();
  } catch (err) {
    return <SetupNotice error={err.message} />;
  }
  if (!domains || domains.length === 0) return <SetupNotice />;

  const requestedId = searchParams?.domain ? Number(searchParams.domain) : null;
  const domain =
    (requestedId && (await getDomainById(requestedId))) || (await getPrimaryDomain());
  if (!domain) return <SetupNotice />;

  const [visibility, trend, results, schema, competitors, recommendations] = await Promise.all([
    getLatestVisibility(domain.id),
    getVisibilityTrend(domain.id, 12),
    getLatestResults(domain.id),
    getLatestSchemaAudit(domain.id),
    getCompetitorStats(domain.id),
    getLatestRecommendations(domain.id),
  ]);

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>AEO Monitor — {domain.brand_name}</h1>
          <div className="sub">
            {domain.domain}
            {domain.service_category ? ` · ${domain.service_category}` : ''}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <DomainSwitcher domains={domains} currentId={domain.id} />
          <Link href={`/report?domain=${domain.id}`} className="pill" style={{ padding: '7px 12px' }}>
            Client Report →
          </Link>
          <Link href={`/fix-pack?domain=${domain.id}`} className="pill" style={{ padding: '7px 12px' }}>
            Fix Pack →
          </Link>
          <RunScanButton domainId={domain.id} />
        </div>
      </div>

      <div className="grid cols-2" style={{ marginBottom: 16 }}>
        <ScoreCard
          score={visibility?.overall_score ?? null}
          competitorDisplacement={visibility?.competitor_displacement ?? null}
          scoreDate={visibility?.score_date}
        />
        <SchemaCard audit={schema} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <EngineBreakdown visibility={visibility} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Recommendations data={recommendations} />
      </div>

      <div className="panel" style={{ marginBottom: 16 }}>
        <h2>Visibility Trend (last 12 scans)</h2>
        <TrendChart data={trend} />
      </div>

      <div className="grid cols-2" style={{ marginBottom: 16 }}>
        <div className="panel">
          <h2>Prompt Results — latest run</h2>
          <ResultsTable rows={results} />
        </div>
        <CompetitorView competitors={competitors} />
      </div>
    </div>
  );
}
