'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import dynamic from 'next/dynamic';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ARCHITECTURE_LAYERS, CONNECTOR_LABELS } from '@/lib/constants';

const ArchNode3D = dynamic(() => import('./ArchitectureNode3D'), {
  ssr: false,
  loading: () => <div style={{ width: 80, height: 80 }} />,
});

const ACCORDION_CONTENT: Record<string, any> = {
  solana: {
    description: "The foundation of every detection. SentinelGuard connects directly to a local Solana validator, receiving every block at the native ~400ms slot cadence via the Geyser WebSocket plugin. No API rate limits. No polling delays. Every transaction touching the monitored protocol is seen in real time.",
    bullets: [
      "Local validator access — no RPC rate limits",
      "Full block coverage via Yellowstone Geyser plugin",
      "~400ms slot cadence — native chain speed",
      "Pubkey: EbVbJD...VYa7m",
    ],
    badges: ["Yellowstone", "Geyser", "~400ms slots"]
  },
  grpc: {
    description: "Raw blockchain events stream over gRPC using the Yellowstone Geyser plugin, providing SentinelGuard with a high-throughput, low-latency feed of slot updates, account deltas, and transaction confirmations. Unlike polling, this is push-based — events arrive the moment they are finalized.",
    bullets: [
      "Push-based — no polling, no missed transactions",
      "Yellowstone Geyser plugin for sub-millisecond delivery",
      "Slot updates + account changes + tx confirmations",
      "Bidirectional gRPC stream for control messages"
    ],
    badges: ["gRPC", "WebSocket", "Push-based"]
  },
  parser: {
    description: "geyser.rs is the decode layer. It receives every raw transaction and extracts structured intelligence: token balance deltas, CPI call trees, flash loan evidence across three independent detection methods, and program ID fingerprints. Parsed TVL is written to Redis every slot.",
    bullets: [
      "geyser.rs — Rust async parser, zero-copy deserialization",
      "Token delta computation: before/after balances per tx",
      "Flash loan detection: Program ID (conf 95), Log keyword (70), Delta pattern (55)",
      "+10 confidence boost when 2+ methods agree",
      "Writes TVL to Redis · Broadcasts ParsedTransaction (channel cap: 10,000)"
    ],
    badges: ["geyser.rs", "Rust", "3 heuristics", "Redis TVL"]
  },
  engine: {
    description: "engine.rs evaluates every incoming ParsedTransaction against three threat rules in a rolling 5-slot window. The maximum score across R1, R2, R3 is taken — if it exceeds 60, an AlertEvent is fired. Redis prevents duplicate alerts during the cooldown.",
    bullets: [
      "engine.rs — rolling 5-slot evaluation window, every slot",
      "R1 Flash Loan Drain: flash evidence + TVL drop ≥20%, score 0–95",
      "R2 TVL Velocity: ≥20% TVL drop in 3 slots, score 0–99",
      "R3 Bridge Outflow Spike: 10× rolling average outflow, score 85–95",
      "max(R1, R2, R3) — threshold 60 triggers AlertEvent",
      "Redis deduplication: cooldown + paused keys prevent re-fire"
    ],
    badges: ["engine.rs", "R1/R2/R3", "Score ≥ 60", "Redis dedup"]
  },
  responder: {
    description: "The responder acts the moment an AlertEvent is emitted. Redis sets a protocol_paused key in ~2ms. pause.rs builds and submits the pause_withdrawals on-chain instruction via skipPreflight for maximum speed. webhooks.rs fans out to Kafka, Discord, and the API feed simultaneously.",
    bullets: [
      "Redis optimistic pause key set in ~2ms — blocks further processing",
      "pause.rs: builds pause_withdrawals Anchor instruction, skipPreflight",
      "On-chain confirmation in ~400ms (localnet latency)",
      "webhooks.rs: Kafka topic sentinel.alerts + Discord notification",
      "PostgreSQL insert with ON CONFLICT DO NOTHING deduplication",
      "Confirmed pause txs: 3sX4PLsG... · 28wPiUda..."
    ],
    badges: ["pause.rs", "webhooks.rs", "~2ms pause", "Kafka", "PostgreSQL"]
  },
  dashboard: {
    description: "The output layer: a Next.js 14 dashboard receiving all alerts and protocol state in real time. WebSocket /feed pushes events as they happen. REST endpoints serve alert history, TVL snapshots, and on-chain protocol status read directly from Solana RPC.",
    bullets: [
      "Next.js 14 App Router — TypeScript, Tailwind, Recharts",
      "WS /feed — real-time alert push to dashboard UI",
      "REST: /alerts, /tvl, /protocol-status, /stats",
      "On-chain state read directly from SentinelState PDA",
      "One-click unpause_withdrawals instruction from UI",
      "SentinelState PDA: 2oQ8Z6u...mt8q"
    ],
    badges: ["Next.js 14", "WebSocket", "REST", "One-click unpause"]
  }
};

