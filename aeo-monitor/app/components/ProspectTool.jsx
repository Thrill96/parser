'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Parse pasted lines: "domain, brand, category, location" (commas optional
// after the domain). One business per line.
function parseLines(text) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [domain, brand_name, service_category, location] = line.split(',').map((s) => (s || '').trim());
      return { domain, brand_name, service_category, location };
    })
    .filter((p) => p.domain);
}

export default function ProspectTool() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const parsed = parseLines(text);

  async function run() {
    if (!parsed.length) return;
    setBusy(true);
    setMsg(`Auditing ${parsed.length} prospect(s)… schema + a quick AI visibility check each. This can take a minute.`);
    try {
      const res = await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospects: parsed }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setMsg(`Done — scanned ${data.scanned}. Ranking by opportunity…`);
      setText('');
      router.refresh();
      setTimeout(() => setMsg(''), 2500);
    } catch (err) {
      setMsg(`Failed: ${err.message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel" style={{ marginBottom: 16 }}>
      <h2>Add prospects</h2>
      <p className="muted" style={{ marginTop: 0, fontSize: 13 }}>
        One business per line: <code>domain, brand, category, location</code> (only the domain is
        required). Up to 50 at a time. Each gets a free schema audit + a quick AI-visibility check.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder={'joesdental.com, Joe’s Dental, family dentist, Tulsa OK\nacmehvac.com, Acme HVAC, hvac repair, Austin TX'}
        style={{
          width: '100%',
          background: 'var(--panel-2)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: 12,
          fontSize: 13,
          resize: 'vertical',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
        <button className="primary" onClick={run} disabled={busy || !parsed.length}>
          {busy ? 'Auditing…' : `Audit ${parsed.length || ''} prospect${parsed.length === 1 ? '' : 's'}`}
        </button>
        {msg && (
          <span className="muted" style={{ fontSize: 12 }}>
            {msg}
          </span>
        )}
      </div>
    </div>
  );
}
