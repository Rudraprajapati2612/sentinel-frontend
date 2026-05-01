import { Shield, Zap, Lock, Clock } from 'lucide-react';

export default function StatsRow() {
  const stats = [
    {
      title: "PROTOCOLS MONITORED",
      value: "1",
      subtitle: "MockProtocol active",
      icon: Shield,
      borderColor: "transparent"
    },
    {
      title: "ALERTS (24H)",
      value: "2",
      subtitle: "1 TVL · 1 Flash",
      icon: Zap,
      borderColor: "#ef4444"
    },
    {
      title: "PAUSES EXECUTED",
      value: "2",
      subtitle: "Both confirmed",
      icon: Lock,
      borderColor: "var(--brand-primary)"
    },
    {
      title: "AVG RESPONSE TIME",
      value: "~2.3s",
      subtitle: "Detection to pause",
      icon: Clock,
      borderColor: "transparent"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div 
            key={i} 
            className="bg-surface border border-border-default rounded-[12px] p-[20px_24px] shadow-sm hover:shadow-md transition-shadow duration-200"
            style={{ borderTop: stat.borderColor !== "transparent" ? `3px solid ${stat.borderColor}` : undefined }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[40px] h-[40px] rounded-[10px] bg-brand-light flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-brand-primary" />
              </div>
              <span className="font-display font-semibold text-[13px] uppercase text-secondary tracking-wide">{stat.title}</span>
            </div>
            <div>
              <div className="font-display font-bold text-[36px] text-primary leading-none mb-1">
                {stat.value}
              </div>
              <div className="text-[13px] text-tertiary">{stat.subtitle}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
