import { NextResponse } from 'next/server';
import { all, one, run } from '../../../lib/db.js';
import { generateSmartPrompts } from '../../../lib/smart-prompts.js';
import { authorizeCron } from '../../../lib/cron-auth.js';

export const maxDuration = 60;

export const dynamic = 'force-dynamic';

function normalizeCompetitors(input) {
  if (Array.isArray(input)) return input.map((s) => String(s).trim()).filter(Boolean);
  if (typeof input === 'string') {
    return input
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function cleanDomain(d) {
  return String(d || '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .toLowerCase();
}

// List sites (used by the dashboard switcher).
export async function GET() {
  const domains = await all('SELECT id, domain, brand_name FROM domains ORDER BY id');
  return NextResponse.json({ ok: true, domains });
}

// Add a site: insert the domain and auto-generate its default prompt set.
export async function POST(request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid JSON body' }, { status: 400 });
  }

  const domain = cleanDomain(body.domain);
  const brand_name = String(body.brand_name || '').trim();
  if (!domain || !brand_name) {
    return NextResponse.json(
      { ok: false, error: 'domain and brand_name are required' },
      { status: 400 }
    );
  }

  const existing = await one('SELECT id FROM domains WHERE domain = ?', [domain]);
  if (existing) {
    return NextResponse.json(
      { ok: false, error: `Domain ${domain} is already being tracked (id ${existing.id}).`, domainId: existing.id },
      { status: 409 }
    );
  }

  const competitors = JSON.stringify(normalizeCompetitors(body.competitors));
  const res = await run(
    `INSERT INTO domains
       (domain, brand_name, owner_name, owner_email, linkedin_url,
        service_category, location, competitors)
     VALUES (?,?,?,?,?,?,?,?)`,
    [
      domain,
      brand_name,
      String(body.owner_name || '').trim() || null,
      String(body.owner_email || '').trim() || null,
      String(body.linkedin_url || '').trim() || null,
      String(body.service_category || '').trim() || null,
      String(body.location || '').trim() || null,
      competitors,
    ]
  );
  const domainId = Number(res.lastInsertRowid);

  // Auto-generate a relevant prompt set (Claude-tailored, with a static fallback).
  const row = await one('SELECT * FROM domains WHERE id = ?', [domainId]);
  const { prompts, archetype, source } = await generateSmartPrompts(row);
  for (const p of prompts) {
    await run('INSERT INTO prompts (domain_id, prompt_text, prompt_type) VALUES (?,?,?)', [
      domainId,
      p.prompt_text,
      p.prompt_type,
    ]);
  }

  return NextResponse.json({ ok: true, domainId, prompts: prompts.length, archetype, source });
}
