// Run schema audits for one or all domains and persist them.

import { all, run } from './db.js';
import { auditSchema } from './schema-audit.js';

export async function runSchemaAudits(opts = {}) {
  const domains = opts.domainId
    ? await all('SELECT * FROM domains WHERE id = ?', [opts.domainId])
    : await all('SELECT * FROM domains ORDER BY id');

  const audits = [];
  for (const domain of domains) {
    const audit = await auditSchema(domain);
    await run(
      `INSERT INTO schema_audits
         (domain_id, audit_date, has_person_schema, has_org_schema, has_website_schema,
          has_service_schema, has_same_as_links, has_meta_description,
          og_title, og_description, page_title, schema_json, issues, score)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        domain.id,
        audit.audit_date,
        audit.has_person_schema ? 1 : 0,
        audit.has_org_schema ? 1 : 0,
        audit.has_website_schema ? 1 : 0,
        audit.has_service_schema ? 1 : 0,
        audit.has_same_as_links ? 1 : 0,
        audit.has_meta_description ? 1 : 0,
        audit.og_title,
        audit.og_description,
        audit.page_title,
        audit.schema_json,
        audit.issues,
        audit.score,
      ]
    );
    audits.push({ domain: domain.domain, score: audit.score, audit });
  }

  return { ran_at: new Date().toISOString(), audits };
}
