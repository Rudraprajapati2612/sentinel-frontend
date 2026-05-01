export default function SeverityBadge({ severity }: { severity: number }) {
  let level = 'LOW';
  if (severity >= 90) level = 'CRITICAL';
  else if (severity >= 75) level = 'HIGH';
  else if (severity >= 60) level = 'MEDIUM';

  const styles = {
    CRITICAL: 'bg-[var(--severity-critical-bg)] text-[var(--severity-critical-text)] border-[var(--severity-critical-border)]',
    HIGH: 'bg-[var(--severity-high-bg)] text-[var(--severity-high-text)] border-[var(--severity-high-border)]',
    MEDIUM: 'bg-[var(--severity-medium-bg)] text-[var(--severity-medium-text)] border-[var(--severity-medium-border)]',
    LOW: 'bg-[var(--severity-safe-bg)] text-[var(--severity-safe-text)] border-[var(--severity-safe-border)]',
  }[level];

  const dotColors = {
    CRITICAL: 'bg-[var(--severity-critical-dot)]',
    HIGH: 'bg-[var(--severity-high-dot)]',
    MEDIUM: 'bg-[var(--severity-medium-dot)]',
    LOW: 'bg-[var(--severity-safe-dot)]',
  }[level];

  return (
    <span className={`flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2 py-[2px] rounded-full border ${styles} w-fit`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors}`} />
      {level} ({severity}/99)
    </span>
  );
}
