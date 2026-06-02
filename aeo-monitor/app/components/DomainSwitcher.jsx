'use client';

import { useRouter } from 'next/navigation';

export default function DomainSwitcher({ domains, currentId }) {
  const router = useRouter();

  if (!domains || domains.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <select
        value={currentId}
        onChange={(e) => {
          if (e.target.value === '__add__') router.push('/add');
          else router.push(`/?domain=${e.target.value}`);
        }}
        aria-label="Select site"
      >
        {domains.map((d) => (
          <option key={d.id} value={d.id}>
            {d.brand_name} ({d.domain})
          </option>
        ))}
        <option value="__add__">+ Add a site…</option>
      </select>
    </div>
  );
}
