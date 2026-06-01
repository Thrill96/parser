import { NextResponse } from 'next/server';
import { runScan } from '../../../../lib/scan.js';
import { authorizeCron } from '../../../../lib/cron-auth.js';

export const dynamic = 'force-dynamic';
// Long-running: query 4 engines × N prompts + parse each.
export const maxDuration = 300;

export async function GET(request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  try {
    const summary = await runScan();
    return NextResponse.json({ ok: true, ...summary });
  } catch (err) {
    console.error('[cron/aeo-scan]', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
