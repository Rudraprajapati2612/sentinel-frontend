'use client';

import { Alert } from '@/lib/types';
import RuleBadge from '@/components/shared/RuleBadge';
import SeverityBadge from '@/components/shared/SeverityBadge';
import ExplorerLink from '@/components/shared/ExplorerLink';
import AddressBadge from '@/components/shared/AddressBadge';
import StatusIndicator from '@/components/shared/StatusIndicator';

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
  return (
    <div className="mt-8">
      <div className="mb-4">
        <h2 className="font-display font-semibold text-[18px] text-primary">Alert History</h2>
      </div>

      <div className="bg-surface border border-border-default rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-subtle border-b border-border-default text-[11px] text-tertiary font-bold tracking-wider uppercase">
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Rule</th>
              <th className="py-4 px-6">Severity</th>
              <th className="py-4 px-6">At Risk</th>
              <th className="py-4 px-6">Slot</th>
              <th className="py-4 px-6">Time</th>
              <th className="py-4 px-6">On-chain Tx</th>
              <th className="py-4 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default text-[14px]">
            {ALERTS.map((alert) => (
              <tr key={alert.id} className="hover:bg-black/[0.02] cursor-pointer transition-colors">
                <td className="py-4 px-6 font-mono text-[12px] text-secondary">{alert.id}</td>
                <td className="py-4 px-6">
                  <RuleBadge rule={alert.rule_triggered} />
                </td>
                <td className="py-4 px-6">
                  <SeverityBadge severity={alert.severity} />
                </td>
                <td className="py-4 px-6 font-medium text-primary">
                  ${(alert.at_risk_usd / 1000).toFixed(0)}k
                </td>
                <td className="py-4 px-6 font-mono text-[12px] text-secondary">#{alert.slot}</td>
                <td className="py-4 px-6 text-secondary">{alert.time_ago}</td>
                <td className="py-4 px-6">
                  <ExplorerLink signature={alert.pause_tx_sig} />
                </td>
                <td className="py-4 px-6">
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
    </div>
  );
}
