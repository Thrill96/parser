// White-label config for the Shock Report, driven by env vars so one operator
// (e.g. an agency) can brand every report they generate.

export function reportConfig() {
  return {
    brand: process.env.REPORT_BRAND || 'EmpowerCore Solutions',
    tagline: process.env.REPORT_TAGLINE || 'AI Visibility & Implementation for Small Business',
    ctaText: process.env.REPORT_CTA_TEXT || 'Book your AI Visibility Strategy Call',
    ctaUrl: process.env.REPORT_CTA_URL || '#',
    contact: process.env.REPORT_CONTACT || '',
  };
}
