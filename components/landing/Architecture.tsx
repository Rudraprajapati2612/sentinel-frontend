'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ARCHITECTURE_LAYERS, CONNECTOR_LABELS } from '@/lib/constants';

const ARCH_COLORS = [
  '#1E2D5A', // 0: solana
  '#2A4A8F', // 1: grpc
  '#3460C0', // 2: parser
  '#4A7ED4', // 3: engine
  '#7AAEE8', // 4: responder
  '#B8D4F5', // 5: dashboard
];

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
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isProgrammaticScroll = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  const handleInteraction = (stepIdx: number, element: HTMLElement | null) => {
    if (activeStep === stepIdx) {
      setActiveStep(null);
      return;
    }
    
    isProgrammaticScroll.current = true;
    setActiveStep(stepIdx);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 800);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.getAttribute('data-step') ?? '-1');
            if (idx !== -1) setActiveStep(idx);
          }
        });
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: 0 }
    );
    stepRefs.current.forEach(ref => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="arch-section-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        /* Base Scoped Layout */
        .arch-section-wrapper {
          max-width: 1280px;
          margin: 0 auto;
          padding: 80px 24px;
          background-color: #eef1f8;
          color: #0f172a;
          font-family: 'Inter', sans-serif;
        }

        .arch-section-header {
          margin-bottom: 56px;
        }

        .arch-eyebrow {
          font-size: 12px;
          text-transform: uppercase;
          color: #2563eb;
          letter-spacing: 0.12em;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .arch-title {
          font-size: 36px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .arch-subtitle {
          font-size: 17px;
          color: #475569;
        }

        .arch-grid-container {
          display: flex;
          flex-direction: column;
          gap: 64px;
        }

        @media (min-width: 1024px) {
          .arch-grid-container {
            flex-direction: row;
            align-items: flex-start;
          }
          .arch-left-column {
            flex: 0 0 55%;
            position: sticky;
            top: 120px;
            align-self: flex-start;
          }
          .arch-right-column {
            flex: 0 0 calc(45% - 64px);
            padding-bottom: 40vh;
          }
        }

        /* Layer Variables mapped to step index */
        .arch-layer-0 { --layer-color: #1E2D5A; --layer-glow: rgba(30, 45, 90, 0.2); --badge-bg: rgba(30, 45, 90, 0.12); --badge-border: rgba(30, 45, 90, 0.35); --badge-text: #1E2D5A; }
        .arch-layer-1 { --layer-color: #2A4A8F; --layer-glow: rgba(42, 74, 143, 0.2); --badge-bg: rgba(42, 74, 143, 0.12); --badge-border: rgba(42, 74, 143, 0.35); --badge-text: #2A4A8F; }
        .arch-layer-2 { --layer-color: #3460C0; --layer-glow: rgba(52, 96, 192, 0.2); --badge-bg: rgba(52, 96, 192, 0.12); --badge-border: rgba(52, 96, 192, 0.35); --badge-text: #3460C0; }
        .arch-layer-3 { --layer-color: #4A7ED4; --layer-glow: rgba(74, 126, 212, 0.2); --badge-bg: rgba(74, 126, 212, 0.12); --badge-border: rgba(74, 126, 212, 0.35); --badge-text: #4A7ED4; }
        .arch-layer-4 { --layer-color: #7AAEE8; --layer-glow: rgba(122, 174, 232, 0.2); --badge-bg: rgba(122, 174, 232, 0.12); --badge-border: rgba(122, 174, 232, 0.35); --badge-text: #1E2D5A; }
        .arch-layer-5 { --layer-color: #B8D4F5; --layer-glow: rgba(184, 212, 245, 0.2); --badge-bg: rgba(184, 212, 245, 0.12); --badge-border: rgba(184, 212, 245, 0.35); --badge-text: #1E2D5A; }

        /* Diagram Stack */
        .arch-diagram-stack {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          padding: 20px 0;
        }

        .arch-layer-node {
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 2;
          transition: opacity 200ms ease, filter 200ms ease, transform 200ms ease;
          cursor: pointer;
        }

        /* 3D Slab Design */
        .arch-layer-slab {
          border-radius: 12px;
          padding: 16px 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border: 2px solid transparent;
          transition: all 200ms ease;
          text-align: center;
          
          /* 3D Depth and Highlight */
          box-shadow: 
            inset 0 1px 0 rgba(255,255,255,0.35),
            inset 0 -1px 0 rgba(0,0,0,0.2),
            0 4px 14px rgba(0,0,0,0.18);
          
          background: linear-gradient(
            135deg, 
            color-mix(in srgb, var(--layer-color) 80%, white) 0%,
            var(--layer-color) 50%,
            color-mix(in srgb, var(--layer-color) 90%, black) 100%
          );
        }

        .arch-layer-label {
          text-transform: uppercase;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.08em;
          font-size: 13px;
          margin-bottom: 4px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
          transition: all 200ms ease;
        }

        .arch-layer-sublabel {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.65);
          transition: all 200ms ease;
        }

        /* Adjust text color for light layers */
        .arch-layer-node.arch-layer-4 .arch-layer-label,
        .arch-layer-node.arch-layer-5 .arch-layer-label {
          color: #1E2D5A;
          text-shadow: none;
        }
        .arch-layer-node.arch-layer-4 .arch-layer-sublabel,
        .arch-layer-node.arch-layer-5 .arch-layer-sublabel {
          color: #1E2D5A;
          opacity: 0.8;
        }

        /* Active State Logic for Nodes */
        .arch-diagram-stack.has-active .arch-layer-node:not(.active) {
          opacity: 0.52;
          filter: brightness(0.72) saturate(0.8);
          transform: scale(0.988);
        }

        .arch-diagram-stack.has-active .arch-layer-node.active {
          opacity: 1;
          filter: none;
          z-index: 10;
        }

        .arch-layer-node.active .arch-layer-slab {
          box-shadow:
            0 0 0 1.5px white,
            0 0 0 3.5px color-mix(in srgb, var(--layer-color) 50%, transparent),
            0 0 32px color-mix(in srgb, var(--layer-color) 60%, transparent),
            0 10px 28px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.4);
          transform: translateY(-4px) scale(1.012);
        }

        /* Connectors (Arrows) */
        .arch-connector {
          position: relative;
          height: 52px;
          width: 100%;
          max-width: 420px;
          margin: 0 auto;
          z-index: 1;
        }

        /* Accordion Styles */
        .arch-accordion-item {
          border-top: 1px solid #d1d9ee;
          margin-top: -1px;
          transition: all 200ms ease;
          cursor: pointer;
          background: transparent;
          position: relative;
          overflow: hidden;
        }
        .arch-accordion-item:last-child {
          border-bottom: 1px solid #d1d9ee;
        }

        .arch-accordion-header {
          display: flex;
          align-items: center;
          height: 56px;
          padding: 0 16px;
        }

        .arch-acc-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #94a3b8;
          margin-right: 16px;
        }

        .arch-acc-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background-color: var(--layer-color);
          margin-right: 12px;
          transition: all 200ms ease;
        }

        .arch-acc-title {
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: #0f172a;
          flex: 1;
        }

        .arch-acc-chevron {
          color: #94a3b8;
          transition: transform 200ms ease;
        }

        /* Active Accordion Item */
        .arch-accordion-item.active {
          background-color: #f0f4ff;
          border-radius: 0 8px 8px 0;
          border-color: transparent;
          z-index: 2;
        }

        .arch-accordion-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background-color: #2563eb;
        }

        .arch-accordion-item.active .arch-acc-dot {
          transform: scale(1.3);
          box-shadow: 0 0 0 3px var(--layer-glow);
        }

        .arch-accordion-item.active .arch-acc-chevron {
          transform: rotate(180deg);
        }

        /* Accordion Content */
        .arch-accordion-content-wrapper {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 280ms ease;
        }
        
        .arch-accordion-item.active .arch-accordion-content-wrapper {
          grid-template-rows: 1fr;
        }

        .arch-accordion-content {
          overflow: hidden;
          padding: 0 16px;
        }

        .arch-accordion-inner {
          padding-bottom: 24px;
          padding-left: 36px;
        }

        .arch-acc-desc {
          font-size: 14px;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 16px;
        }

        .arch-acc-bullets {
          list-style: none;
          margin-bottom: 16px;
        }

        .arch-acc-bullets li {
          position: relative;
          padding-left: 16px;
          font-size: 13px;
          color: #334155;
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .arch-acc-bullets li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--layer-color);
          font-weight: bold;
        }

        .arch-acc-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .arch-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.04em;
          padding: 3px 8px;
          border-radius: 4px;
          background-color: var(--badge-bg);
          border: 1px solid var(--badge-border);
          color: var(--badge-text);
        }
      `}} />

      <div className="arch-section-header">
        <div className="arch-eyebrow">SYSTEM ARCHITECTURE</div>
        <h2 className="arch-title">Six layers of on-chain defense.</h2>
        <p className="arch-subtitle">Every component engineered for sub-second threat response.</p>
      </div>

      <div className="arch-grid-container">
        {/* LEFT PANEL: Diagram Stack */}
        <div className="arch-left-column">
          <div className={`arch-diagram-stack ${activeStep !== null ? 'has-active' : ''}`}>
            
            {ARCHITECTURE_LAYERS.map((layer, idx) => {
              const isActive = idx === activeStep;
              const isConnectorActive = activeStep !== null && (activeStep === idx || activeStep === idx + 1);
              const color = ARCH_COLORS[idx];
              
              return (
                <div key={layer.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <div 
                    className={`arch-layer-node arch-layer-${idx} ${isActive ? 'active' : ''}`}
                    onClick={() => handleInteraction(idx, stepRefs.current[idx])}
                  >
                    <div className="arch-layer-slab">
                      <div className="arch-layer-label">{layer.label}</div>
                      <div className="arch-layer-sublabel">{layer.sublabel}</div>
                    </div>
                  </div>

                  {/* Render Connector IF there is a layer below this one */}
                  {idx < ARCHITECTURE_LAYERS.length - 1 && (
                    <div className="arch-connector">
                      <svg width="40" height="52" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', overflow: 'visible' }}>
                        <defs>
                          <linearGradient id={`g-connector-${idx}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.7"/>
                            <stop offset="100%" stopColor={color} stopOpacity="0.3"/>
                          </linearGradient>
                          <path id={`p-connector-${idx}`} d="M 20 0 L 20 44"/>
                        </defs>
                        
                        {/* Main line - solid gradient */}
                        <line x1="20" y1="0" x2="20" y2="44"
                          stroke={`url(#g-connector-${idx})`}
                          strokeWidth={isConnectorActive ? 2.5 : 1.8}
                          strokeLinecap="round"
                          style={{ transition: 'all 0.3s ease' }}
                        />
                        
                        {/* Arrowhead */}
                        <polygon points="20,52 15,42 25,42"
                          fill={color}
                          opacity={isConnectorActive ? 0.9 : 0.5}
                          style={{ transition: 'all 0.3s ease' }}
                        />
                        
                        {/* Flowing particles - only visible when active */}
                        {isConnectorActive && (
                          <>
                            <circle r="2.5" fill="white" opacity="0.95" style={{ filter: 'drop-shadow(0 0 3px white)' }}>
                              <animateMotion dur="1.2s" repeatCount="indefinite" begin="0s">
                                <mpath href={`#p-connector-${idx}`}/>
                              </animateMotion>
                            </circle>
                            <circle r="2" fill="white" opacity="0.75">
                              <animateMotion dur="1.2s" repeatCount="indefinite" begin="0.4s">
                                <mpath href={`#p-connector-${idx}`}/>
                              </animateMotion>
                            </circle>
                            <circle r="1.5" fill="white" opacity="0.5">
                              <animateMotion dur="1.2s" repeatCount="indefinite" begin="0.8s">
                                <mpath href={`#p-connector-${idx}`}/>
                              </animateMotion>
                            </circle>
                          </>
                        )}
                      </svg>
                      
                      <span style={{
                        position: 'absolute',
                        left: 'calc(50% + 14px)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontFamily: 'monospace',
                        fontSize: 10,
                        color: isConnectorActive ? color : '#94a3b8',
                        whiteSpace: 'nowrap',
                        transition: 'color 0.3s ease'
                      }}>
                        {CONNECTOR_LABELS[idx as keyof typeof CONNECTOR_LABELS]}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL: Accordion */}
        <div className="arch-right-column">
          <div className="arch-accordion">
            {ARCHITECTURE_LAYERS.map((layer) => {
              const idx = layer.stepIndex;
              const isActive = idx === activeStep;
              const content = ACCORDION_CONTENT[layer.id];

              return (
                <div 
                  key={layer.id}
                  className={`arch-accordion-item arch-layer-${idx} ${isActive ? 'active' : ''}`}
                >
                  <div 
                    className="arch-accordion-header"
                    ref={(el) => { stepRefs.current[idx] = el; }}
                    data-step={idx}
                    onClick={() => handleInteraction(idx, stepRefs.current[idx])}
                  >
                    <div className="arch-acc-num">0{idx + 1}</div>
                    <div className="arch-acc-dot"></div>
                    <div className="arch-acc-title">{layer.label}</div>
                    <div className="arch-acc-chevron">
                      {isActive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                  <div className="arch-accordion-content-wrapper">
                    <div className="arch-accordion-content">
                      <div className="arch-accordion-inner">
                        <div className="arch-acc-desc">{content.description}</div>
                        <ul className="arch-acc-bullets">
                          {content.bullets.map((bullet: string, i: number) => (
                            <li key={i}>{bullet}</li>
                          ))}
                        </ul>
                        <div className="arch-acc-badges">
                          {content.badges.map((badge: string, i: number) => (
                            <div key={i} className="arch-badge">{badge}</div>
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
      </div>
    </section>
  );
}
