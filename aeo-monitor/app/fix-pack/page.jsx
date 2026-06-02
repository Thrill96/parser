import Link from 'next/link';
import FixPackView from '../components/FixPackView.jsx';
import { getPrimaryDomain, getDomainById, getLatestFixPack } from '../../lib/dashboard-data.js';

export const dynamic = 'force-dynamic';

export default async function FixPackPage({ searchParams }) {
  const requestedId = searchParams?.domain ? Number(searchParams.domain) : null;
  let domain;
  try {
    domain = (requestedId && (await getDomainById(requestedId))) || (await getPrimaryDomain());
  } catch {
    domain = null;
  }

  if (!domain) {
    return (
      <div className="container">
        <div className="header">
          <h1>Fix Pack</h1>
        </div>
        <div className="empty">No site found. Add a site and run a scan first.</div>
      </div>
    );
  }

  const pack = await getLatestFixPack(domain.id);

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Fix Pack — {domain.brand_name}</h1>
          <div className="sub">Ready-to-paste fixes · {domain.domain}</div>
        </div>
        <Link href={`/?domain=${domain.id}`} className="pill" style={{ padding: '7px 12px' }}>
          ← Dashboard
        </Link>
      </div>

      <FixPackView domainId={domain.id} brandName={domain.brand_name} pack={pack} />
    </div>
  );
}
