// Minimal .env loader for standalone scripts (no dotenv dependency).
// Loads .env.local then .env into process.env. Within a file, the LAST
// definition of a key wins (so an appended correction overrides an earlier
// stale line). Values already present in the real shell environment always
// take precedence over file values.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const preexisting = new Set(Object.keys(process.env));
const fromFiles = {};

for (const file of ['.env.local', '.env']) {
  const path = join(root, file);
  if (!existsSync(path)) continue;
  const text = readFileSync(path, 'utf8');
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    const key = m[1];
    let val = m[2];
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    // Last write wins across both files for the same key.
    fromFiles[key] = val;
  }
}

for (const [key, val] of Object.entries(fromFiles)) {
  // Don't clobber a value explicitly set in the real shell environment.
  if (!preexisting.has(key)) process.env[key] = val;
}

