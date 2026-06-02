// Detect the CMS / site builder from homepage HTML so Fix Pack install
// instructions can be platform-specific. Best-effort signal matching.

const SIGNATURES = [
  {
    id: 'wordpress',
    label: 'WordPress',
    test: (h) => /wp-content|wp-includes|name=["']generator["'][^>]*WordPress/i.test(h),
    inject:
      'Use a plugin like "Insert Headers and Footers" (WPCode), or edit your theme\'s header.php / a block in the Site Editor, and paste the snippet into the <head>. For page copy, edit the page in the block editor.',
  },
  {
    id: 'squarespace',
    label: 'Squarespace',
    test: (h) => /squarespace\.com|static1\.squarespace|Squarespace/i.test(h),
    inject:
      'Go to Settings → Advanced → Code Injection and paste <head> snippets in the "Header" box. For page copy, edit the page directly. (Code Injection requires a Business plan or higher.)',
  },
  {
    id: 'wix',
    label: 'Wix',
    test: (h) => /wix\.com|wixstatic\.com|_wixCssBuildId|X-Wix/i.test(h),
    inject:
      'Use Settings → Custom Code (or the SEO/Marketing Integrations panel) to add <head> snippets sitewide. Edit page text directly in the Wix Editor. Meta description is set per-page under SEO Basics.',
  },
  {
    id: 'webflow',
    label: 'Webflow',
    test: (h) => /webflow|data-wf-|name=["']generator["'][^>]*Webflow/i.test(h),
    inject:
      'Add <head> snippets in Project Settings → Custom Code (Head Code), or per-page under Page Settings → Custom Code. Meta description is set in Page Settings → SEO.',
  },
  {
    id: 'shopify',
    label: 'Shopify',
    test: (h) => /cdn\.shopify\.com|Shopify\.theme|myshopify\.com/i.test(h),
    inject:
      'Edit theme.liquid (Online Store → Themes → Edit code) and paste snippets before </head>. Meta description is set under each page/product\'s "Search engine listing" preview.',
  },
  {
    id: 'framer',
    label: 'Framer',
    test: (h) => /framer\.com|name=["']generator["'][^>]*Framer/i.test(h),
    inject:
      'Add <head> snippets in Site Settings → General → Custom Code. Edit page copy on the canvas; set meta description per-page in Page Settings.',
  },
];

export function detectCMS(html) {
  if (!html) return { id: 'unknown', label: 'Unknown / custom', inject: GENERIC };
  for (const sig of SIGNATURES) {
    if (sig.test(html)) return { id: sig.id, label: sig.label, inject: sig.inject };
  }
  return { id: 'unknown', label: 'Unknown / custom HTML', inject: GENERIC };
}

const GENERIC =
  'Paste <head> snippets (meta tags, JSON-LD <script> blocks) just before the closing </head> tag of your homepage template. Page copy goes into the relevant page/section of your site editor. If you use a developer or agency, hand them these blocks — each is drop-in ready.';
