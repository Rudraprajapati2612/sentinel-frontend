export default function SeverityBadge({ severity }: { severity: number }) {
  let level = 'LOW';
  if (severity >= 90) level = 'CRITICAL';
  else if (severity >= 75) level = 'HIGH';
  else if (severity >= 60) level = 'MEDIUM';

  const styles = {
    CRITICAL: 'bg-severity-critical-bg text-severity-critical-text border-severity-critical-border',
    HIGH: 'bg-severity-high-bg text-severity-high-text border-severity-high-border',
    MEDIUM: 'bg-severity-medium-bg text-severity-medium-text border-severity-medium-border',
    LOW: 'bg-severity-safe-bg text-severity-safe-text border-severity-safe-border',
  }[level];

  return (
    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${styles}`}>
      {level}
    </span>
  );
}
