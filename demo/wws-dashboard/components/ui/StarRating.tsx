interface StarRatingProps {
  rating: number;
  max?: number;
  label?: string;
}

export function StarRating({ rating, max = 5, label }: StarRatingProps) {
  return (
    <span
      className="inline-flex gap-0.5 text-sm"
      role="img"
      aria-label={label ?? `Rating: ${rating} of ${max}`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            color: i < rating ? "#4B9CD3" : "rgba(255,255,255,0.1)",
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}
