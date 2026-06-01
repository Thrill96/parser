// Run a full scan + schema audit from the CLI (no server needed).
//   npm run scan
import './_env.mjs';
import { runScan } from '../lib/scan.js';
import { runSchemaAudits } from '../lib/run-schema-audit.js';

console.log('Running schema audits…');
const audits = await runSchemaAudits();
for (const a of audits.audits) console.log(`  ${a.domain}: schema ${a.score}/100`);

console.log('Running engine scan…');
const summary = await runScan();
for (const d of summary.domains) {
  console.log(`\n${d.domain}`);
  console.log(`  engines: ${d.engines.join(', ')}`);
  console.log(`  results: ${d.results}`);
  console.log(`  overall visibility: ${d.visibility.overall_score}/100`);
  if (d.alert?.triggered) console.log(`  ALERT: ${d.alert.triggers.join(' ')}`);
}
console.log('\nDone.');
