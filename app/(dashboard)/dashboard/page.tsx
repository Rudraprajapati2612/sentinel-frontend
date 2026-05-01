import StatsRow from '@/components/dashboard/StatsRow';
import TVLChart from '@/components/dashboard/TVLChart';
import AlertFeed from '@/components/dashboard/AlertFeed';
import { RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <header className="flex items-center justify-between mb-[24px]">
        <h1 className="font-display font-bold text-[24px] text-primary">Dashboard</h1>
        
        <div className="flex items-center gap-[24px]">
          <span className="text-[13px] text-tertiary font-mono">
            Last updated: 3s ago
          </span>
          <div className="flex items-center gap-2 bg-subtle px-3 py-1.5 rounded-full border border-brand-light">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[12px] font-semibold text-brand-primary tracking-[0.05em] uppercase">Live</span>
          </div>
          <button className="text-[13px] font-medium px-[14px] py-[6px] border border-border-default rounded-[8px] flex items-center gap-2 hover:bg-black/5 transition-colors bg-surface shadow-sm">
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </header>

      <StatsRow />
      <TVLChart />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
        <div className="lg:col-span-12 h-full">
          <AlertFeed />
        </div>
      </div>
    </div>
  );
}
