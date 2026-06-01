'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RunScanButton({ domainId }) {
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState('');
  const router = useRouter();

  async function run() {
    setRunning(true);
    setMsg('Scanning all engines… this can take a minute.');
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainId }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setMsg('Scan complete. Refreshing…');
      router.refresh();
      setTimeout(() => setMsg(''), 2500);
    } catch (err) {
      setMsg(`Scan failed: ${err.message}`);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button className="primary" onClick={run} disabled={running}>
        {running ? 'Scanning…' : 'Run Scan Now'}
      </button>
      {msg && (
        <span className="muted" style={{ fontSize: 12 }}>
          {msg}
        </span>
      )}
    </div>
  );
}
