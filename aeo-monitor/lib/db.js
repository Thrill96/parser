import { createClient } from '@libsql/client';

// Single shared libSQL/Turso client.
//
// Production:  TURSO_DATABASE_URL=libsql://aeo-monitor-<org>.turso.io
//              TURSO_AUTH_TOKEN=<token>
// Local dev:   TURSO_DATABASE_URL=file:local.db   (no auth token needed)

let _client;

export function db() {
  if (_client) return _client;

  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error(
      'TURSO_DATABASE_URL is not set. Copy .env.example to .env.local and fill it in ' +
        '(use TURSO_DATABASE_URL=file:local.db for local development).'
    );
  }

  _client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return _client;
}

// Convenience helpers -------------------------------------------------

export async function all(sql, args = []) {
  const rs = await db().execute({ sql, args });
  return rs.rows;
}

export async function one(sql, args = []) {
  const rows = await all(sql, args);
  return rows[0] ?? null;
}

export async function run(sql, args = []) {
  return db().execute({ sql, args });
}
