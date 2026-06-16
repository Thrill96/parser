interface MlrBarProps {
  score: number;
}

export function MlrBar({ score }: MlrBarProps) {
  const color =
    score >= 85 ? "#5BA67A" : score >= 70 ? "#C9A84C" : "#DC3C3C";

  return (
    <div className="flex items-center gap-2">
      <div
        className="mlr-bar flex-1"
        role="progressbar"
        aria-label={`MLR Score: ${score} of 100`}
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="mlr-fill"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span
        className="dm text-[11px] font-semibold w-7 text-right"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}
