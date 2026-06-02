'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Promote a prospect into a fully-tracked domain (creates it + smart prompts),
// then jump to its dashboard to run the full audit + report.
export default function PromoteButton({ prospect }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function promote() {
    setBusy(true);
    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: prospect.domain,
          brand_name: prospect.brand_name || prospect.domain,
          service_category: prospect.service_category || '',
          location: prospect.location || '',
        }),
      });
      const data = await res.json();
      // 409 = already tracked; just go to it.
      const id = data.domainId;
      if (id) router.push(`/?domain=${id}`);
      else throw new Error(data.error || 'promote failed');
    } catch {
      setBusy(false);
    }
  }

  return (
    <button onClick={promote} disabled={busy} style={{ fontSize: 12, padding: '4px 10px' }}>
      {busy ? '…' : 'Promote →'}
    </button>
  );
}
