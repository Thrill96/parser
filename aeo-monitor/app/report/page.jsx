import Link from 'next/link';
import PrintButton from '../components/PrintButton.jsx';
import { scoreColor } from '../../lib/format.js';
import { scoreVerdict, buyerIntentStats, lossLine } from '../../lib/report.js';
import { reportConfig } from '../../lib/report-config.js';
import {
  getPrimaryDomain,
  getDomainById,
  getLatestVisibility,
  getLatestResults,
  getCompetitorStats,
} from '../../lib/dashboard-data.js';
import { ENGINE_IDS, ENGINE_LABELS } from '../../lib/engines/index.js';

export const dynamic = 'force-dynamic';

// Pull a few buyer-intent prompts to show as proof.
function proofRows(results) {
  const byPrompt = new Map();
  for (const r of results) {
    if (!['recommendation', 'comparison', 'direct'].includes(r.prompt_type)) continue;
    const cur = byPrompt.get(r.prompt_text) || { prompt: r.prompt_text, appeared: false, comps: new Set() };
    if (r.brand_mentioned) cur.appeared = true;
    let comps = [];
    try {
      comps = Array.isArray(r.competitor_mentioned)
        ? r.competitor_mentioned
        : JSON.parse(r.competitor_mentioned || '[]');
    } catch {
      comps = [];
    }
    comps.forEach((c) => cur.comps.add(c));
    byPrompt.set(r.prompt_text, cur);
  }
  return [...byPrompt.values()].slice(0, 6).map((p) => ({ ...p, comps: [...p.comps].slice(0, 4) }));
}

export default async function ReportPage({ searchParams }) {
  const cfg = reportConfig();
  const requestedId = searchParams?.domain ? Number(searchParams.domain) : null;
  let domain;
  try {
    domain = (requestedId && (await getDomainById(requestedId))) || (await getPrimaryDomain());
  } catch {
    domain = null;
  }
  if (!domain) {
    return (
      <div className="container">
        <div className="empty">No site found. Add a site and run a scan first.</div>
      </div>
    );
  }

  const [visibility, results, competitors] = await Promise.all([
    getLatestVisibility(domain.id),
    getLatestResults(domain.id),
    getCompetitorStats(domain.id),
  ]);

  const score = visibility?.overall_score ?? null;
  const verdict = scoreVerdict(score);
  const stats = buyerIntentStats(results);
  const proof = proofRows(results);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="container">
      <div className="header no-print">
        <div className="muted" style={{ fontSize: 13 }}>
          Prospect-facing report · share or print it
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href={`/?domain=${domain.id}`} className="pill" style={{ padding: '7px 12px' }}>
            ← Dashboard
          </Link>
          <PrintButton />
        </div>
      </div>

      {/* HERO — the punch */}
      <div className="report-hero">
        <div className="report-kicker">{cfg.brand} · AI Visibility Report</div>
        <div className="report-headline">
          {stats.appeared === 0 && stats.total > 0
            ? `AI is recommending competitors instead of ${domain.brand_name}.`
            : `How AI engines see ${domain.brand_name}.`}
        </div>
        <div className="muted" style={{ fontSize: 14 }}>
          {domain.domain}
          {domain.service_category ? ` · ${domain.service_category}` : ''} · {today}
        </div>

        <div className="report-score-wrap">
          <div>
            <div className="bignum" style={{ color: scoreColor(score), fontSize: 72 }}>
              {score == null ? '—' : score}
              <span className="max"> / 100</span>
            </div>
            <span className={`pill ${verdict.tone}`} style={{ marginTop: 6 }}>
              {verdict.label}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <p style={{ fontSize: 16, margin: 0 }}>{verdict.blurb}</p>
            <p style={{ fontSize: 15, marginBottom: 0, color: 'var(--text)' }}>
              <strong>{lossLine(stats, domain.brand_name)}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* WHO AI RECOMMENDS INSTEAD */}
      <div className="panel" style={{ marginBottom: 16 }}>
        <h2>Who AI recommends in your category</h2>
        {competitors && competitors.length > 0 ? (
          <>
            <p style={{ marginTop: 0, fontSize: 14 }}>
              When buyers ask AI for a business like yours, these are the names that come up —{' '}
              {stats.appeared === 0 ? <strong>yours isn&apos;t one of them.</strong> : 'and how often.'}
            </p>
            <table>
              <thead>
                <tr>
                  <th>Competitor AI named</th>
                  <th>Times mentioned</th>
                </tr>
              </thead>
              <tbody>
                {competitors.slice(0, 8).map((c) => (
                  <tr key={c.name}>
                    <td>{c.name}</td>
                    <td>{c.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="muted">No competitor data yet — run a scan to populate this.</p>
        )}
      </div>

      {/* PER-ENGINE */}
      <div className="grid cols-4" style={{ marginBottom: 16 }}>
        {ENGINE_IDS.map((id) => {
          const s = visibility ? visibility[`${id}_score`] : null;
          return (
            <div className="panel engine-card" key={id}>
              <div className="name">{ENGINE_LABELS[id]}</div>
              <div className="score" style={{ color: scoreColor(s) }}>
                {s == null ? '—' : s}
              </div>
            </div>
          );
        })}
      </div>

      {/* PROOF */}
      {proof.length > 0 && (
        <div className="panel" style={{ marginBottom: 16 }}>
          <h2>The proof — what AI actually said</h2>
          <table>
            <thead>
              <tr>
                <th>When a customer asks AI…</th>
                <th>You appeared?</th>
                <th>AI recommended instead</th>
              </tr>
            </thead>
            <tbody>
              {proof.map((p, i) => (
                <tr key={i}>
                  <td>{p.prompt}</td>
                  <td>
                    <span className={`pill ${p.appeared ? 'good' : 'bad'}`}>
                      {p.appeared ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="muted">{p.comps.length ? p.comps.join(', ') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* WHY NOW */}
      <div className="panel" style={{ marginBottom: 16 }}>
        <h2>Why this matters now</h2>
        <p style={{ fontSize: 14, marginTop: 0 }}>
          AI assistants are becoming how people find businesses — and they are forming their
          &ldquo;who to recommend&rdquo; answers <strong>right now</strong>. Whoever the models learn
          to trust in your category gets recommended again and again; latecomers get locked out.
          Every week you&apos;re invisible, AI is sending buyers to the competitors above.
        </p>
        <p style={{ fontSize: 14, marginBottom: 0 }}>
          The good news: this is fixable, and most of your competitors haven&apos;t done it yet.
          The window to become the default answer is open — but not forever.
        </p>
      </div>

      {/* CTA */}
      <div className="panel" style={{ textAlign: 'center', padding: 28 }}>
        <h2 style={{ color: 'var(--text)' }}>Ready to become the AI&apos;s answer?</h2>
        <a href={cfg.ctaUrl} className="cta">
          {cfg.ctaText}
        </a>
        {cfg.contact && (
          <div className="muted" style={{ marginTop: 12, fontSize: 13 }}>
            {cfg.contact}
          </div>
        )}
      </div>

      <div className="report-foot">
        Prepared by {cfg.brand}
        {cfg.tagline ? ` · ${cfg.tagline}` : ''}
      </div>
    </div>
  );
}
