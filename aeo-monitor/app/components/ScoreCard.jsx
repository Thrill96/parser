import { scoreColor } from '../../lib/format.js';

export default function ScoreCard({ score, competitorDisplacement, scoreDate }) {
  const color = scoreColor(score);
  return (
    <div className="panel">
      <h2>Visibility Score</h2>
      <div className="bignum" style={{ color }}>
        {score == null ? '—' : score}
        <span className="max"> / 100</span>
      </div>
      <div className="muted" style={{ marginTop: 10, fontSize: 13 }}>
        {scoreDate ? `As of ${scoreDate}` : 'No scans yet'}
        {competitorDisplacement != null && (
          <>
            {' · '}
            Competitor displacement: <strong>{competitorDisplacement}%</strong>
          </>
        )}
      </div>
    </div>
  );
}
