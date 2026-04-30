'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import ExplorerLink from '../shared/ExplorerLink';

const ALERTS = [
  {
    type: "TVL_VELOCITY",
    severity: 99,
    label: "CRITICAL",
    title: "TVL Velocity Drop Detected",
    protocol: "3Eue3cN8...xcaC",
    slot: 930,
    atRisk: "$200,000 USDC",
    pauseTx: "3sX4PLsG...et3F8",
    time: "Paused in 2.1s",
    status: "PAUSED",
    color: "var(--severity-critical-border)"
  },
  {
    type: "FLASH_LOAN_DRAIN",
    severity: 64,
    label: "MEDIUM",
    title: "Flash Loan + Drain Detected",
    protocol: "3Eue3cN8...xcaC",
    slot: 1053,
    atRisk: "$517,800 USDC",
    pauseTx: "28wPiUda...Msou",
    time: "Paused in 3.4s",
    status: "PAUSED",
    color: "var(--severity-medium-border)"
  }
];

export default function Hero() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((i) => (i + 1) % ALERTS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const alert = ALERTS[idx];

  return (
    <section className="bg-hero pt-24 pb-32 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7">
          <span className="text-brand-primary text-[12px] font-semibold tracking-[0.1em] uppercase mb-4 block">
            REAL-TIME SOLANA SECURITY
          </span>
          <h1 className="font-display font-bold text-[56px] text-primary leading-[1.1] tracking-[-0.03em] mb-6">
            Detect exploits.<br />
            Pause protocols.<br />
            Save funds.
          </h1>
          <p className="font-body text-[18px] text-secondary leading-[1.6] max-w-2xl mb-10">
            SentinelGuard watches every Solana transaction in real time. 
            When a flash loan drain or TVL attack is detected, it autonomously 
            submits a pause instruction on-chain &mdash; in under 3 seconds.
          </p>
          <div className="flex items-center gap-3 mb-8">
            <Link href="/dashboard" className="px-6 py-3 bg-brand-primary text-white text-[15px] font-medium rounded-xl hover:bg-brand-dark transition-colors">
              Launch Dashboard &rarr;
            </Link>
            <Link href="#" className="px-6 py-3 border border-border-strong text-primary text-[15px] font-medium rounded-xl hover:bg-black/5 transition-colors">
              View on GitHub
            </Link>
          </div>
          <div className="flex items-center gap-6 text-[13px] text-tertiary">
            <span className="flex items-center gap-1.5"><span className="text-status-active">✓</span> 5 attack scenarios tested</span>
            <span className="flex items-center gap-1.5"><span className="text-status-active">✓</span> 2 rule types confirmed</span>
            <span className="flex items-center gap-1.5"><span className="text-status-active">✓</span> Sub-3s response</span>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 relative h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 bg-surface rounded-xl shadow-lg border-l-4 p-6 flex flex-col justify-between border-y border-r border-y-border-default border-r-border-default h-fit my-auto"
              style={{ borderLeftColor: alert.color }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <span className="text-[10px] bg-inset px-2 py-0.5 rounded font-mono text-secondary">{alert.type}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono border`} style={{
                    borderColor: alert.color,
                    color: alert.label === 'CRITICAL' ? 'var(--severity-critical-text)' : 'var(--severity-medium-text)',
                    backgroundColor: alert.label === 'CRITICAL' ? 'var(--severity-critical-bg)' : 'var(--severity-medium-bg)'
                  }}>
                    {alert.label}
                  </span>
                </div>
                <span className="text-[12px] text-tertiary">{alert.time}</span>
              </div>
              
              <h3 className="font-display font-semibold text-xl text-primary mb-6">{alert.title}</h3>
              
              <div className="space-y-3 mb-6 font-mono text-[13px] text-secondary">
                <div className="flex justify-between"><span className="text-tertiary">Protocol</span><span>{alert.protocol}</span></div>
                <div className="flex justify-between"><span className="text-tertiary">Slot</span><span>#{alert.slot}</span></div>
                <div className="flex justify-between"><span className="text-tertiary">At risk</span><span className="text-primary font-medium">{alert.atRisk}</span></div>
                <div className="flex justify-between items-center"><span className="text-tertiary">Pause tx</span><ExplorerLink signature={alert.pauseTx} /></div>
              </div>

              <div className="pt-4 border-t border-border-default flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-status-paused animate-pulse" />
                  <span className="text-[12px] font-semibold text-status-paused tracking-wide">{alert.status}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
