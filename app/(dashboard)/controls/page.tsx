import { MOCK_PROTOCOL_ID, SENTINEL_PROGRAM_ID, SENTINEL_STATE_PDA, PROTOCOL_AUTHORITY, VAULT_ADDRESS } from '@/lib/constants';
import AddressBadge from '@/components/shared/AddressBadge';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export default function ControlsPage() {
  return (
    <div className="flex flex-col">
      <div className="mb-2">
        <h1 className="font-display font-bold text-[28px] text-primary">Protocol Controls</h1>
        <p className="text-[16px] text-secondary mt-1">Manual actions and integration settings for monitored protocols.</p>
      </div>

      <div className="flex gap-[32px] mt-[32px] items-start">
        {/* Left Column: Actions */}
        <div className="flex-1 min-w-0 space-y-8">
          <div className="bg-surface border border-border-default rounded-[12px] p-[24px] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-200">
            <h3 className="font-display font-semibold text-[18px] text-primary mb-2 flex items-center gap-2">
              <ShieldAlert className="text-brand-primary" size={20} />
              Protocol Override
            </h3>
            <p className="text-[14px] text-secondary mb-6">
              Manually pause or unpause the active protocol. This requires the protocol authority signature.
            </p>
            <div className="flex gap-4">
              <button disabled className="bg-brand-primary text-white font-semibold text-[14px] px-[20px] py-[10px] rounded-[8px] flex-1 opacity-50 cursor-not-allowed">
                Unpause Protocol
              </button>
              <button className="bg-surface border-[1.5px] border-[#ef4444] text-[#ef4444] hover:bg-[#fff1f0] font-semibold text-[14px] px-[20px] py-[10px] rounded-[8px] flex-1 transition-colors">
                Emergency Pause
              </button>
            </div>
            <div className="mt-6 bg-[#f0fdf4] border border-[#86efac] text-[#15803d] px-[16px] py-[10px] rounded-[8px] text-[14px] font-medium flex items-center gap-[8px]">
              <ShieldCheck size={18} />
              Authority key loaded and ready to sign.
            </div>
          </div>

          <div className="bg-surface border border-border-default rounded-[12px] p-[24px] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-200">
            <h3 className="font-display font-semibold text-[18px] text-primary mb-2">Register New Protocol</h3>
            <p className="text-[14px] text-secondary mb-6">
              Add a new protocol to the SentinelGuard watcher by registering its authority and vault addresses.
            </p>
            <form className="space-y-[16px]">
              <div>
                <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Protocol Program ID</label>
                <input type="text" className="w-full bg-surface border border-border-default rounded-[8px] p-[10px_14px] text-[14px] focus:outline-none focus:ring-[2px] focus:ring-brand-primary transition-shadow" placeholder="Enter program ID..." />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Vault Address</label>
                <input type="text" className="w-full bg-surface border border-border-default rounded-[8px] p-[10px_14px] text-[14px] focus:outline-none focus:ring-[2px] focus:ring-brand-primary transition-shadow" placeholder="Enter vault or liquidity pool address..." />
              </div>
              <button type="button" className="w-full bg-brand-primary text-white font-semibold text-[15px] p-[12px] rounded-[8px] mt-[16px] hover:bg-brand-dark transition-colors shadow-sm">
                Generate Registration Ix
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Config */}
        <div className="w-[320px] shrink-0 bg-surface border border-border-default rounded-[12px] p-[20px] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-200">
          <h3 className="font-display font-semibold text-[18px] text-primary mb-6">Current Configuration</h3>
          
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-semibold text-tertiary uppercase tracking-[0.08em] mb-[12px]">NETWORK SETTINGS</div>
              <div className="space-y-[12px]">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-secondary">RPC Endpoint</span>
                  <span className="text-[13px] font-mono text-primary truncate max-w-[140px]" title="http://127.0.0.1:8899">http://127.0.0.1:8899</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-secondary">Cluster</span>
                  <span className="text-[13px] font-mono text-primary">localnet</span>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-border-default w-full"></div>

            <div>
              <div className="text-[11px] font-semibold text-tertiary uppercase tracking-[0.08em] mb-[12px]">MANAGED ADDRESSES</div>
              <div className="space-y-[12px]">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-secondary">Sentinel Program</span>
                  <AddressBadge address={SENTINEL_PROGRAM_ID} chars={6} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-secondary">SentinelState PDA</span>
                  <AddressBadge address={SENTINEL_STATE_PDA} chars={6} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-secondary">Active Protocol</span>
                  <AddressBadge address={MOCK_PROTOCOL_ID} chars={6} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-secondary">Protocol Authority</span>
                  <AddressBadge address={PROTOCOL_AUTHORITY} chars={6} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-secondary">Vault / Escrow</span>
                  <AddressBadge address={VAULT_ADDRESS} chars={6} />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
