// Email alerts via Mandrill (Mailchimp Transactional). No-op if unconfigured.

export async function sendAlert(subject, html) {
  const key = process.env.MANDRILL_API_KEY;
  const to = process.env.ALERT_EMAIL_TO;
  const from = process.env.ALERT_EMAIL_FROM || 'alerts@empower-core.com';
  if (!key || !to) {
    console.warn('[alerts] MANDRILL_API_KEY / ALERT_EMAIL_TO not set — skipping email.');
    return { skipped: true };
  }

  const res = await fetch('https://mandrillapp.com/api/1.0/messages/send.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key,
      message: {
        from_email: from,
        from_name: 'AEO Monitor',
        to: [{ email: to, type: 'to' }],
        subject,
        html,
      },
    }),
  });

  if (!res.ok) {
    console.error('[alerts] Mandrill error', res.status, await res.text());
    return { ok: false };
  }
  return { ok: true };
}

/**
 * Decide whether a score change warrants an alert and send it.
 * @param {object} domain
 * @param {object} current computed visibility object (this run)
 * @param {object|null} previous prior visibility_scores row
 * @param {Array} results parsed results for competitor detection
 */
export async function maybeAlert(domain, current, previous, results) {
  const threshold = Number(process.env.ALERT_DROP_THRESHOLD || 10);
  const triggers = [];

  if (previous && previous.overall_score != null) {
    const drop = previous.overall_score - current.overall_score;
    if (drop >= threshold) {
      triggers.push(
        `Visibility dropped ${drop} points (${previous.overall_score} → ${current.overall_score}).`
      );
    }
  }

  // New competitor displacement appearing where there was little before.
  if (
    previous &&
    current.competitor_displacement - (previous.competitor_displacement || 0) >= 20
  ) {
    triggers.push(
      `Competitor displacement rose to ${current.competitor_displacement}% ` +
        `(was ${previous.competitor_displacement || 0}%).`
    );
  }

  if (!triggers.length) return { triggered: false };

  const competitors = [
    ...new Set(
      results.flatMap((r) =>
        Array.isArray(r.competitor_mentioned) ? r.competitor_mentioned : []
      )
    ),
  ];

  const html = `
    <h2>AEO alert for ${domain.brand_name} (${domain.domain})</h2>
    <ul>${triggers.map((t) => `<li>${t}</li>`).join('')}</ul>
    <p><strong>Current overall score:</strong> ${current.overall_score}/100</p>
    ${
      competitors.length
        ? `<p><strong>Competitors AI mentioned:</strong> ${competitors.join(', ')}</p>`
        : ''
    }
  `;
  await sendAlert(`AEO alert: ${domain.brand_name} visibility changed`, html);
  return { triggered: true, triggers };
}
