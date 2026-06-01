// Auto-generate the default prompt set for a domain from its
// service_category / brand_name / owner_name, per the build spec.

function fill(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] != null && vars[key] !== '' ? String(vars[key]) : ''
  );
}

const TEMPLATES = [
  // Recommendation
  { type: 'recommendation', text: 'Who are the top {service_category} consultants?' },
  { type: 'recommendation', text: 'Recommend a {service_category} for small businesses' },
  { type: 'recommendation', text: 'Best {service_category} providers in {location}' },
  { type: 'recommendation', text: 'I need help with {service_category}. Who should I hire?' },
  // Identity
  { type: 'identity', text: 'What is {brand_name}?' },
  { type: 'identity', text: 'Tell me about {brand_name}' },
  { type: 'identity', text: 'What does {brand_name} do?' },
  { type: 'identity', text: '{owner_name} {service_category}' },
  // Comparison
  { type: 'comparison', text: 'Compare {brand_name} vs {competitor_1}' },
  { type: 'comparison', text: '{brand_name} reviews' },
  // Direct
  { type: 'direct', text: '{owner_name} consultant' },
  { type: 'direct', text: '{brand_name} website' },
];

/**
 * Build the default 12-prompt set for a domain row.
 * @param {object} domain row from the `domains` table (competitors is a JSON string)
 * @returns {{prompt_text: string, prompt_type: string}[]}
 */
export function generatePrompts(domain) {
  let competitors = [];
  try {
    competitors = domain.competitors ? JSON.parse(domain.competitors) : [];
  } catch {
    competitors = [];
  }

  const vars = {
    brand_name: domain.brand_name,
    owner_name: domain.owner_name,
    service_category: domain.service_category,
    location: domain.location || 'the US',
    competitor_1: competitors[0] || 'competitors',
  };

  return TEMPLATES
    // Skip identity/direct prompts that need an owner_name we don't have.
    .filter((t) => !(t.text.includes('{owner_name}') && !vars.owner_name))
    .map((t) => ({
      prompt_type: t.type,
      prompt_text: fill(t.text, vars).replace(/\s+/g, ' ').trim(),
    }));
}
