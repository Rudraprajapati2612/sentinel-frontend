import AlertTable from '@/components/dashboard/AlertTable';
import { Search } from 'lucide-react';

export default function AlertsPage() {
  return (
    <div className="flex flex-col">
      <div className="mb-2">
        <h1 className="font-display font-bold text-[28px] text-primary">Alert History</h1>
        <p className="text-secondary text-[16px] mt-1">Full log of all detections and automated responses across monitored protocols.</p>
      </div>
      
      <div className="flex items-center gap-[12px] my-[20px]">
        <select className="h-[38px] bg-surface border border-border-default rounded-lg px-[12px] text-[14px] text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary">
          <option>All Rules</option>
          <option>Flash Loan + Drain</option>
          <option>TVL Velocity Drop</option>
          <option>Bridge Outflow Spike</option>
        </select>
        <select className="h-[38px] bg-surface border border-border-default rounded-lg px-[12px] text-[14px] text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary">
          <option>All Severities</option>
          <option>Critical (&gt;=90)</option>
          <option>High (&gt;=75)</option>
          <option>Medium (&gt;=60)</option>
        </select>
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" />
          <input 
            type="text" 
            placeholder="Search by ID or tx signature..." 
            className="w-full h-[38px] bg-surface border border-border-default rounded-lg pl-9 pr-3 text-[14px] text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
        <button className="bg-brand-primary text-white font-medium text-[14px] px-[16px] py-[8px] rounded-lg hover:bg-brand-dark transition-colors ml-auto shadow-sm">
          Export CSV
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 min-w-0">
          <AlertTable />
        </div>
        <div className="w-full lg:w-[280px]">
          <div className="bg-surface border border-border-default rounded-[12px] p-[20px] shadow-[var(--shadow-sm)] sticky top-24">
            <h3 className="font-display font-semibold text-[16px] text-primary mb-4">Detection Rules</h3>
            <div className="space-y-[16px]">
              <div className="border-l-[3px] border-[#ef4444] pl-3">
                <div className="text-[14px] font-semibold text-primary mb-1">Flash Loan + Drain</div>
                <div className="text-[13px] text-secondary">Detects flash borrow followed by TVL drop within the same slot window.</div>
              </div>
              <div className="border-l-[3px] border-[#f97316] pl-3">
                <div className="text-[14px] font-semibold text-primary mb-1">TVL Velocity Drop</div>
                <div className="text-[13px] text-secondary">Detects rapid TVL drop {'>'} 20% within a 10-slot rolling window.</div>
              </div>
              <div className="border-l-[3px] border-[#eab308] pl-3">
                <div className="text-[14px] font-semibold text-primary mb-1">Bridge Outflow Spike</div>
                <div className="text-[13px] text-secondary">Detects funds leaving Solana via known bridge programs.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
