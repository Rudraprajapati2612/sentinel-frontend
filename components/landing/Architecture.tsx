'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ARCHITECTURE_LAYERS = [
  {
    id: 'solana',
    title: 'SOLANA BLOCKCHAIN',
    sublabel: '~400ms slots · Geyser events',
    color: '#1e3a8a',
    connectorLabel: 'WebSocket stream',
    description: 'The foundation of every detection. SentinelGuard connects directly to a local Solana validator, receiving every block at the native ~400ms slot cadence via the Geyser WebSocket plugin. No API rate limits. No polling delays. Every transaction touching the monitored protocol is seen in real time.',
    bullets: [
      'Local validator access — no RPC rate limits',
      'Full block coverage via Yellowstone Geyser plugin',
      '~400ms slot cadence — native chain speed',
      'Pubkey: EbVbJD...VYa7m'
    ],
    badges: ['Yellowstone', 'Geyser', '~400ms slots']
  },
  {
    id: 'grpc',
    title: 'gRPC / WEBSOCKET STREAMS',
    sublabel: 'Yellowstone · Geyser plugin',
    color: '#2563eb',
    connectorLabel: 'ParsedTransaction',
    description: 'Raw blockchain events stream over gRPC using the Yellowstone Geyser plugin, providing SentinelGuard with a high-throughput, low-latency feed of slot updates, account deltas, and transaction confirmations. Unlike polling, this is push-based — events arrive the moment they are finalized.',
    bullets: [
      'Push-based — no polling, no missed transactions',
      'Yellowstone Geyser plugin for sub-millisecond delivery',
      'Slot updates + account changes + tx confirmations',
      'Bidirectional gRPC stream for control messages'
    ],
    badges: ['gRPC', 'WebSocket', 'Push-based']
  },
  {
    id: 'parser',
    title: 'TRANSACTION PARSER',
    sublabel: 'geyser.rs · Flash detection · 3 methods',
    color: '#3b82f6',
    connectorLabel: 'broadcast channel (10k)',
    description: 'geyser.rs is the decode layer. It receives every raw transaction and extracts structured intelligence: token balance deltas, CPI call trees, flash loan evidence via 3 methods: Program ID (conf 95), Log keyword (conf 70), Delta pattern (conf 55). Writes TVL to Redis every slot. Broadcasts ParsedTransaction on channel (cap: 10,000).',
    bullets: [
      'geyser.rs — Rust async parser, zero-copy deserialization',
      'Token delta computation: before/after balances per tx',
      'Flash loan detection: Program ID (conf 95), Log keyword (70), Delta pattern (55)',
      '+10 confidence boost when 2+ methods agree',
      'Writes TVL to Redis · Broadcasts ParsedTransaction (channel cap: 10,000)'
    ],
    badges: ['geyser.rs', 'Rust', '3 heuristics', 'Redis TVL']
  },
  {
    id: 'engine',
    title: 'DETECTION ENGINE',
    sublabel: 'engine.rs · R1 · R2 · R3 · Score ≥ 60',
    color: '#60a5fa',
    connectorLabel: 'AlertEvent (score ≥ 60)',
    description: 'engine.rs — evaluates 3 rules on every ParsedTransaction. R1 flash_loan.rs: flash + TVL drop >15% in 5 slots, score 40–99. R2 tvl_velocity.rs: TVL drop ≥20% in 3 slots, score 75–99. R3 bridge_spike.rs: outflow 10x rolling avg, score 85–95. Fires AlertEvent when score ≥ 60.',
    bullets: [
      'engine.rs — rolling 5-slot evaluation window, every slot',
      'R1 Flash Loan Drain: flash evidence + TVL drop ≥20%, score 0–95',
      'R2 TVL Velocity: ≥20% TVL drop in 3 slots, score 0–99',
      'R3 Bridge Outflow Spike: 10× rolling average outflow, score 85–95',
      'max(R1, R2, R3) — threshold 60 triggers AlertEvent',
      'Redis deduplication: cooldown + paused keys prevent re-fire'
    ],
    badges: ['engine.rs', 'R1/R2/R3', 'Score ≥ 60', 'Redis dedup']
  },
  {
    id: 'responder',
    title: 'RESPONDER SERVICE',
    sublabel: 'pause.rs · webhooks.rs · DB insert',
    color: '#93c5fd',
    connectorLabel: 'webhook / Kafka / WS feed',
    description: 'On AlertEvent — simultaneously: (1) sends pause_withdrawals Anchor instruction on-chain, (2) inserts alert to PostgreSQL, (3) publishes to Kafka topic, (4) dispatches webhooks to Discord/Telegram. Entire detect-to-pause loop: ~2–3s.',
    bullets: [
      'Redis optimistic pause key set in ~2ms — blocks further processing',
      'pause.rs: builds pause_withdrawals Anchor instruction, skipPreflight',
      'On-chain confirmation in ~400ms (localnet latency)',
      'webhooks.rs: Kafka topic sentinel.alerts + Discord notification',
      'PostgreSQL insert with ON CONFLICT DO NOTHING deduplication',
      'Confirmed pause txs: 3sX4PLsG... · 28wPiUda...'
    ],
    badges: ['pause.rs', 'webhooks.rs', '~2ms pause', 'Kafka', 'PostgreSQL']
  },
  {
    id: 'dashboard',
    title: 'DASHBOARD & OUTPUTS',
    sublabel: 'Next.js · WS feed · Kafka · REST',
    color: '#bfdbfe',
    connectorLabel: '',
    description: 'Next.js 14. WebSocket feed at /feed. REST endpoints: /alerts, /stats, /tvl-history/:protocol. Shows live alert stream, TVL chart, protocol status, on-chain pause confirmations.',
    bullets: [
      'Next.js 14 App Router — TypeScript, Tailwind, Recharts',
      'WS /feed — real-time alert push to dashboard UI',
      'REST: /alerts, /tvl, /protocol-status, /stats',
      'On-chain state read directly from SentinelState PDA',
      'One-click unpause_withdrawals instruction from UI',
      'SentinelState PDA: 2oQ8Z6u...mt8q'
    ],
    badges: ['Next.js 14', 'WebSocket', 'REST', 'One-click unpause']
  }
];

