'use client';

import { useState } from 'react';
import { Alert } from '@/lib/types';
import RuleBadge from '@/components/shared/RuleBadge';
import ExplorerLink from '@/components/shared/ExplorerLink';
import StatusIndicator from '@/components/shared/StatusIndicator';
import { X, Copy, ExternalLink, Filter, CheckSquare } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const ALERTS: Alert[] = [
  {
    id: '083613b1',
    rule_triggered: 'FLASH_LOAN_DRAIN',
    severity: 79,
    protocol: '3Eue3cN8zMkeCHLiy6KNNSi6AjKdDfJTBsME4md3xcaC',
    slot: 593,
    at_risk_usd: 517800,
    pause_tx_sig: 'pD7PNeW8qXsvRW7tRgToqK12...',
    status: 'PAUSED',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    time_ago: '3d ago'
  },
  {
    id: 'cc199083',
    rule_triggered: 'TVL_VELOCITY',
    severity: 84,
    protocol: '3Eue3cN8zMkeCHLiy6KNNSi6AjKdDfJTBsME4md3xcaC',
    slot: 488,
    at_risk_usd: 418500,
    pause_tx_sig: '5x12ykKe...7b8w',
    status: 'PAUSED',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    time_ago: '3d ago'
  },
  {
    id: '73cf63b2',
    rule_triggered: 'FLASH_LOAN_DRAIN',
    severity: 79,
    protocol: '3Eue3cN8zMkeCHLiy6KNNSi6AjKdDfJTBsME4md3xcaC',
    slot: 12951,
    at_risk_usd: 514500,
    pause_tx_sig: '5vH78jsm...zPLe',
    status: 'PAUSED',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    time_ago: '3d ago'
  },
  {
    id: '56fab4a1',
    rule_triggered: 'TVL_VELOCITY',
    severity: 84,
    protocol: '3Eue3cN8zMkeCHLiy6KNNSi6AjKdDfJTBsME4md3xcaC',
    slot: 12845,
    at_risk_usd: 406800,
    pause_tx_sig: '66YCTCfC...v66Y',
    status: 'PAUSED',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    time_ago: '3d ago'
  }
];

