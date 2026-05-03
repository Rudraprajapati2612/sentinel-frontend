'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const ARCHITECTURE_LAYERS = [
  {
    id: 'solana',
    title: 'SOLANA BLOCKCHAIN',
    sublabel: '~400ms slots · Geyser events',
    color: '#1e3a8a',
    description:
      'The foundation of every detection. SentinelGuard connects directly to a local Solana validator, receiving every block at the native ~400ms slot cadence via the Geyser WebSocket plugin. No API rate limits. No polling delays. Every transaction touching the monitored protocol is seen in real time.',
    bullets: [
      'Local validator access — no RPC rate limits',
      'Full block coverage via Yellowstone Geyser plugin',
      '~400ms slot cadence — native chain speed',
      'Pubkey: EbVbJD...VYa7m',
    ],
    badges: ['Yellowstone', 'Geyser', '~400ms slots'],
  },
  {
    id: 'grpc',
    title: 'gRPC / WEBSOCKET STREAMS',
    sublabel: 'Yellowstone · Geyser plugin',
    color: '#2563eb',
    description:
      'Raw blockchain events stream over gRPC using the Yellowstone Geyser plugin, providing SentinelGuard with a high-throughput, low-latency feed of slot updates, account deltas, and transaction confirmations. Unlike polling, this is push-based — events arrive the moment they are finalized.',
    bullets: [
      'Push-based — no polling, no missed transactions',
      'Yellowstone Geyser plugin for sub-millisecond delivery',
      'Slot updates + account changes + tx confirmations',
      'Bidirectional gRPC stream for control messages',
    ],
    badges: ['gRPC', 'WebSocket', 'Push-based'],
  },
  {
    id: 'parser',
    title: 'TRANSACTION PARSER',
    sublabel: 'geyser.rs · Flash detection · 3 methods',
    color: '#3b82f6',
    description:
      'geyser.rs is the decode layer. It receives every raw transaction and extracts structured intelligence: token balance deltas, CPI call trees, flash loan evidence via 3 methods: Program ID (conf 95), Log keyword (conf 70), Delta pattern (conf 55). Writes TVL to Redis every slot. Broadcasts ParsedTransaction on channel (cap: 10,000).',
    bullets: [
      'geyser.rs — Rust async parser, zero-copy deserialization',
      'Token delta computation: before/after balances per tx',
      'Flash loan detection: Program ID (conf 95), Log keyword (70), Delta pattern (55)',
      '+10 confidence boost when 2+ methods agree',
      'Writes TVL to Redis · Broadcasts ParsedTransaction (channel cap: 10,000)',
    ],
    badges: ['geyser.rs', 'Rust', '3 heuristics', 'Redis TVL'],
  },
  {
    id: 'engine',
    title: 'DETECTION ENGINE',
    sublabel: 'engine.rs · R1 · R2 · R3 · Score ≥ 60',
    color: '#60a5fa',
    description:
      'engine.rs — evaluates 3 rules on every ParsedTransaction. R1 flash_loan.rs: flash + TVL drop >15% in 5 slots, score 40–99. R2 tvl_velocity.rs: TVL drop ≥20% in 3 slots, score 75–99. R3 bridge_spike.rs: outflow 10x rolling avg, score 85–95. Fires AlertEvent when score ≥ 60.',
    bullets: [
      'engine.rs — rolling 5-slot evaluation window, every slot',
      'R1 Flash Loan Drain: flash evidence + TVL drop ≥20%, score 0–95',
      'R2 TVL Velocity: ≥20% TVL drop in 3 slots, score 0–99',
      'R3 Bridge Outflow Spike: 10× rolling average outflow, score 85–95',
      'max(R1, R2, R3) — threshold 60 triggers AlertEvent',
      'Redis deduplication: cooldown + paused keys prevent re-fire',
    ],
    badges: ['engine.rs', 'R1/R2/R3', 'Score ≥ 60', 'Redis dedup'],
  },
  {
    id: 'responder',
    title: 'RESPONDER SERVICE',
    sublabel: 'pause.rs · webhooks.rs · DB insert',
    color: '#93c5fd',
    description:
      'On AlertEvent — simultaneously: (1) sends pause_withdrawals Anchor instruction on-chain, (2) inserts alert to PostgreSQL, (3) publishes to Kafka topic, (4) dispatches webhooks to Discord/Telegram. Entire detect-to-pause loop: ~2–3s.',
    bullets: [
      'Redis optimistic pause key set in ~2ms — blocks further processing',
      'pause.rs: builds pause_withdrawals Anchor instruction, skipPreflight',
      'On-chain confirmation in ~400ms (localnet latency)',
      'webhooks.rs: Kafka topic sentinel.alerts + Discord notification',
      'PostgreSQL insert with ON CONFLICT DO NOTHING deduplication',
      'Confirmed pause txs: 3sX4PLsG... · 28wPiUda...',
    ],
    badges: ['pause.rs', 'webhooks.rs', '~2ms pause', 'Kafka', 'PostgreSQL'],
  },
  {
    id: 'dashboard',
    title: 'DASHBOARD & OUTPUTS',
    sublabel: 'Next.js · WS feed · Kafka · REST',
    color: '#bfdbfe',
    description:
      'Next.js 14. WebSocket feed at /feed. REST endpoints: /alerts, /stats, /tvl-history/:protocol. Shows live alert stream, TVL chart, protocol status, on-chain pause confirmations.',
    bullets: [
      'Next.js 14 App Router — TypeScript, Tailwind, Recharts',
      'WS /feed — real-time alert push to dashboard UI',
      'REST: /alerts, /tvl, /protocol-status, /stats',
      'On-chain state read directly from SentinelState PDA',
      'One-click unpause_withdrawals instruction from UI',
      'SentinelState PDA: 2oQ8Z6u...mt8q',
    ],
    badges: ['Next.js 14', 'WebSocket', 'REST', 'One-click unpause'],
  },
];

