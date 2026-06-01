export default function CompetitorView({ competitors }) {
  return (
    <div className="panel">
      <h2>Competitors AI Recommends Instead</h2>
      {!competitors || competitors.length === 0 ? (
        <div className="muted">
          No competitors were surfaced in the latest run. That&apos;s good — it means the
          engines aren&apos;t displacing you.
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Competitor</th>
              <th>Mentions (latest run)</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c) => (
              <tr key={c.name}>
                <td>{c.name}</td>
                <td>{c.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
