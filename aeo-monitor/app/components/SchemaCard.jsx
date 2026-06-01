import { scoreColor } from '../../lib/format.js';

const CHECKS = [
  ['has_person_schema', 'Person schema'],
  ['has_org_schema', 'Organization schema'],
  ['has_website_schema', 'WebSite schema'],
  ['has_service_schema', 'Service / Product schema'],
  ['has_same_as_links', 'sameAs profile links'],
  ['has_meta_description', 'Meta description'],
];

export default function SchemaCard({ audit }) {
  if (!audit) {
    return (
      <div className="panel">
        <h2>Schema Health</h2>
        <div className="muted">No schema audit yet.</div>
      </div>
    );
  }

  let issues = [];
  try {
    issues = JSON.parse(audit.issues || '[]');
  } catch {
    issues = [];
  }

  return (
    <div className="panel">
      <h2>Schema Health</h2>
      <div className="bignum" style={{ color: scoreColor(audit.score), fontSize: 44 }}>
        {audit.score}
        <span className="max"> / 100</span>
      </div>
      <ul className="checklist" style={{ marginTop: 12 }}>
        {CHECKS.map(([key, label]) => (
          <li key={key}>
            <span className={`check ${audit[key] ? 'yes' : 'no'}`}>
              {audit[key] ? '✓' : '✕'}
            </span>
            {label}
          </li>
        ))}
      </ul>
      {issues.length > 0 && (
        <details className="resp" style={{ marginTop: 10 }}>
          <summary>{issues.length} issue(s) found</summary>
          <pre>{issues.join('\n')}</pre>
        </details>
      )}
      {audit.page_title && (
        <div className="muted" style={{ marginTop: 10, fontSize: 12 }}>
          <strong>Title:</strong> {audit.page_title}
        </div>
      )}
    </div>
  );
}
