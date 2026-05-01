'use client';

import { useState } from 'react';
import { Alert } from '@/lib/types';
import RuleBadge from '@/components/shared/RuleBadge';
import SeverityBadge from '@/components/shared/SeverityBadge';
import ExplorerLink from '@/components/shared/ExplorerLink';
import AddressBadge from '@/components/shared/AddressBadge';
import StatusIndicator from '@/components/shared/StatusIndicator';
import { X } from 'lucide-react';
import { getRuleTitle, formatUSD } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';

const ALERTS: Alert[] = [
  {
    id: 'a-1',
    rule_triggered: 'FLASH_LOAN_DRAIN',
    severity: 64,
    protocol: '3Eue3cN8zMkeCHLiy6KNNSi6AjKdDfJTBsME4md3xcaC',
    slot: 1053,
    at_risk_usd: 517800,
    pause_tx_sig: '28wPiUdajetVddnuKq7NHqMVfgRcrYxKccq1E1vAjRuwCsH2LRQDbBRvTi9sz5XuFtPZm7Vk1SYUDARFMAHZMsou',
    status: 'PAUSED',
    created_at: new Date(Date.now() - 1000 * 60 * 3).toISOString(), // 3 mins ago
    time_ago: '3m ago'
  },
  {
    id: 'a-2',
    rule_triggered: 'TVL_VELOCITY',
    severity: 99,
    protocol: '3Eue3cN8zMkeCHLiy6KNNSi6AjKdDfJTBsME4md3xcaC',
    slot: 930,
    at_risk_usd: 200000,
    pause_tx_sig: '3sX4PLsGqo9rhVCZ1vRWRoK9kx7VNkkYfrDmrDnjgNHHawpeK7MqccZxVJesYp8N9XDUyeNYxvoZuCU5rYyet3F8',
    status: 'PAUSED',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    time_ago: '1d ago'
  }
];

export default function AlertTable() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  return (
    <div className="mt-[32px] lg:mt-0">
      <div className="bg-surface border border-border-default rounded-[12px] shadow-[var(--shadow-sm)] overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-subtle border-b border-border-default text-[12px] text-tertiary font-bold tracking-[0.06em] uppercase">
              <th className="py-[10px] px-[20px] whitespace-nowrap">ID</th>
              <th className="py-[10px] px-[20px] whitespace-nowrap">Rule</th>
              <th className="py-[10px] px-[20px] whitespace-nowrap">Severity</th>
              <th className="py-[10px] px-[20px] whitespace-nowrap">At Risk</th>
              <th className="py-[10px] px-[20px] whitespace-nowrap">Slot</th>
              <th className="py-[10px] px-[20px] whitespace-nowrap">Time</th>
              <th className="py-[10px] px-[20px] whitespace-nowrap">On-chain Tx</th>
              <th className="py-[10px] px-[20px] whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default text-[14px]">
            {ALERTS.map((alert) => (
              <tr 
                key={alert.id} 
                className="hover:bg-subtle cursor-pointer transition-colors"
                onClick={() => setSelectedAlert(alert)}
              >
                <td className="py-[14px] px-[20px] font-mono text-[12px] text-tertiary">{alert.id}</td>
                <td className="py-[14px] px-[20px]">
                  <RuleBadge rule={alert.rule_triggered} />
                </td>
                <td className="py-[14px] px-[20px]">
                  <SeverityBadge severity={alert.severity} />
                </td>
                <td className="py-[14px] px-[20px] font-semibold text-primary">
                  ${(alert.at_risk_usd / 1000).toFixed(0)}k
                </td>
                <td className="py-[14px] px-[20px] font-mono text-[12px] text-secondary">#{alert.slot}</td>
                <td className="py-[14px] px-[20px] text-tertiary">{alert.time_ago}</td>
                <td className="py-[14px] px-[20px]">
                  <ExplorerLink signature={alert.pause_tx_sig} />
                </td>
                <td className="py-[14px] px-[20px]">
                  <StatusIndicator status={alert.status} showText />
                </td>
              </tr>
            ))}
            {ALERTS.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-tertiary">
                  No alerts recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedAlert && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-primary/30 z-40 backdrop-blur-sm"
              onClick={() => setSelectedAlert(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="fixed right-0 top-0 h-screen w-[400px] bg-surface shadow-[var(--shadow-md)] border-l border-border-default z-50 overflow-y-auto flex flex-col"
            >
              <div className="p-6 border-b border-border-default flex items-center justify-between sticky top-0 bg-surface">
                <div className="flex items-center gap-3">
                  <h2 className="font-display font-semibold text-[18px] text-primary">Alert {selectedAlert.id}</h2>
                  <SeverityBadge severity={selectedAlert.severity} />
                </div>
                <button 
                  onClick={() => setSelectedAlert(null)}
                  className="p-1.5 rounded bg-surface hover:bg-subtle text-secondary transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-8 flex-1">
                <div>
                  <h4 className="text-[11px] font-bold uppercase text-tertiary tracking-wider mb-3">Rule Details</h4>
                  <div className="bg-subtle border border-border-default rounded-[8px] p-4">
                    <div className="font-semibold text-[14px] text-primary mb-1">{getRuleTitle(selectedAlert.rule_triggered)}</div>
                    <RuleBadge rule={selectedAlert.rule_triggered} />
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase text-tertiary tracking-wider mb-3">Protocol</h4>
                  <div className="flex items-center justify-between border-b border-border-default pb-2">
                    <AddressBadge address={selectedAlert.protocol} chars={8} />
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase text-tertiary tracking-wider mb-3">Threat Context</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] text-secondary">At Risk Amount</span>
                      <span className="font-semibold text-primary">{formatUSD(selectedAlert.at_risk_usd)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] text-secondary">Detection Slot</span>
                      <span className="font-mono text-[13px]">#{selectedAlert.slot}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] text-secondary">Timestamp</span>
                      <span className="text-[13px] text-tertiary">{new Date(selectedAlert.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase text-tertiary tracking-wider mb-3">Response Action</h4>
                  <div className="bg-severity-critical-bg border border-severity-critical-border rounded-[8px] p-4 text-severity-critical-text text-[13px]">
                    <div className="flex justify-between items-center mb-2">
                      <strong className="font-semibold">Pause Executed</strong>
                      <span className="font-mono text-[11px] opacity-80">(Program Instruction)</span>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-severity-critical-border/30">
                      <span>Tx:</span>
                      <ExplorerLink signature={selectedAlert.pause_tx_sig} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
