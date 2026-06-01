// Seed the primary domain (EmpowerCore) and its 12 default prompts.
//   npm run db:seed
import './_env.mjs';
import { createClient } from '@libsql/client';
import { generatePrompts } from '../lib/prompts.js';

const url = process.env.TURSO_DATABASE_URL;
if (!url) {
  console.error('TURSO_DATABASE_URL is not set.');
  process.exit(1);
}
const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });

const DOMAIN = {
  domain: 'empower-core.com',
  brand_name: 'EmpowerCore Solutions',
  owner_name: 'Will Stewart',
  owner_email: 'willhstewart2@gmail.com',
  linkedin_url: 'https://www.linkedin.com/in/willhstewart',
  service_category: 'AI implementation consulting for small businesses',
  location: 'the US',
  competitors: JSON.stringify(['Empower AI', 'Searchable']),
};

// Upsert domain.
const existing = await client.execute({
  sql: 'SELECT id FROM domains WHERE domain = ?',
  args: [DOMAIN.domain],
});

let domainId;
if (existing.rows.length) {
  domainId = existing.rows[0].id;
  console.log(`Domain already present (id=${domainId}); refreshing prompts.`);
  await client.execute({ sql: 'DELETE FROM prompts WHERE domain_id = ?', args: [domainId] });
} else {
  const res = await client.execute({
    sql: `INSERT INTO domains
            (domain, brand_name, owner_name, owner_email, linkedin_url,
             service_category, location, competitors)
          VALUES (?,?,?,?,?,?,?,?)`,
    args: [
      DOMAIN.domain,
      DOMAIN.brand_name,
      DOMAIN.owner_name,
      DOMAIN.owner_email,
      DOMAIN.linkedin_url,
      DOMAIN.service_category,
      DOMAIN.location,
      DOMAIN.competitors,
    ],
  });
  domainId = Number(res.lastInsertRowid);
  console.log(`Inserted domain id=${domainId}`);
}

const prompts = generatePrompts({ ...DOMAIN, id: domainId });
for (const p of prompts) {
  await client.execute({
    sql: 'INSERT INTO prompts (domain_id, prompt_text, prompt_type) VALUES (?,?,?)',
    args: [domainId, p.prompt_text, p.prompt_type],
  });
}

console.log(`Seeded ${prompts.length} prompts:`);
for (const p of prompts) console.log(`  [${p.prompt_type}] ${p.prompt_text}`);
