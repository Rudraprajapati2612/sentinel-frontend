'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Alert } from '@/lib/types';
import RuleBadge from '@/components/shared/RuleBadge';
import SeverityBadge from '@/components/shared/SeverityBadge';
import ExplorerLink from '@/components/shared/ExplorerLink';
import { getRuleTitle } from '@/lib/utils';
import { ShieldAlert } from 'lucide-react';

const INITIAL_ALERTS: Alert[] = [
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

export default function AlertFeed() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);

  const getBorderColor = (rule: string) => {
    if (rule === 'FLASH_LOAN_DRAIN') return 'var(--severity-critical-border)';
    if (rule === 'TVL_VELOCITY') return 'var(--severity-high-border)';
    return 'var(--severity-medium-border)';
  };

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <div className="mb-4">
        <h2 className="font-display font-semibold text-[18px] text-primary">Live Alert Feed</h2>
        <span className="text-[13px] text-tertiary">Newest first · Auto-refreshing every 2s</span>
      </div>

      <div className="flex-1 space-y-4">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface rounded-xl shadow-sm p-5 border-y border-r border-y-border-default border-r-border-default border-l-4"
              style={{ borderLeftColor: getBorderColor(alert.rule_triggered) }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <RuleBadge rule={alert.rule_triggered} />
                  <SeverityBadge severity={alert.severity} />
                </div>
                <span className="text-[12px] text-tertiary">{alert.time_ago}</span>
              </div>

              <h3 className="font-display font-semibold text-[16px] text-primary mb-4">
                {getRuleTitle(alert.rule_triggered)}
              </h3>

              <div className="space-y-2 mb-5 font-mono text-[13px] text-secondary">
                <div className="flex justify-between border-b border-border-default pb-2">
                  <span className="text-tertiary">Protocol</span>
                  <span className="truncate max-w-[200px]">{alert.protocol}</span>
                </div>
                <div className="flex justify-between border-b border-border-default py-2">
                  <span className="text-tertiary">Slot</span>
                  <span>#{alert.slot}</span>
                </div>
                <div className="flex justify-between border-b border-border-default py-2">
                  <span className="text-tertiary">At risk</span>
                  <span className="text-primary font-medium">${(alert.at_risk_usd / 1000).toFixed(1)}k USDC</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-tertiary">On-chain tx</span>
                  <ExplorerLink signature={alert.pause_tx_sig} />
                </div>
              </div>

              <div className="bg-subtle p-3 rounded-lg flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-status-paused animate-pulse" />
                <span className="text-[12px] font-bold text-status-paused tracking-wide">
                  {alert.status}
                </span>
                <span className="text-[12px] text-secondary ml-auto">
                  Action taken
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {alerts.length === 0 && (
          <div className="h-[200px] border-2 border-dashed border-border-default rounded-xl flex flex-col items-center justify-center text-tertiary">
            <ShieldAlert size={32} className="mb-4 opacity-50" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-status-watching animate-pulse" />
              <span className="text-[14px]">Watching for threats...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
