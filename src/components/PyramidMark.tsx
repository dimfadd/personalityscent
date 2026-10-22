/**
 * Identity motif: three stacked bands for top, heart and base notes.
 * It appears in the logo, the profiling progress bar and the result pyramid.
 */
export function PyramidMark({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={className}>
      <rect x="8" y="4" width="8" height="3" rx="1" fill="var(--color-amber)" />
      <rect x="5" y="10.5" width="14" height="3" rx="1" fill="currentColor" opacity="0.75" />
      <rect x="2" y="17" width="20" height="3" rx="1" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2 text-amber">
      <PyramidMark />
      <span className="text-gold font-display text-xl font-semibold tracking-tight">Personality Scent</span>
    </span>
  );
}