export default function ArchitectureSection() {
  const [activeStep, setActiveStep] = useState(-1);
  const sectionRef = useRef<HTMLElement>(null);
  const accordionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const hasAutoOpened = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAutoOpened.current) {
            hasAutoOpened.current = true;
            setTimeout(() => {
              setActiveStep(0);
            }, 400);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Sync scroll for accordion items
  useEffect(() => {
    if (activeStep !== -1 && accordionRefs.current[activeStep]) {
      accordionRefs.current[activeStep]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeStep]);

  const reversedLayers = [...ARCHITECTURE_LAYERS].reverse();

  return (
    <section ref={sectionRef} className="py-20 px-10 max-w-7xl mx-auto bg-[#eef1f8]">
      <style>{`
        @keyframes slideDown {
          0% { transform: translateY(0); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(14px); opacity: 0; }
        }
      `}</style>

      {/* Header */}
      <div className="mb-14">
        <span className="text-[#2563eb] text-[12px] font-semibold tracking-[0.12em] uppercase block mb-3">
          SYSTEM ARCHITECTURE
        </span>
        <h2 className="text-[#0f172a] text-4xl font-bold mb-3">
          Six layers of on-chain defense.
        </h2>
        <p className="text-[#475569] text-[17px]">
          Every component engineered for sub-second threat response.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row items-start gap-[32px]">
        {/* Left: Diagram (sticky) */}
        <div className="w-full md:w-[44%] sticky top-24 bg-[#ffffff] rounded-[16px] border border-[#d1d9ee] shadow-[0_4px_16px_rgba(15,23,42,0.08)] py-[32px] px-[24px] flex flex-col items-center justify-center">
          <div className="flex flex-col items-center w-full">
            {ARCHITECTURE_LAYERS.map((layer, originalIdx) => {
              const isActive = activeStep === originalIdx;
              const anyActive = activeStep !== -1;
              const isDimmed = anyActive && !isActive;

              // The connector goes below this slab, connecting to the one underneath it
              const hasConnectorBelow = originalIdx < ARCHITECTURE_LAYERS.length - 1;
              const connectorLabel = layer.connectorLabel;

              return (
                <div key={layer.id} className="relative flex flex-col items-center w-full">
                  {/* Layer Slab */}
                  <div
                    onClick={() => setActiveStep(prev => prev === originalIdx ? -1 : originalIdx)}
                    className="relative w-full max-w-[420px] rounded-[10px] flex flex-col justify-center items-center cursor-pointer select-none mx-auto z-10"
                    style={{
                      padding: '18px 24px',
                      textAlign: 'center',
                      transform: isActive ? 'scale(1.02)' : 'scale(1)',
                      backgroundColor: layer.color,
                      opacity: isDimmed ? 0.72 : 1,
                      filter: isDimmed ? 'saturate(0.7)' : 'saturate(1)',
                      boxShadow: isActive ? '0 0 0 2px #2563eb, 0 8px 24px rgba(37,99,235,0.18)' : '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
                      transition: isActive ? 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)' : 'all 0.25s ease',
                    }}
                  >
                    <span 
                      className="font-display font-bold text-[14px] tracking-[0.08em] uppercase block"
                      style={{ color: originalIdx >= 4 ? '#0f172a' : '#ffffff' }}
                    >
                      {layer.title}
                    </span>
                    <span 
                      className="font-mono text-[12px] mt-1 block"
                      style={{ color: originalIdx >= 4 ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.6)', opacity: 0.75 }}
                    >
                      {layer.sublabel}
                    </span>
                  </div>

                  {/* Connector leading down to the next visual slab */}
                  {hasConnectorBelow && (
                    <div 
                      className="relative h-[40px] flex flex-col items-center justify-center w-full my-1 z-0"
                      style={{ transition: 'opacity 0.25s ease', opacity: (!anyActive || isActive || activeStep === originalIdx + 1) ? 1 : 0.5 }}
                    >
                      <div className="w-[2px] h-[16px] bg-[#2563eb]/30 relative overflow-visible flex-shrink-0">
                        {(isActive || activeStep === originalIdx + 1) && (
                          <div 
                            className="absolute left-1/2 -translate-x-1/2 w-[4px] h-[4px] bg-[#2563eb] rounded-full" 
                            style={{ animation: 'slideDown 1.5s ease infinite' }} 
                          />
                        )}
                      </div>
                      <ChevronDown size={16} color="#2563eb" className="-mt-1 z-10 flex-shrink-0" />
                      <span className="font-mono text-[11px] text-[#475569] bg-white z-10 my-[2px]">
                        {connectorLabel}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Accordion Panel */}
        <div className="w-full md:w-[52%] flex flex-col">
          {ARCHITECTURE_LAYERS.map((layer, idx) => {
            const isActive = activeStep === idx;
            const numberLabel = `0${idx + 1}`;

            return (
              <div
                key={layer.id}
                ref={el => { accordionRefs.current[idx] = el; }}
                onClick={() => setActiveStep(isActive ? -1 : idx)}
                className="cursor-pointer border-b border-[#d1d9ee] overflow-hidden transition-colors duration-300 relative group"
                style={{
                  backgroundColor: isActive ? '#f0f4ff' : 'transparent',
                  borderLeft: `3px solid ${isActive ? '#2563eb' : 'transparent'}`,
                }}
              >
                {/* Header Row */}
                <div className="flex items-center gap-4 px-5 h-[56px]">
                  <span className="font-mono text-[13px] font-medium text-[#94a3b8] min-w-[28px]">{numberLabel}</span>
                  
                  <span 
                    className="w-[10px] h-[10px] rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: layer.color,
                      transform: isActive ? 'scale(1.2)' : 'scale(1)',
                    }}
                  />
                  
                  <span className="flex-1 font-display font-semibold text-[15px] text-[#0f172a]">
                    {layer.title}
                  </span>
                  
                  <ChevronDown 
                    size={20} 
                    className="text-[#94a3b8] transition-transform duration-200 ease"
                    style={{ transform: isActive ? 'rotate(180deg)' : 'rotate(0)' }}
                  />
                </div>

                {/* Expanded Content */}
                <div 
                  className="grid transition-all duration-300 ease-in-out"
                  style={{ gridTemplateRows: isActive ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <div className="pb-4 pt-0 px-[20px] pl-[64px]">
                      <p className="text-[14px] text-[#475569] leading-relaxed mb-4">
                        {layer.description}
                      </p>
                      
                      <ul className="mb-5 space-y-2">
                        {layer.bullets.map((bullet, i) => (
                          <li key={i} className="text-[13px] text-[#475569] relative pl-4 leading-relaxed">
                            <span className="absolute left-0 top-0 text-[#2563eb]">•</span>
                            {bullet}
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-2">
                        {layer.badges.map(badge => (
                          <span 
                            key={badge} 
                            className="font-mono text-[12px] px-2 py-0.5 rounded-[4px]"
                            style={{ backgroundColor: '#e2e8f5', color: '#1e40af' }}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