export default function AlertTable({ ruleFilter = 'All Rules', severityFilter = 'All Severities' }: { ruleFilter?: string, severityFilter?: string }) {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAlerts = ALERTS.filter(alert => {
    if (ruleFilter !== 'All Rules' && alert.rule !== ruleFilter) return false;
    if (severityFilter !== 'All Severities') {
      if (severityFilter.includes('Critical') && alert.severity < 90) return false;
      if (severityFilter.includes('High') && (alert.severity < 75 || alert.severity >= 90)) return false;
      if (severityFilter.includes('Medium') && alert.severity >= 75) return false;
    }
    return true;
  });

  const toggleAll = () => {
    if (selectedRows.size === filteredAlerts.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(filteredAlerts.map(a => a.id)));
  };

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };

  return (
    <>
      <AnimatePresence>
        {selectedRows.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-[100] bg-primary text-[var(--bg-surface)] px-6 py-4 rounded-2xl flex items-center justify-between gap-12 shadow-[var(--shadow-lg)] border border-[var(--border-strong)]"
          >
            <div className="flex items-center gap-3">
              <CheckSquare size={20} className="text-[var(--brand-primary)]" />
              <span className="font-bold text-[15px]">{selectedRows.size} alerts selected</span>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-[var(--bg-surface)]/10 hover:bg-[var(--bg-surface)]/20 rounded-lg text-[13px] font-bold transition-colors">Acknowledge</button>
              <button className="px-4 py-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-dark)] rounded-lg text-[13px] font-bold transition-colors">Export CSV</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[var(--bg-base)] border border-[var(--border-default)] rounded-[12px] shadow-[var(--shadow-sm)] overflow-hidden p-1">
        <div className="bg-surface rounded-[10px] overflow-hidden">
          <div className="px-[24px] py-[20px]">
            <h3 className="font-display font-bold text-[16px] text-primary mb-1">Alert History</h3>
            <p className="text-[13px] text-secondary">{filteredAlerts.length} total - Sorted by newest</p>
          </div>
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[var(--bg-base)] border-y border-[var(--border-default)] text-[11px] text-tertiary font-bold tracking-wider uppercase">
                <th className="py-[12px] px-[24px] whitespace-nowrap w-[40px]">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.size === filteredAlerts.length && filteredAlerts.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-[var(--border-strong)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                  />
                </th>
                <th className="py-[12px] px-[24px] whitespace-nowrap">ALERT ID</th>
                <th className="py-[12px] px-[24px] whitespace-nowrap cursor-pointer hover:bg-[var(--border-default)]/20 transition-colors">
                  <div className="flex items-center gap-1.5">RULE <Filter size={12} className="text-[var(--text-tertiary)]" /></div>
                </th>
                <th className="py-[12px] px-[24px] whitespace-nowrap cursor-pointer hover:bg-[var(--border-default)]/20 transition-colors">
                  <div className="flex items-center gap-1.5">SEVERITY <Filter size={12} className="text-[var(--text-tertiary)]" /></div>
                </th>
                <th className="py-[12px] px-[24px] whitespace-nowrap">AT RISK</th>
                <th className="py-[12px] px-[24px] whitespace-nowrap">SLOT</th>
                <th className="py-[12px] px-[24px] whitespace-nowrap">TIME</th>
                <th className="py-[12px] px-[24px] whitespace-nowrap">ON-CHAIN TX</th>
                <th className="py-[12px] px-[24px] whitespace-nowrap">STATUS</th>
              </tr>
            </thead>
            <tbody className="text-[13px] divide-y divide-[var(--border-default)]">
              {filteredAlerts.length > 0 ? filteredAlerts.map((alert) => (
                <tr 
                  key={alert.id} 
                  className={`hover:bg-subtle cursor-pointer transition-colors ${selectedRows.has(alert.id) ? 'bg-subtle/50' : 'bg-[var(--bg-base)]/30'}`}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <td className="py-[16px] px-[24px]" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={selectedRows.has(alert.id)}
                      onChange={(e) => toggleRow(alert.id, e as any)}
                      className="w-4 h-4 rounded border-[var(--border-strong)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] cursor-pointer"
                    />
                  </td>
                  <td className="py-[16px] px-[24px] font-mono text-tertiary">{alert.id}</td>
                  <td className="py-[16px] px-[24px]">
                    <span className="bg-surface border border-border-default rounded-md px-2 py-1 font-semibold text-[12px] text-primary shadow-sm whitespace-nowrap">
                      {alert.rule_triggered === 'FLASH_LOAN_DRAIN' ? 'Flash Loan + Drain' : 'TVL Velocity Drop'}
                    </span>
                  </td>
                  <td className="py-[16px] px-[24px]">
                    <div className="flex items-center gap-2 w-24">
                      <div className="flex-1 h-1.5 bg-border-default rounded-full overflow-hidden">
                        <div className="h-full bg-severity-high-dot" style={{ width: `${alert.severity}%` }} />
                      </div>
                      <span className="font-medium text-primary">{alert.severity}</span>
                    </div>
                  </td>
                  <td className="py-[16px] px-[24px] font-bold text-status-paused">
                    ${(alert.at_risk_usd / 1000).toFixed(1)}K
                  </td>
                  <td className="py-[16px] px-[24px] font-mono text-secondary">#{alert.slot}</td>
                  <td className="py-[16px] px-[24px] text-secondary">{alert.time_ago}</td>
                  <td className="py-[16px] px-[24px]">
                    <div className="flex items-center gap-1.5 text-secondary">
                      <span className="font-mono">{alert.pause_tx_sig}</span>
                      <ExternalLink size={12} className="text-tertiary" />
                    </div>
                  </td>
                  <td className="py-[16px] px-[24px]">
                    <div className="font-bold text-[11px] tracking-widest text-status-paused bg-severity-critical-bg border border-severity-critical-border px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                      PAUSED
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} className="py-[32px] text-center text-secondary text-[14px]">
                    No alerts match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm"
              onClick={() => setSelectedAlert(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[600px] bg-[var(--bg-surface)] rounded-[20px] shadow-[var(--shadow-lg)] border border-[var(--border-default)] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-border-default">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="bg-[var(--bg-base)] border border-border-default rounded-[6px] px-2.5 py-1 text-[11px] font-bold text-primary shadow-sm uppercase tracking-wide">
                      {selectedAlert.rule_triggered === 'FLASH_LOAN_DRAIN' ? 'Flash Loan + Drain' : 'TVL Velocity Drop'}
                    </div>
                    <div className="bg-severity-high-bg border border-severity-high-border rounded-[6px] px-2.5 py-1 text-[11px] font-bold text-severity-high-text flex items-center gap-1.5 shadow-sm uppercase tracking-wide">
                      <div className="w-1.5 h-1.5 rounded-full bg-severity-high-dot" />
                      HIGH ({selectedAlert.severity}/99)
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedAlert(null)}
                    className="text-tertiary hover:text-primary transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <h2 className="font-display font-bold text-[22px] text-primary leading-snug pr-8">
                  {selectedAlert.rule_triggered === 'FLASH_LOAN_DRAIN' ? 'Flash Loan + Drain' : 'TVL Velocity Drop'} Detected on MockProtocol
                </h2>
              </div>

              <div className="p-6 space-y-8">
                <div>
                  <h4 className="text-[11px] font-bold uppercase text-tertiary tracking-wider mb-2">ALERT ID (FULL HEX)</h4>
                  <div className="bg-[var(--bg-base)] border border-border-default rounded-[8px] p-3 flex justify-between items-center group">
                    <span className="font-mono text-[13px] text-secondary truncate">
                      3caaf2bd684ada43e350d8f2ec87dde5dd73ef41bc81d0527efb6cd6e429cfc3
                    </span>
                    <button 
                      onClick={() => handleCopy('3caaf2bd684ada43e350d8f2ec87dde5dd73ef41bc81d0527efb6cd6e429cfc3')} 
                      className="shrink-0 ml-4 flex items-center transition-colors"
                    >
                      {copiedId === '3caaf2bd684ada43e350d8f2ec87dde5dd73ef41bc81d0527efb6cd6e429cfc3' ? (
                        <span className="text-[11px] font-bold text-[var(--status-active)]">COPIED</span>
                      ) : (
                        <Copy className="text-tertiary hover:text-primary cursor-pointer" size={14} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase text-tertiary tracking-wider mb-2">WHAT HAPPENED</h4>
                  <div className="text-[14px] text-secondary leading-relaxed">
                    Flash loan detected (confidence: 80%) followed by TVL drop within 5-slot window. Severity: {selectedAlert.severity}/99. Slot #{selectedAlert.slot}. At risk: <span className="font-bold text-status-paused">${(selectedAlert.at_risk_usd / 1000).toFixed(1)}K</span> USDC.
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase text-tertiary tracking-wider mb-2">ON-CHAIN PAUSE TRANSACTION</h4>
                  <div className="text-[14px] text-secondary flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors w-fit group">
                    <span className="font-mono">pD7PNeW8qXsvRW7tRgTo...x1u7</span>
                    <ExternalLink size={14} className="text-tertiary group-hover:text-primary transition-colors" />
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase text-tertiary tracking-wider mb-3">TIMELINE</h4>
                  <div className="relative pl-[18px] space-y-[18px] before:absolute before:inset-y-[10px] before:left-[5px] before:w-[2px] before:bg-[var(--brand-primary)]">
                    <div className="relative flex justify-between text-[13px]">
                      <div className="absolute -left-[18px] top-[6px] w-[8px] h-[8px] rounded-full bg-[var(--brand-primary)] shadow-[0_0_8px_var(--brand-primary)]" />
                      <span className="text-[var(--text-primary)] font-medium">Detection at slot #{selectedAlert.slot}</span>
                      <span className="text-[var(--text-tertiary)]">{selectedAlert.time_ago}</span>
                    </div>
                    <div className="relative flex justify-between text-[13px]">
                      <div className="absolute -left-[18px] top-[6px] w-[8px] h-[8px] rounded-full bg-[var(--brand-primary)]" />
                      <span className="text-[var(--text-primary)] font-medium">Alert emitted - severity {selectedAlert.severity}</span>
                      <span className="text-[var(--text-tertiary)]">{selectedAlert.time_ago}</span>
                    </div>
                    <div className="relative flex justify-between text-[13px]">
                      <div className="absolute -left-[18px] top-[6px] w-[8px] h-[8px] rounded-full bg-[var(--brand-primary)]" />
                      <span className="text-[var(--text-primary)] font-medium">Pause tx sent to Solana</span>
                      <span className="text-[var(--text-tertiary)]">{selectedAlert.time_ago}</span>
                    </div>
                    <div className="relative flex justify-between text-[13px]">
                      <div className="absolute -left-[18px] top-[6px] w-[8px] h-[8px] rounded-full bg-[var(--brand-primary)]" />
                      <span className="text-[var(--text-primary)] font-medium flex items-center gap-1">Pause tx confirmed <span className="text-[14px]">✅</span></span>
                      <span className="text-[var(--text-tertiary)]">{selectedAlert.time_ago}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
