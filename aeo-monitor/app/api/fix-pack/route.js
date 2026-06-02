import { NextResponse } from 'next/server';
import { one, run } from '../../../lib/db.js';
import { detectCMS } from '../../../lib/cms-detect.js';
import { generateFixPack } from '../../../lib/fix-pack.js';
import { authorizeCron } from '../../../lib/cron-auth.js';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

async function fetchHomepage(domain) {
  const url = /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AEO-Monitor/1.0)' },
    });
    return await res.text();
  } catch {
    return '';
  }
}

export async function POST(request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    /* ignore */
  }
  const domainId = body.domainId ? Number(body.domainId) : null;
  if (!domainId) {
    return NextResponse.json({ ok: false, error: 'domainId required' }, { status: 400 });
  }

  const domain = await one('SELECT * FROM domains WHERE id = ?', [domainId]);
  if (!domain) {
    return NextResponse.json({ ok: false, error: 'domain not found' }, { status: 404 });
  }

  // Pull the latest recommendations + schema gaps to feed the generator.
  const recRow = await one(
    'SELECT recommendations FROM recommendations WHERE domain_id = ? ORDER BY gen_date DESC, id DESC LIMIT 1',
    [domainId]
  );
  let recommendations = [];
  try {
    recommendations = recRow ? JSON.parse(recRow.recommendations || '[]') : [];
  } catch {
    recommendations = [];
  }

  const auditRow = await one(
    'SELECT issues FROM schema_audits WHERE domain_id = ? ORDER BY audit_date DESC, id DESC LIMIT 1',
    [domainId]
  );
  let schemaIssues = [];
  try {
    schemaIssues = auditRow && auditRow.issues ? JSON.parse(auditRow.issues) : [];
  } catch {
    schemaIssues = [];
  }

  try {
    const html = await fetchHomepage(domain.domain);
    const cms = detectCMS(html);

    let sameAs = [];
    try {
      sameAs = domain.same_as ? JSON.parse(domain.same_as) : [];
    } catch {
      sameAs = [];
    }

    const pack = await generateFixPack({
      domain: domain.domain,
      brand_name: domain.brand_name,
      owner_name: domain.owner_name,
      service_category: domain.service_category,
      linkedin_url: domain.linkedin_url,
      location: domain.location,
      same_as: sameAs,
      verified_facts: domain.verified_facts,
      cms,
      recommendations,
      schemaIssues,
    });

    await run(
      `INSERT INTO fix_packs (domain_id, gen_date, cms, cms_label, items, offsite_checklist, needs_input)
       VALUES (?,?,?,?,?,?,?)`,
      [
        domainId,
        new Date().toISOString().slice(0, 10),
        cms.id,
        cms.label,
        JSON.stringify(pack.items),
        JSON.stringify(pack.offsite_checklist),
        JSON.stringify(pack.needs_input || []),
      ]
    );

    return NextResponse.json({
      ok: true,
      cms: cms.label,
      items: pack.items.length,
      needs_input: (pack.needs_input || []).length,
    });
  } catch (err) {
    console.error('[api/fix-pack]', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
