import { Shield, Zap, Lock, Clock } from 'lucide-react';

export default function StatsRow() {
  const stats = [
    {
      title: "Protocols Monitored",
      value: "1",
      subtitle: "MockProtocol active",
      icon: Shield,
    },
    {
      title: "Alerts (24h)",
      value: "2",
      subtitle: "1 TVL · 1 Flash",
      icon: Zap,
    },
    {
      title: "Pauses Executed",
      value: "2",
      subtitle: "Both confirmed",
      icon: Lock,
    },
    {
      title: "Avg Response Time",
      value: "~2.3s",
      subtitle: "Detection to pause",
      icon: Clock,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="bg-surface border border-border-default rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center">
                <Icon size={20} className="text-brand-primary" />
              </div>
              <span className="font-display font-semibold text-[15px] text-secondary">{stat.title}</span>
            </div>
            <div className="border-t border-border-default pt-4">
              <div className="font-display font-bold text-[32px] text-primary leading-none mb-2">
                {stat.value}
              </div>
              <div className="text-[13px] text-secondary">{stat.subtitle}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
