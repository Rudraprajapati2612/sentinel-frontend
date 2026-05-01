'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Alert } from '@/lib/types';
import RuleBadge from '@/components/shared/RuleBadge';
import SeverityBadge from '@/components/shared/SeverityBadge';
import ExplorerLink from '@/components/shared/ExplorerLink';
import { getRuleTitle } from '@/lib/utils';
import { Radar } from 'lucide-react';

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

  const hasHighSeverity = alerts.some(a => a.severity >= 75);

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="font-display font-semibold text-[18px] text-primary">Live Alert Feed</h2>
        {hasHighSeverity && <div className="w-2 h-2 rounded-full bg-status-paused animate-pulse" />}
      </div>

      <div className="flex-1 space-y-3">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface rounded-[10px] border border-border-default shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-200 p-[14px_16px] flex items-center justify-between gap-4"
              style={{ borderLeft: `4px solid ${getBorderColor(alert.rule_triggered)}` }}
            >
              {/* Left */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <SeverityBadge severity={alert.severity} />
                <RuleBadge rule={alert.rule_triggered} />
              </div>

              {/* Center */}
              <div className="flex-1 flex flex-col justify-center items-center">
                <div className="font-bold text-[15px] text-primary">
                  ${(alert.at_risk_usd / 1000).toFixed(1)}k at risk
                </div>
                <div className="font-mono text-[12px] text-secondary">
                  #{alert.slot}
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0 text-right">
                <span className="text-[12px] text-tertiary">{alert.time_ago}</span>
                <span className="text-brand-primary text-[13px] font-medium hover:underline">
                  <ExplorerLink signature={alert.pause_tx_sig} label="→ tx" type="tx" />
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {alerts.length === 0 && (
          <div className="h-[120px] rounded-[10px] border border-border-default bg-surface flex flex-col items-center justify-center text-tertiary">
            <Radar size={24} className="mb-2 opacity-60" />
            <span className="text-[13px]">Watching for threats...</span>
          </div>
        )}
      </div>
    </div>
  );
}
