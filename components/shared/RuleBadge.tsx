import { RULE_LABELS } from '@/lib/constants';

export default function RuleBadge({ rule }: { rule: string }) {
  return (
    <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-brand-light text-brand-text border-brand-border">
      {RULE_LABELS[rule] || rule}
    </span>
  );
}
