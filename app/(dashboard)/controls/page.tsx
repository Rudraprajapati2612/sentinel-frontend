'use client';

import { useState } from 'react';
import { MOCK_PROTOCOL_ID, SENTINEL_PROGRAM_ID, SENTINEL_STATE_PDA, PROTOCOL_AUTHORITY, VAULT_ADDRESS } from '@/lib/constants';
import { Copy, AlertTriangle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const CopyableRow = ({ label, value, fullValue }: { label: string; value: string; fullValue: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-b border-border-default pb-4">
      <div className="text-[12px] font-medium text-secondary mb-1.5">{label}</div>
      <div className="flex justify-between items-center group">
        <span className="text-[13px] font-mono text-primary">{value}</span>
        <button onClick={handleCopy} className="flex items-center gap-2">
          {copied ? (
            <span className="text-[11px] font-bold text-[var(--status-active)]">COPIED</span>
          ) : (
            <Copy className="text-tertiary cursor-pointer group-hover:text-primary transition-colors" size={14} />
          )}
        </button>
      </div>
    </div>
  );
};

export default function ControlsPage() {
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handlePause = () => {
    // Logic to pause would go here
    setShowPauseModal(false);
    setConfirmText('');
  };

  return (
    <>
      <div className="flex gap-[24px] items-start pt-2">
        {/* Left Column: Actions */}
        <div className="flex-1 min-w-0 space-y-6">
          <div className="bg-surface border border-border-default rounded-[12px] p-[24px] shadow-[var(--shadow-sm)]">
            <h3 className="font-display font-bold text-[18px] text-primary mb-1">Manual Override</h3>
            <p className="text-[13px] text-secondary mb-6">
              Manually trigger the emergency pause instruction on-chain. This will halt all withdrawals and critical operations.
            </p>
            
            <div className="bg-[var(--bg-base)] border border-border-default rounded-xl p-[20px] mb-5 flex gap-12 items-center">
              <div>
                <div className="text-[12px] font-medium text-tertiary mb-1">Current Status</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-status-active" />
                  <span className="font-bold text-[14px] text-status-active">ACTIVE</span>
                </div>
              </div>
              <div>
                <div className="text-[12px] font-medium text-tertiary mb-1">Pause Count</div>
                <div className="font-bold text-[15px] text-primary">4</div>
              </div>
              <div>
                <div className="text-[12px] font-medium text-tertiary mb-1">Last Paused</div>
                <div className="text-[14px] text-secondary">3d ago</div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowPauseModal(true)}
              className="w-full bg-[var(--severity-critical-dot)] text-white font-bold text-[14px] py-[12px] rounded-[8px] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
            >
              <AlertTriangle size={16} />
              Pause Protocol
            </button>
          </div>

          <div className="bg-surface border border-border-default rounded-[12px] p-[24px] shadow-[var(--shadow-sm)]">
            <h3 className="font-display font-bold text-[18px] text-primary mb-1">Register New Protocol</h3>
            <p className="text-[13px] text-secondary mb-6">
              Add a new protocol for SentinelGuard to monitor
            </p>
            <form className="space-y-[16px]">
              <div>
                <label className="block text-[13px] font-medium text-primary mb-2">Protocol Authority Pubkey</label>
                <input type="text" className="w-full bg-[var(--bg-base)] border border-border-default rounded-[8px] p-[12px] text-[14px] focus:outline-none focus:ring-[2px] focus:ring-brand-primary transition-shadow font-mono text-tertiary" placeholder="Solana pubkey..." />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-primary mb-2">Watcher Pubkey (pre-filled)</label>
                <input type="text" className="w-full bg-[var(--bg-base)] border border-border-default rounded-[8px] p-[12px] text-[14px] focus:outline-none font-mono text-tertiary" readOnly value="keys/watcher-keypair.json" />
              </div>
              <button type="button" className="w-full bg-brand-primary text-white font-bold text-[14px] py-[12px] rounded-[8px] mt-[16px] hover:bg-brand-dark transition-opacity">
                Register Protocol (requires mainnet keypair)
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Config */}
        <div className="w-[340px] shrink-0 bg-surface border border-border-default rounded-[12px] p-[24px] shadow-[var(--shadow-sm)]">
          <h3 className="font-display font-bold text-[16px] text-primary mb-6">Current Config</h3>
          
          <div className="space-y-4">
            <CopyableRow label="Sentinel Program" value="2Fi9UPVbD77Cr2Se...4kQs" fullValue="2Fi9UPVbD77Cr2Sexxxxxxxxxxxxxxxxxxxx4kQs" />
            <CopyableRow label="SentinelState PDA" value="2oQ8Z6ua6jCyXxEz...mt8q" fullValue="2oQ8Z6ua6jCyXxEzxxxxxxxxxxxxxxxxxxxxmt8q" />
            <CopyableRow label="Watcher Pubkey" value="keys/watcher-key...json" fullValue="keys/watcher-keypair.json" />
            
            <div className="border-b border-border-default pb-4">
              <div className="text-[12px] font-medium text-secondary mb-1.5">Detection Window</div>
              <div className="text-[14px] font-bold text-primary">10 slots</div>
            </div>
            
            <div className="border-b border-border-default pb-4">
              <div className="text-[12px] font-medium text-secondary mb-1.5">TVL Drop Threshold</div>
              <div className="text-[14px] font-bold text-primary">20%</div>
            </div>
            
            <div className="border-b border-border-default pb-4">
              <div className="text-[12px] font-medium text-secondary mb-1.5">Min Severity to Pause</div>
              <div className="text-[14px] font-bold text-primary">60</div>
            </div>
            
            <div className="border-b border-border-default pb-4">
              <div className="text-[12px] font-medium text-secondary mb-1.5">Alert Cooldown</div>
              <div className="text-[14px] font-bold text-primary">30 seconds</div>
            </div>
            
            <div className="pb-2">
              <div className="text-[12px] font-medium text-secondary mb-1.5">Network</div>
              <div className="text-[14px] font-medium text-primary">Localnet (http://127.0.0.1:8899)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pause Confirmation Modal */}
      <AnimatePresence>
        {showPauseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm"
              onClick={() => { setShowPauseModal(false); setConfirmText(''); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-[440px] bg-[var(--bg-surface)] rounded-[16px] shadow-[var(--shadow-lg)] border border-border-default overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-border-default flex items-center gap-3 text-[var(--severity-critical-dot)]">
                <AlertTriangle size={20} />
                <h2 className="font-display font-bold text-[18px] text-primary">Emergency Pause</h2>
                <button 
                  onClick={() => { setShowPauseModal(false); setConfirmText(''); }}
                  className="ml-auto text-tertiary hover:text-primary transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="bg-[var(--severity-critical-bg)] border border-[var(--severity-critical-border)] p-4 rounded-lg">
                  <p className="text-[14px] text-[var(--severity-critical-text)] font-medium leading-relaxed">
                    This action will immediately halt all protocol operations on-chain. Withdrawals will be blocked until the protocol is manually unpaused.
                  </p>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-primary mb-2">
                    Type <span className="font-mono text-[var(--severity-critical-dot)] bg-[var(--bg-base)] px-1 rounded">pause</span> to confirm
                  </label>
                  <input 
                    type="text" 
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="w-full bg-[var(--bg-base)] border border-border-default rounded-[8px] p-[12px] text-[14px] focus:outline-none focus:ring-[2px] focus:ring-[var(--severity-critical-dot)] transition-shadow font-mono text-primary"
                    placeholder="pause" 
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => { setShowPauseModal(false); setConfirmText(''); }}
                    className="flex-1 bg-surface border border-border-default text-primary font-bold text-[14px] py-[10px] rounded-[8px] hover:bg-subtle transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={confirmText !== 'pause'}
                    onClick={handlePause}
                    className="flex-1 bg-[var(--severity-critical-dot)] text-white font-bold text-[14px] py-[10px] rounded-[8px] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-sm"
                  >
                    Execute Pause
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
