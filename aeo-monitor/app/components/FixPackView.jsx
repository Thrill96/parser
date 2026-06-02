'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard may be blocked on insecure origins */
        }
      }}
      style={{ fontSize: 12, padding: '4px 10px' }}
    >
      {copied ? 'Copied ✓' : 'Copy'}
    </button>
  );
}

const TYPE_LABEL = { meta: 'Meta tag', schema: 'Schema (JSON-LD)', copy: 'Copy', page: 'Page draft' };

export default function FixPackView({ domainId, brandName, pack }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function generate() {
    setBusy(true);
    setMsg('Generating your Fix Pack… Claude is writing the actual copy, schema, and pages. ~30-60s.');
    try {
      const res = await fetch('/api/fix-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainId }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setMsg(`Done — ${data.items} deliverables for ${data.cms}. Refreshing…`);
      router.refresh();
      setTimeout(() => setMsg(''), 2500);
    } catch (err) {
      setMsg(`Failed: ${err.message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button className="primary" onClick={generate} disabled={busy}>
          {busy ? 'Generating…' : pack ? 'Regenerate Fix Pack' : 'Generate Fix Pack'}
        </button>
        {pack && (
          <span className="muted" style={{ fontSize: 13 }}>
            Platform detected: <strong>{pack.cms_label}</strong> · generated {pack.gen_date}
          </span>
        )}
        {msg && (
          <span className="muted" style={{ fontSize: 12 }}>
            {msg}
          </span>
        )}
      </div>

      {!pack ? (
        <div className="empty">
          <p>No Fix Pack yet for {brandName}.</p>
          <p className="muted" style={{ maxWidth: 560, margin: '0 auto' }}>
            Click <strong>Generate Fix Pack</strong> and Claude will turn the recommendations into
            ready-to-paste copy, meta tags, JSON-LD schema, and page drafts — tailored to this
            site&apos;s platform. (Run a scan first so there are recommendations to build from.)
          </p>
        </div>
      ) : (
        <>
          {pack.items.map((item, i) => (
            <div className="panel" key={i} style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <span className="pill muted" style={{ marginRight: 8 }}>
                    {TYPE_LABEL[item.type] || item.type}
                  </span>
                  <strong>{item.title}</strong>
                </div>
                <CopyButton text={item.content || ''} />
              </div>
              {item.where && (
                <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                  <strong>Where:</strong> {item.where}
                </div>
              )}
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 12,
                  marginTop: 8,
                  overflowX: 'auto',
                }}
              >
                {item.content}
              </pre>
              {item.instructions && (
                <div style={{ fontSize: 13, marginTop: 8 }}>
                  <strong>How to install:</strong> {item.instructions}
                </div>
              )}
            </div>
          ))}

          {pack.offsite_checklist && pack.offsite_checklist.length > 0 && (
            <div className="panel">
              <h2>Off-site checklist</h2>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {pack.offsite_checklist.map((c, i) => (
                  <li key={i} style={{ fontSize: 13, marginBottom: 6 }}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
