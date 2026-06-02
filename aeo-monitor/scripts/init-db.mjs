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

// Migrations: add columns to tables that already exist from an earlier schema.
// SQLite has no "ADD COLUMN IF NOT EXISTS", so check PRAGMA table_info first.
async function ensureColumns(table, columns) {
  const info = await client.execute(`PRAGMA table_info(${table})`);
  const have = new Set(info.rows.map((r) => r.name));
  let added = 0;
  for (const [name, type] of Object.entries(columns)) {
    if (!have.has(name)) {
      await client.execute(`ALTER TABLE ${table} ADD COLUMN ${name} ${type}`);
      added++;
    }
  }
  return added;
}

let migrated = 0;
migrated += await ensureColumns('domains', { same_as: 'TEXT', verified_facts: 'TEXT' });
migrated += await ensureColumns('fix_packs', { needs_input: 'TEXT' });

console.log(
  `Applied ${statements.length} statements to ${url}` +
    (migrated ? ` (+${migrated} column migration${migrated === 1 ? '' : 's'})` : '')
);
