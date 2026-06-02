'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const FIELDS = [
  { name: 'domain', label: 'Website domain', placeholder: 'buddysbakery.com', required: true },
  { name: 'brand_name', label: 'Brand name', placeholder: "Buddy's Bakery", required: true },
  { name: 'owner_name', label: 'Owner / founder name', placeholder: 'Jane Smith' },
  {
    name: 'service_category',
    label: 'Service category',
    placeholder: 'artisan bakery and custom cakes',
    hint: 'How the business describes what it does — used to generate the test prompts.',
  },
  { name: 'location', label: 'Location', placeholder: 'Austin, TX' },
  {
    name: 'competitors',
    label: 'Main competitors',
    placeholder: 'competitora.com, Competitor B',
    hint: 'Comma-separated. Used for comparison prompts and displacement tracking.',
  },
  {
    name: 'linkedin_url',
    label: 'LinkedIn URL (real)',
    placeholder: 'https://www.linkedin.com/in/their-handle',
    hint: 'Used in schema. Leave blank if unknown — we will NOT invent one.',
  },
  {
    name: 'same_as',
    label: 'Other profile URLs',
    placeholder: 'https://twitter.com/..., https://g2.com/...',
    hint: 'Comma-separated, optional. Real profile/directory links only.',
  },
  {
    name: 'verified_facts',
    label: 'Real material to use (optional)',
    type: 'textarea',
    placeholder:
      'Paste anything real you want the Fix Pack to use verbatim: client testimonials (with names), metrics, credentials, year founded, awards…',
    hint: 'Anything not provided here will be left as a [PLACEHOLDER] in the Fix Pack — never fabricated.',
  },
];

export default function AddSitePage() {
  const router = useRouter();
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function set(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
      // Land on the new site's dashboard; they can run the first scan from there.
      router.push(`/?domain=${data.domainId}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <div className="header">
        <div>
          <h1>Add a site</h1>
          <div className="sub">Track a new brand&apos;s AI visibility</div>
        </div>
        <button onClick={() => router.push('/')}>← Back</button>
      </div>

      <form className="panel" onSubmit={submit}>
        {FIELDS.map((f) => (
          <div key={f.name} style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>
              {f.label}
              {f.required && <span style={{ color: 'var(--bad)' }}> *</span>}
            </label>
            {f.type === 'textarea' ? (
              <textarea
                value={form[f.name] || ''}
                placeholder={f.placeholder}
                rows={5}
                onChange={(e) => set(f.name, e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--panel-2)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: 14,
                  resize: 'vertical',
                }}
              />
            ) : (
              <input
                type="text"
                value={form[f.name] || ''}
                placeholder={f.placeholder}
                required={f.required}
                onChange={(e) => set(f.name, e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--panel-2)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: 14,
                }}
              />
            )}
            {f.hint && (
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                {f.hint}
              </div>
            )}
          </div>
        ))}

        {error && (
          <div className="pill bad" style={{ display: 'block', marginBottom: 12, padding: 8 }}>
            {error}
          </div>
        )}

        <button className="primary" type="submit" disabled={busy}>
          {busy ? 'Adding…' : 'Add site & generate prompts'}
        </button>
        <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
          This creates the site and its 12 default prompts. You&apos;ll land on its dashboard,
          where you can hit <strong>Run Scan Now</strong> to get the first results.
        </div>
      </form>
    </div>
  );
}