export default function Architecture() {
  const [activeStep, setActiveStep] = useState(-1);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.getAttribute('data-step') ?? '-1');
            setActiveStep(idx);
          }
        });
      },
      { threshold: 0.6 }
    );
    stepRefs.current.forEach(ref => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="arch-section">
      <div className="arch-header">
        <span className="eyebrow">SYSTEM ARCHITECTURE</span>
        <h2>Six layers of on-chain defense.</h2>
        <p>Every component engineered for sub-second threat response.</p>
      </div>

      <div className="arch-layout">
        <div className="arch-left">
          <div className="layer-stack">
            {[...ARCHITECTURE_LAYERS].reverse().map((layer, reversedIdx) => {
              const idx = ARCHITECTURE_LAYERS.length - 1 - reversedIdx;
              const isActive = idx === activeStep;
              const isDimmed = activeStep !== -1 && !isActive;

              return (
                <div key={layer.id}>
                  {idx < ARCHITECTURE_LAYERS.length - 1 && (
                    <div 
                      className={`arch-connector ${isActive || idx === activeStep - 1 ? 'active' : ''}`}
                      style={{ 
                        backgroundColor: layer.color, 
                        color: layer.color // Used for the ::after arrowhead
                      }}
                    >
                      <span className="arch-connector-label">
                        {CONNECTOR_LABELS[idx]}
                      </span>
                      <div className="particle-dot" style={{ opacity: isActive || idx === activeStep - 1 ? 0.9 : 0.3 }} />
                      <div className="particle-dot" style={{ animationDelay: '0.4s', opacity: isActive || idx === activeStep - 1 ? 0.9 : 0.3 }} />
                      <div className="particle-dot" style={{ animationDelay: '0.8s', opacity: isActive || idx === activeStep - 1 ? 0.9 : 0.3 }} />
                    </div>
                  )}

                  <div className="arch-node-3d hidden md:block" style={{ opacity: isActive ? 1 : (activeStep !== -1 ? 0.65 : 1) }}>
                    <ArchNode3D
                      type={layer.nodeType}
                      color={layer.color}
                      isActive={isActive}
                      width={80}
                      height={80}
                    />
                  </div>

                  <motion.div
                    className={`arch-layer-slab ${isActive ? 'active' : ''} ${isDimmed ? 'dimmed' : ''}`}
                    style={{ 
                      backgroundColor: layer.color,
                      boxShadow: isActive ? `0 0 0 2px #ffffff, 0 0 20px ${layer.color}` : '0 4px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25)' 
                    }}
                    onClick={() => setActiveStep(idx)}
                    animate={{ y: isActive ? -3 : 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div>
                      <span className="slab-label" style={{ color: '#ffffff' }}>
                        {layer.label}
                      </span>
                      <span className="slab-sublabel" style={{ color: 'rgba(255,255,255,0.65)' }}>
                        {layer.sublabel}
                      </span>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="arch-right">
          {ARCHITECTURE_LAYERS.map((layer, idx) => (
            <div
              key={layer.id}
              ref={el => { stepRefs.current[idx] = el; }}
              data-step={idx}
              className={`accordion-item ${idx === activeStep ? 'active' : ''}`}
              onClick={() => setActiveStep(idx)}
              style={{
                borderLeftColor: idx === activeStep ? layer.color : 'transparent'
              }}
            >
              <div className="accordion-header">
                <span className="accordion-num">0{idx + 1}</span>
                <span 
                  className="accordion-dot" 
                  style={{ 
                    backgroundColor: layer.color,
                    boxShadow: idx === activeStep ? `0 0 0 3px ${layer.color}33` : 'none',
                    transform: idx === activeStep ? 'scale(1.3)' : 'scale(1)'
                  }} 
                />
                <span className="accordion-title">{layer.label}</span>
                {idx === activeStep ? <ChevronUp size={16} className="text-tertiary" /> : <ChevronDown size={16} className="text-tertiary" />}
              </div>

              <AnimatePresence>
                {idx === activeStep && (
                  <motion.div
                    className="accordion-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <p className="accordion-desc">{ACCORDION_CONTENT[layer.id].description}</p>
                    <ul className="accordion-bullets">
                      {ACCORDION_CONTENT[layer.id].bullets.map((b: string, i: number) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                    <div className="accordion-badges">
                      {ACCORDION_CONTENT[layer.id].badges.map((badge: string) => (
                        <span 
                          key={badge} 
                          className="tech-badge"
                          style={{
                            background: `${layer.color}1E`, // approx 12% opacity
                            border: `1px solid ${layer.color}59`, // approx 35% opacity
                            color: '#1e40af' // User said layer's dark text equivalent #1e40af
                          }}
                        >{badge}</span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
