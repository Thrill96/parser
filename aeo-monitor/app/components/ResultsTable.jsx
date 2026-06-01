'use client';

import { useMemo, useState } from 'react';

const ENGINE_LABELS = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  perplexity: 'Perplexity',
};

function Bool({ v }) {
  return <span className={`check ${v ? 'yes' : 'no'}`}>{v ? '✓' : '✕'}</span>;
}

function scorePill(score) {
  const cls = score >= 7 ? 'good' : score >= 4 ? 'warn' : 'bad';
  return <span className={`pill ${cls}`}>{score}</span>;
}

export default function ResultsTable({ rows }) {
  const [engine, setEngine] = useState('all');
  const [type, setType] = useState('all');
  const [sortKey, setSortKey] = useState('prompt_type');
  const [sortDir, setSortDir] = useState('asc');

  const engines = useMemo(
    () => [...new Set(rows.map((r) => r.engine))],
    [rows]
  );
  const types = useMemo(
    () => [...new Set(rows.map((r) => r.prompt_type))],
    [rows]
  );

  const filtered = useMemo(() => {
    let out = rows.filter(
      (r) =>
        (engine === 'all' || r.engine === engine) &&
        (type === 'all' || r.prompt_type === type)
    );
    out = [...out].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return out;
  }, [rows, engine, type, sortKey, sortDir]);

  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const arrow = (key) => (sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '');

  if (!rows.length) {
    return <div className="muted">No results yet. Run a scan to populate this table.</div>;
  }

  return (
    <div>
      <div className="controls">
        <select value={engine} onChange={(e) => setEngine(e.target.value)}>
          <option value="all">All engines</option>
          {engines.map((e) => (
            <option key={e} value={e}>
              {ENGINE_LABELS[e] || e}
            </option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">All prompt types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <span className="muted" style={{ alignSelf: 'center', fontSize: 12 }}>
          {filtered.length} of {rows.length} rows
        </span>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => toggleSort('prompt_text')}>Prompt{arrow('prompt_text')}</th>
            <th onClick={() => toggleSort('engine')}>Engine{arrow('engine')}</th>
            <th onClick={() => toggleSort('brand_mentioned')}>Mentioned{arrow('brand_mentioned')}</th>
            <th onClick={() => toggleSort('website_linked')}>Linked{arrow('website_linked')}</th>
            <th onClick={() => toggleSort('correctly_identified')}>Correct{arrow('correctly_identified')}</th>
            <th onClick={() => toggleSort('confidence_score')}>Score{arrow('confidence_score')}</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id}>
              <td>
                <span className="pill muted" style={{ marginRight: 6 }}>
                  {r.prompt_type}
                </span>
                {r.prompt_text}
                <details className="resp">
                  <summary>response &amp; analysis</summary>
                  {r.extraction_notes && (
                    <pre>
                      <strong>Analysis:</strong> {r.extraction_notes}
                    </pre>
                  )}
                  <pre>{r.raw_response}</pre>
                </details>
              </td>
              <td>{ENGINE_LABELS[r.engine] || r.engine}</td>
              <td>
                <Bool v={r.brand_mentioned} />
              </td>
              <td>
                <Bool v={r.website_linked} />
              </td>
              <td>
                <Bool v={r.correctly_identified} />
              </td>
              <td>{scorePill(r.confidence_score)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
