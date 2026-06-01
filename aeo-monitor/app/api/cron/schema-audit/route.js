import { NextResponse } from 'next/server';
import { runSchemaAudits } from '../../../../lib/run-schema-audit.js';
import { authorizeCron } from '../../../../lib/cron-auth.js';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function GET(request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  try {
    const summary = await runSchemaAudits();
    return NextResponse.json({ ok: true, ...summary });
  } catch (err) {
    console.error('[cron/schema-audit]', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
