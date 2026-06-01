// Verify a request is an authorized cron / admin caller.
// Vercel Cron sends `Authorization: Bearer $CRON_SECRET`.
// If CRON_SECRET is unset (e.g. local dev), allow all.

export function authorizeCron(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const auth = request.headers.get('authorization') || '';
  return auth === `Bearer ${secret}`;
}
