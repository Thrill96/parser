// Tiny concurrency limiter — runs `fn` over `items` with at most `limit`
// in flight at once, preserving input order in the returned array.
// No dependency; used to parallelize engine + parser calls during a scan.

export async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const n = Math.max(1, Math.min(limit, items.length || 1));

  const worker = async () => {
    while (true) {
      const idx = next++;
      if (idx >= items.length) return;
      results[idx] = await fn(items[idx], idx);
    }
  };

  await Promise.all(Array.from({ length: n }, worker));
  return results;
}
