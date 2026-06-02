import { NextResponse } from 'next/server';
import { all, run } from '../../../lib/db.js';
import { scanProspects } from '../../../lib/prospect-scan.js';
import { authorizeCron } from '../../../lib/cron-auth.js';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function cleanDomain(d) {
  return String(d || '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .toLowerCase();
}

export async function GET() {
  const prospects = await all('SELECT * FROM prospects ORDER BY opportunity_score DESC, id DESC');
  return NextResponse.json({ ok: true, prospects });
}

// Body: { prospects: [{domain, brand_name, service_category, location}] }
export async function POST(request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid JSON' }, { status: 400 });
  }

  const list = (Array.isArray(body.prospects) ? body.prospects : [])
    .map((p) => ({
      domain: cleanDomain(p.domain),
      brand_name: String(p.brand_name || '').trim(),
      service_category: String(p.service_category || '').trim(),
      location: String(p.location || '').trim(),
    }))
    .filter((p) => p.domain);

  if (!list.length) {
    return NextResponse.json({ ok: false, error: 'no valid prospects (need at least a domain)' }, { status: 400 });
  }
  if (list.length > 50) {
    return NextResponse.json({ ok: false, error: 'max 50 prospects per batch' }, { status: 400 });
  }

  try {
    const results = await scanProspects(list);
    for (const r of results) {
      await run(
        `INSERT INTO prospects
           (domain, brand_name, service_category, location, engine, prompts_tested,
            appeared, ai_score, schema_score, opportunity_score, top_competitors)
         VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        [
          r.domain,
          r.brand_name,
          r.service_category,
          r.location,
          r.engine,
          r.prompts_tested,
          r.appeared,
          r.ai_score,
          r.schema_score,
          r.opportunity_score,
          JSON.stringify(r.top_competitors),
        ]
      );
    }
    return NextResponse.json({ ok: true, scanned: results.length });
  } catch (err) {
    console.error('[api/prospects]', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
