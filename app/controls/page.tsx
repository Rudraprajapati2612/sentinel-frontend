import { MOCK_PROTOCOL_ID, SENTINEL_PROGRAM_ID, SENTINEL_STATE_PDA, PROTOCOL_AUTHORITY, VAULT_ADDRESS } from '@/lib/constants';
import AddressBadge from '@/components/shared/AddressBadge';
import { ShieldAlert, Key } from 'lucide-react';

export default function ControlsPage() {
  return (
    <div className="pb-16 flex flex-col gap-2">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-primary mb-2">Protocol Controls</h1>
        <p className="text-secondary">Manual actions and integration settings for monitored protocols.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Actions */}
        <div className="space-y-8">
          <div className="bg-surface border border-border-default rounded-xl p-6 shadow-sm">
            <h3 className="font-display font-semibold text-[18px] text-primary mb-2 flex items-center gap-2">
              <ShieldAlert className="text-brand-primary" size={20} />
              Protocol Override
            </h3>
            <p className="text-[14px] text-secondary mb-6">
              Manually pause or unpause the active protocol. This requires the protocol authority signature.
            </p>
            <div className="flex gap-4">
              <button disabled className="bg-brand-primary/50 cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium text-[14px] flex-1">
                Unpause Protocol
              </button>
              <button className="bg-surface border border-status-paused text-status-paused hover:bg-status-paused hover:text-white transition-colors px-6 py-2.5 rounded-lg font-medium text-[14px] flex-1">
                Emergency Pause
              </button>
            </div>
            <div className="mt-4 bg-severity-safe-bg text-severity-safe-text border border-severity-safe-border px-4 py-3 rounded-lg text-[13px] flex items-center gap-2">
              <Key size={16} />
              Authority key loaded and ready to sign.
            </div>
          </div>

          <div className="bg-surface border border-border-default rounded-xl p-6 shadow-sm">
            <h3 className="font-display font-semibold text-[18px] text-primary mb-2">Register New Protocol</h3>
            <p className="text-[14px] text-secondary mb-6">
              Add a new protocol to the SentinelGuard watcher by registering its authority and vault addresses.
            </p>
            <form className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-tertiary uppercase tracking-wider mb-1">Protocol Program ID</label>
                <input type="text" className="w-full bg-base border border-border-default rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" placeholder="Enter program ID..." />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-tertiary uppercase tracking-wider mb-1">Vault Address</label>
                <input type="text" className="w-full bg-base border border-border-default rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" placeholder="Enter vault or liquidity pool address..." />
              </div>
              <button type="button" className="w-full bg-brand-primary hover:bg-brand-dark transition-colors text-white px-6 py-2.5 rounded-lg font-medium text-[14px] mt-2">
                Generate Registration Ix
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Config */}
        <div className="bg-surface border border-border-default rounded-xl p-6 shadow-sm">
          <h3 className="font-display font-semibold text-[18px] text-primary mb-6">Current Configuration</h3>
          
          <div className="space-y-6">
            <div>
              <div className="text-[12px] font-semibold text-tertiary uppercase tracking-wider mb-2">Network Settings</div>
              <div className="bg-inset rounded-lg p-4 space-y-3 font-mono text-[13px]">
                <div className="flex justify-between">
                  <span className="text-secondary">RPC Endpoint</span>
                  <span className="text-primary truncate max-w-[200px]">http://127.0.0.1:8899</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Cluster</span>
                  <span className="text-primary">localnet</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[12px] font-semibold text-tertiary uppercase tracking-wider mb-2">Managed Addresses</div>
              <div className="bg-inset rounded-lg p-4 space-y-4">
                <div>
                  <div className="text-[11px] text-secondary mb-1">Sentinel Program</div>
                  <AddressBadge address={SENTINEL_PROGRAM_ID} chars={12} />
                </div>
                <div>
                  <div className="text-[11px] text-secondary mb-1">SentinelState PDA</div>
                  <AddressBadge address={SENTINEL_STATE_PDA} chars={12} />
                </div>
                <div>
                  <div className="text-[11px] text-secondary mb-1">Active Protocol</div>
                  <AddressBadge address={MOCK_PROTOCOL_ID} chars={12} />
                </div>
                <div>
                  <div className="text-[11px] text-secondary mb-1">Protocol Authority</div>
                  <AddressBadge address={PROTOCOL_AUTHORITY} chars={12} />
                </div>
                <div>
                  <div className="text-[11px] text-secondary mb-1">Vault / Escrow</div>
                  <AddressBadge address={VAULT_ADDRESS} chars={12} />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
