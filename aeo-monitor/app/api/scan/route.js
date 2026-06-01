import { NextResponse } from 'next/server';
import { runScan } from '../../../lib/scan.js';
import { runSchemaAudits } from '../../../lib/run-schema-audit.js';
import { authorizeCron } from '../../../lib/cron-auth.js';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

// On-demand "Run Scan Now" — also refreshes the schema audit so the overall
// score reflects current schema health.
export async function POST(request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  let body = {};
  try {
    body = await request.json();
  } catch {
    /* empty body is fine */
  }
  const domainId = body.domainId ? Number(body.domainId) : undefined;

  try {
    await runSchemaAudits({ domainId });
    const summary = await runScan({ domainId });
    return NextResponse.json({ ok: true, ...summary });
  } catch (err) {
    console.error('[api/scan]', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
