// Apply db/schema.sql to the configured Turso/libSQL database.
//   npm run db:init
import './_env.mjs';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createClient } from '@libsql/client';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const url = process.env.TURSO_DATABASE_URL;
if (!url) {
  console.error('TURSO_DATABASE_URL is not set. Try TURSO_DATABASE_URL=file:local.db');
  process.exit(1);
}

const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
const sql = readFileSync(join(root, 'db', 'schema.sql'), 'utf8');

// Strip full-line `--` comments, then split on statement boundaries
// (schema has no embedded ';').
const stripped = sql
  .split('\n')
  .filter((line) => !line.trim().startsWith('--'))
  .join('\n');

const statements = stripped
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean);

for (const stmt of statements) {
  await client.execute(stmt);
}

console.log(`Applied ${statements.length} statements to ${url}`);
