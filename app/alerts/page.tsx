import AlertTable from '@/components/dashboard/AlertTable';

export default function AlertsPage() {
  return (
    <div className="pb-16 flex flex-col gap-2">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-primary mb-2">Alert History</h1>
        <p className="text-secondary">Full log of all detections and automated responses across monitored protocols.</p>
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <select className="bg-surface border border-border-default rounded-lg px-4 py-2 text-[14px] text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary">
          <option>All Rules</option>
          <option>Flash Loan + Drain</option>
          <option>TVL Velocity Drop</option>
          <option>Bridge Outflow Spike</option>
        </select>
        <select className="bg-surface border border-border-default rounded-lg px-4 py-2 text-[14px] text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary">
          <option>All Severities</option>
          <option>Critical (&gt;=90)</option>
          <option>High (&gt;=75)</option>
          <option>Medium (&gt;=60)</option>
        </select>
        <input 
          type="text" 
          placeholder="Search by ID or tx signature..." 
          className="bg-surface border border-border-default rounded-lg px-4 py-2 text-[14px] text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary flex-1 max-w-sm"
        />
        <button className="bg-surface border border-border-default text-primary font-medium text-[14px] px-4 py-2 rounded-lg hover:bg-black/5 transition-colors ml-auto">
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-9">
          <div className="-mt-8">
            <AlertTable />
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="bg-surface border border-border-default rounded-xl p-5 shadow-sm sticky top-24">
            <h3 className="font-display font-semibold text-[16px] text-primary mb-4">Detection Rules</h3>
            <div className="space-y-4">
              <div className="border-l-2 border-severity-critical-border pl-3">
                <div className="text-[13px] font-semibold text-primary mb-1">Flash Loan + Drain</div>
                <div className="text-[12px] text-secondary">Detects flash borrow followed by TVL drop within the same slot window.</div>
              </div>
              <div className="border-l-2 border-severity-high-border pl-3">
                <div className="text-[13px] font-semibold text-primary mb-1">TVL Velocity Drop</div>
                <div className="text-[12px] text-secondary">Detects rapid TVL drop {'>'} 20% within a 10-slot rolling window.</div>
              </div>
              <div className="border-l-2 border-severity-medium-border pl-3">
                <div className="text-[13px] font-semibold text-primary mb-1">Bridge Outflow Spike</div>
                <div className="text-[12px] text-secondary">Detects funds leaving Solana via known bridge programs.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
