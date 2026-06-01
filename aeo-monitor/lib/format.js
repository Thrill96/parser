export function scoreClass(score) {
  if (score == null) return 'muted';
  if (score >= 67) return 'good';
  if (score >= 34) return 'warn';
  return 'bad';
}

export function scoreColor(score) {
  if (score == null) return '#95a0b5';
  if (score >= 67) return '#36c98e';
  if (score >= 34) return '#f5b945';
  return '#ef5f6b';
}

export function yesNo(v) {
  return v ? 'yes' : 'no';
}
