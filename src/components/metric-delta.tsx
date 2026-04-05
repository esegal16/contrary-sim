export function MetricDelta({ current, previous }: { current: number; previous: number | undefined }) {
  if (previous === undefined || previous === 0) return null;
  const delta = current - previous;
  if (delta === 0) return null;

  return (
    <span className={`text-[9px] sm:text-[10px] font-mono font-semibold ml-1 ${
      delta > 0 ? "text-emerald-400" : "text-red-400"
    }`}>
      {delta > 0 ? "+" : ""}{delta}
    </span>
  );
}
