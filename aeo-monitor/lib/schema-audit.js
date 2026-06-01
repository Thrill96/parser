// Schema / technical AEO auditor.
// Fetches a homepage, parses JSON-LD + meta/og tags, scores 0-100.
// Dependency-light: uses regex extraction so it runs anywhere (Edge/Node).

function fetchHomepage(domain) {
  const url = /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;
  return fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; AEO-Monitor/1.0; +https://aeo.empower-core.com)',
    },
  });
}

function extractJsonLdBlocks(html) {
  const blocks = [];
  const re =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    try {
      blocks.push(JSON.parse(raw));
    } catch {
      // Ignore malformed JSON-LD; it still counts as "present but broken".
      blocks.push({ __unparseable: true, __raw: raw.slice(0, 500) });
    }
  }
  return blocks;
}

// Flatten @graph and arrays so we can scan every node's @type.
function collectTypes(blocks) {
  const types = new Set();
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach(walk);
    if (node['@type']) {
      const t = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
      t.forEach((x) => types.add(String(x)));
    }
    if (Array.isArray(node['@graph'])) node['@graph'].forEach(walk);
  };
  blocks.forEach(walk);
  return types;
}

function hasSameAs(blocks) {
  let any = false;
  let linkedin = false;
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach(walk);
    if (node.sameAs) {
      const links = Array.isArray(node.sameAs) ? node.sameAs : [node.sameAs];
      if (links.length) any = true;
      if (links.some((l) => /linkedin\.com/i.test(String(l)))) linkedin = true;
    }
    Object.values(node).forEach((v) => {
      if (v && typeof v === 'object') walk(v);
    });
  };
  blocks.forEach(walk);
  return { any, linkedin };
}

function metaContent(html, attr, value) {
  // <meta name="description" content="..."> or property="og:title"
  const re = new RegExp(
    `<meta[^>]*${attr}=["']${value}["'][^>]*content=["']([^"']*)["']`,
    'i'
  );
  const alt = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${value}["']`,
    'i'
  );
  const m = html.match(re) || html.match(alt);
  return m ? m[1].trim() : null;
}

function pageTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim() : null;
}

function imageAltContainsBrand(html, brand) {
  if (!brand) return false;
  const re = /<img[^>]*\balt=["']([^"']*)["']/gi;
  let m;
  const needle = brand.toLowerCase();
  while ((m = re.exec(html)) !== null) {
    if (m[1].toLowerCase().includes(needle)) return true;
  }
  return false;
}

const TYPE_HAS = (types, ...names) =>
  names.some((n) => [...types].some((t) => t.toLowerCase() === n.toLowerCase()));

/**
 * Run a full schema audit for a domain row.
 * @param {object} domain { domain, brand_name }
 * @returns audit record (matches schema_audits columns) + per-check scoring detail
 */
export async function auditSchema(domain) {
  const issues = [];
  let html = '';
  let robotsOk = false;
  let sitemapOk = false;

  try {
    const res = await fetchHomepage(domain.domain);
    if (!res.ok) issues.push(`Homepage returned HTTP ${res.status}`);
    html = await res.text();
  } catch (err) {
    issues.push(`Could not fetch homepage: ${err.message}`);
  }

  // robots.txt / sitemap probe (best effort, non-fatal).
  try {
    const base = /^https?:\/\//i.test(domain.domain)
      ? domain.domain
      : `https://${domain.domain}`;
    const robots = await fetch(`${base}/robots.txt`, { redirect: 'follow' });
    robotsOk = robots.ok;
    if (robotsOk) {
      const txt = await robots.text();
      sitemapOk = /sitemap:/i.test(txt);
    }
  } catch {
    /* ignore */
  }

  const blocks = extractJsonLdBlocks(html);
  const types = collectTypes(blocks);
  const sameAs = hasSameAs(blocks);

  const hasPerson = TYPE_HAS(types, 'Person');
  const hasOrg = TYPE_HAS(types, 'Organization', 'LocalBusiness', 'ProfessionalService');
  const hasWebsite = TYPE_HAS(types, 'WebSite');
  const hasService = TYPE_HAS(types, 'Service', 'Product', 'Offer');

  const metaDescription = metaContent(html, 'name', 'description');
  const ogTitle = metaContent(html, 'property', 'og:title');
  const ogDescription = metaContent(html, 'property', 'og:description');
  const title = pageTitle(html);

  const brand = domain.brand_name || '';
  const role = (domain.service_category || '').split(' ')[0] || '';
  const ogTitleHasBrandRole =
    !!ogTitle &&
    ogTitle.toLowerCase().includes(brand.toLowerCase()) &&
    (!role || ogTitle.toLowerCase().includes(role.toLowerCase()));
  const metaKeywordRich =
    !!metaDescription &&
    metaDescription.length > 50 &&
    brand &&
    metaDescription.toLowerCase().includes(brand.toLowerCase());
  const altHasBrand = imageAltContainsBrand(html, brand);

  // Scoring rubric (build spec).
  let score = 0;
  const add = (cond, pts, label) => {
    if (cond) score += pts;
    else issues.push(`Missing (${pts} pts): ${label}`);
  };
  add(hasPerson, 15, 'Person schema');
  add(hasOrg, 15, 'Organization schema');
  add(sameAs.linkedin, 10, 'sameAs link to LinkedIn');
  add(sameAs.any && !sameAs.linkedin ? true : sameAs.linkedin, 5, 'sameAs links to other profiles');
  add(hasWebsite, 5, 'WebSite schema');
  add(hasService, 10, 'Service/Product schema');
  add(metaKeywordRich, 10, 'keyword-rich meta description');
  add(ogTitleHasBrandRole, 10, 'og:title with brand + role');
  add(altHasBrand, 5, 'image alt text containing brand name');
  add(blocks.length > 0, 10, 'on-topic structured data present (no signal dilution)');
  add(robotsOk && sitemapOk, 5, 'robots.txt + sitemap configured');

  score = Math.max(0, Math.min(100, score));

  return {
    audit_date: new Date().toISOString().slice(0, 10),
    has_person_schema: hasPerson,
    has_org_schema: hasOrg,
    has_website_schema: hasWebsite,
    has_service_schema: hasService,
    has_same_as_links: sameAs.any,
    has_meta_description: !!metaDescription,
    og_title: ogTitle,
    og_description: ogDescription,
    page_title: title,
    schema_json: JSON.stringify(blocks).slice(0, 8000),
    issues: JSON.stringify(issues),
    score,
  };
}
