'use client';

export default function PrintButton({ label = 'Print / Save as PDF' }) {
  return (
    <button className="primary no-print" onClick={() => window.print()}>
      {label}
    </button>
  );
}
