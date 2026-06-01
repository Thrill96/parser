import { scoreColor } from '../../lib/format.js';
import { ENGINE_LABELS, ENGINE_IDS } from '../../lib/engines/index.js';

export default function EngineBreakdown({ visibility }) {
  return (
    <div className="grid cols-4">
      {ENGINE_IDS.map((id) => {
        const score = visibility ? visibility[`${id}_score`] : null;
        return (
          <div className="panel engine-card" key={id}>
            <div className="name">{ENGINE_LABELS[id]}</div>
            <div className="score" style={{ color: scoreColor(score) }}>
              {score == null ? '—' : score}
            </div>
          </div>
        );
      })}
    </div>
  );
}