const ZIGZAG_SEQUENCE = [
  { layerIndex: 0, top: 'top-[10px]', left: 'left-[12px]' },
  { layerIndex: 1, top: 'top-[108px]', left: 'left-[calc(50%-132px)]' },
  { layerIndex: 2, top: 'top-[206px]', left: 'left-[12px]' },
  { layerIndex: 3, top: 'top-[304px]', left: 'left-[calc(50%-132px)]' },
  { layerIndex: 4, top: 'top-[402px]', left: 'left-[12px]' },
  { layerIndex: 5, top: 'top-[500px]', left: 'left-[calc(50%-132px)]' },
];

export default function ArchitectureSection() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const hasAutoOpened = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAutoOpened.current) {
            hasAutoOpened.current = true;
            setActiveStep(0);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const activeLayer = ARCHITECTURE_LAYERS[activeStep];

  return (
    <section ref={sectionRef} className="mx-auto max-w-7xl bg-[#eef1f8] px-6 py-20">
      <div className="mb-14">
        <span className="mb-3 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#2563eb]">
          SYSTEM ARCHITECTURE
        </span>
        <h2 className="mb-3 text-4xl font-bold text-[#0f172a]">Six layers of on-chain defense.</h2>
        <p className="text-[17px] text-[#475569]">Every component engineered for sub-second threat response.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="relative h-[610px] rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.58),rgba(243,247,255,0.84))] p-5 shadow-[0_20px_56px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          {ZIGZAG_SEQUENCE.map((item, index) => {
            const layer = ARCHITECTURE_LAYERS[item.layerIndex];
            const isActive = activeStep === item.layerIndex;
            const isLight = item.layerIndex >= 4;
            const next = ZIGZAG_SEQUENCE[index + 1];
            const isRight = index % 2 === 1;

            return (
              <div key={layer.id}>
                <button
                  type="button"
                  onClick={() => setActiveStep(item.layerIndex)}
                  className={`absolute h-[88px] w-[264px] rounded-[18px] border px-4 py-3 text-left transition-all duration-200 ${item.top} ${item.left}`}
                  style={{
                    backgroundColor: layer.color,
                    borderColor: isActive ? '#2563eb' : 'rgba(255,255,255,0.7)',
                    opacity: isActive ? 1 : 0.84,
                    boxShadow: isActive
                      ? '0 0 0 2px #2563eb, 0 16px 34px rgba(37,99,235,0.16)'
                      : '0 10px 26px rgba(15,23,42,0.08)',
                    transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                  }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className="font-mono text-[12px] font-medium"
                      style={{ color: isLight ? 'rgba(15,23,42,0.56)' : 'rgba(255,255,255,0.62)' }}
                    >
                      0{item.layerIndex + 1}
                    </span>
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: isLight ? '#0f172a' : '#ffffff',
                        opacity: isActive ? 1 : 0.6,
                      }}
                    />
                  </div>
                  <div
                    className="mb-1.5 text-[12px] font-bold uppercase tracking-[0.08em]"
                    style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                  >
                    {layer.title}
                  </div>
                  <div
                    className="text-[10px] leading-[1.35]"
                    style={{ color: isLight ? 'rgba(15,23,42,0.68)' : 'rgba(255,255,255,0.74)' }}
                  >
                    {layer.sublabel}
                  </div>
                </button>

                {next && (
                  <div
                    className="absolute flex items-center"
                    style={{
                      left: 'calc(50% + 96px)',
                      top: 'calc(50% + 68px)',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    <div className="h-[2px] w-[104px] bg-[#2563eb]/28" />
                    <ChevronRight size={14} color="#2563eb" className="-ml-[2px]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeLayer.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="rounded-[24px] border border-white/82 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,247,255,0.84))] p-5 shadow-[0_18px_46px_rgba(15,23,42,0.08)]"
          >
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-2 font-mono text-[12px] font-medium text-[#2563eb]">0{activeStep + 1}</div>
                <h3 className="mb-1.5 text-[24px] font-bold tracking-[-0.02em] text-[#0f172a]">{activeLayer.title}</h3>
                <p className="max-w-3xl text-[14px] leading-[1.7] text-[#475569]">{activeLayer.description}</p>
              </div>
              <div className="rounded-full border border-[#dbe4f6] bg-white/70 px-3 py-1 font-mono text-[11px] text-[#64748b]">
                Layer 0{activeStep + 1}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[20px] border border-white/82 bg-white/78 p-4 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563eb]">Layer Summary</div>
                <div className="text-[13px] leading-[1.7] text-[#475569]">{activeLayer.sublabel}</div>
              </div>

              <div className="rounded-[20px] border border-white/82 bg-white/78 p-4 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563eb]">Key Mechanics</div>
                <ul className="space-y-2">
                  {activeLayer.bullets.slice(0, 4).map((bullet, i) => (
                    <li key={i} className="relative pl-4 text-[12px] leading-relaxed text-[#475569]">
                      <span className="absolute left-0 top-0 text-[#2563eb]">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[20px] border border-white/82 bg-white/78 p-4 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563eb]">Artifacts</div>
                <div className="flex flex-wrap gap-2">
                  {activeLayer.badges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full border border-[#d6e1f6] bg-[#eef4ff] px-3 py-1 font-mono text-[11px] text-[#1e40af]"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
