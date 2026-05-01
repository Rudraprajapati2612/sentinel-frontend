'use client';

import { MOCK_PROTOCOL_ID, SENTINEL_STATE_PDA, VAULT_ADDRESS } from '@/lib/constants';
import AddressBadge from '@/components/shared/AddressBadge';
import StatusIndicator from '@/components/shared/StatusIndicator';
import { formatUSD } from '@/lib/utils';
import { ShieldCheck, PauseOctagon } from 'lucide-react';

export default function ProtocolPanel() {
  const isPaused = true;
  
  return (
    <div className="h-full">
      <div className="mb-4">
        <h2 className="font-display font-semibold text-[18px] text-primary">Protocol Status</h2>
        <span className="text-[13px] text-tertiary">Live from SentinelState PDA</span>
      </div>

      <div className="bg-surface border border-border-default rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-border-default bg-subtle">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-semibold text-[16px] text-primary">MockProtocol (USDC Vault)</h3>
            <StatusIndicator status={isPaused ? "PAUSED" : "ACTIVE"} showText />
          </div>
        </div>

        {/* Stats */}
        <div className="p-5 border-b border-border-default space-y-4">
          <div>
            <div className="text-[12px] font-semibold tracking-wider text-tertiary uppercase mb-1">Current TVL</div>
            <div className="font-display font-bold text-[28px] text-primary">
              {formatUSD(882200)}
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-tertiary uppercase mb-1">Pause Count</div>
              <div className="text-[15px] font-medium text-secondary">2</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-semibold tracking-wider text-tertiary uppercase mb-1">Last Pause</div>
              <div className="text-[15px] font-medium text-secondary">3 minutes ago</div>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="p-5 border-b border-border-default space-y-4 bg-black/[0.01]">
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-secondary">Program ID</span>
            <AddressBadge address={MOCK_PROTOCOL_ID} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-secondary">SentinelState PDA</span>
            <AddressBadge address={SENTINEL_STATE_PDA} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-secondary">Vault</span>
            <AddressBadge address={VAULT_ADDRESS} />
          </div>
        </div>

        {/* Action */}
        <div className="p-5 mt-auto bg-surface">
          {isPaused ? (
            <button className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-dark transition-colors py-3 rounded-lg text-white font-medium text-[14px]">
              <ShieldCheck size={18} />
              Unpause Protocol
            </button>
          ) : (
            <button className="w-full flex items-center justify-center gap-2 border border-status-paused hover:bg-status-paused/5 transition-colors py-3 rounded-lg text-status-paused font-medium text-[14px]">
              <PauseOctagon size={18} />
              Manual Pause
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
