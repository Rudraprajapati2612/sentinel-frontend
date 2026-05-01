'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Alert } from '@/lib/types';
import RuleBadge from '@/components/shared/RuleBadge';
import SeverityBadge from '@/components/shared/SeverityBadge';
import ExplorerLink from '@/components/shared/ExplorerLink';
import { getRuleTitle } from '@/lib/utils';
import { Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AlertFeed() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/alerts');
        if (response.ok) {
          const data = await response.json();
          setAlerts(data);
        }
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 2000);
    return () => clearInterval(interval);
  }, []);

  const getBorderColor = (severity: number) => {
    if (severity >= 90) return 'var(--severity-critical-border)';
    if (severity >= 75) return 'var(--severity-high-border)';
    return 'var(--severity-medium-border)';
  };

  const getDotColor = (severity: number) => {
    if (severity >= 90) return 'var(--severity-critical-dot)';
    if (severity >= 75) return 'var(--severity-high-dot)';
    return 'var(--severity-medium-dot)';
  };

  const formatRelativeTime = (isoString: string) => {
    const date = new Date(isoString);
    const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <div className="mb-4 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--severity-critical-dot)] animate-pulse" />
          <h2 className="font-display font-semibold text-[18px] text-primary">Live Alert Feed</h2>
        </div>
        <span className="text-[13px] text-tertiary">Newest first · Auto-refreshing every 2s</span>
      </div>

      <div className="flex-1 space-y-3 max-h-[480px] overflow-y-auto pr-2">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface rounded-xl border border-border-default shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:bg-[var(--bg-subtle)] transition-all duration-200 p-[16px] cursor-pointer flex flex-col gap-3"
              style={{ borderLeft: `4px solid ${getBorderColor(alert.severity)}` }}
              onClick={() => router.push('/alerts')}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <RuleBadge rule={alert.rule_triggered} />
                  <SeverityBadge severity={alert.severity} />
                </div>
                <span className="text-[12px] text-tertiary">{formatRelativeTime(alert.created_at)}</span>
              </div>

              <div>
                <h3 className="font-bold text-[15px] text-primary mb-1">
                  {getRuleTitle(alert.rule_triggered)} Detected
                </h3>
                <div className="font-mono text-[13px] text-secondary">
                  Slot #{alert.slot} · At risk: ${(alert.at_risk_usd / 1000).toFixed(1)}K USDC
                </div>
                <div className="font-mono text-[13px] text-secondary mt-1">
                  On-chain tx: <ExplorerLink signature={alert.pause_tx_sig} />
                </div>
              </div>

              <div className="mt-1">
                <div className="flex items-center gap-1.5 w-fit bg-severity-critical-bg text-severity-critical-text border border-severity-critical-border px-2 py-0.5 rounded text-[11px] font-bold tracking-wider">
                  <div className="w-1.5 h-1.5 rounded-full bg-severity-critical-dot" />
                  PAUSED
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {!isLoading && alerts.length === 0 && (
          <div className="h-[200px] rounded-[10px] border-2 border-dashed border-border-default bg-surface flex flex-col items-center justify-center text-tertiary">
            <Shield size={32} className="mb-3 opacity-60" />
            <span className="text-[14px]">Watching for threats...</span>
          </div>
        )}
      </div>
    </div>
  );
}
