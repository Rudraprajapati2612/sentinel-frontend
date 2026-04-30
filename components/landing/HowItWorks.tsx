export default function HowItWorks() {
  return (
    <section className="py-24 bg-base">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-brand-primary text-[12px] font-semibold tracking-[0.1em] uppercase mb-4 block">
            HOW IT WORKS
          </span>
          <h2 className="font-display font-bold text-[36px] text-primary mb-4">
            From exploit to pause — autonomously
          </h2>
          <p className="font-body text-[18px] text-secondary">
            No human in the loop. No delay. No mercy for attackers.
          </p>
        </div>

        <div className="space-y-32">
          {/* Step 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="font-display font-bold text-[22px] text-primary mb-4">Step 1: Watch</h3>
              <p className="font-body text-[15px] text-secondary leading-[1.6]">
                A Rust Geyser subscriber connects to the Solana WebSocket and receives 
                every transaction touching the monitored protocol in real time. Each transaction 
                is parsed for token deltas, CPI depth, flash loan keywords, and program IDs.
              </p>
            </div>
            <div className="bg-surface border border-border-default rounded-xl p-8 shadow-sm flex flex-col items-center justify-center">
              <div className="font-mono text-[13px] text-primary font-semibold mb-2">Solana Validator</div>
              <div className="font-mono text-xs text-brand-primary mb-2">↓ (Geyser WebSocket)</div>
              <div className="font-mono text-[13px] text-primary font-semibold mb-4">SentinelGuard Watcher</div>
              <div className="font-mono text-[13px] text-secondary bg-[#eef1f8] px-4 py-2.5 rounded-md w-full max-w-[320px] text-center">geyser.rs parsing transactions</div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center flex-col-reverse md:flex-row">
            <div className="flex flex-col gap-5">
              <div className="bg-surface border border-border-default rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-brand-primary" />
                  <span className="font-display font-bold text-brand-primary text-[15px]">R1 Flash Loan + Drain</span>
                </div>
                <p className="font-body text-[14px] text-secondary leading-relaxed">
                  Detects flash borrow followed by TVL drop within the same slot window.<br />
                  Confidence-weighted scoring. Threshold: severity &ge; 60
                </p>
              </div>
              <div className="bg-surface border border-border-default rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-brand-primary" />
                  <span className="font-display font-bold text-brand-primary text-[15px]">R2 TVL Velocity</span>
                </div>
                <p className="font-body text-[14px] text-secondary leading-relaxed">
                  Detects rapid TVL drop &gt; 20% within a 10-slot rolling window. Scores up to severity 99.
                </p>
              </div>
              <div className="bg-surface border border-border-default rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-brand-primary" />
                  <span className="font-display font-bold text-brand-primary text-[15px]">R3 Bridge Outflow Spike</span>
                </div>
                <p className="font-body text-[14px] text-secondary leading-relaxed">
                  Detects funds leaving Solana via known bridge programs. Multiplier-based threshold.
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-display font-bold text-[22px] text-primary mb-4">Step 2: Detect</h3>
              <p className="font-body text-[15px] text-secondary leading-[1.6]">
                Incoming data is continuously evaluated against predefined detection 
                heuristics. If a transaction exhibits malicious patterns, it scores a severity 
                rating.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="font-display font-bold text-[22px] text-primary mb-4">Step 3: Pause</h3>
              <p className="font-body text-[15px] text-secondary leading-[1.6]">
                When severity crosses the threshold, the responder builds a 
                pause_withdrawals instruction with the alert ID as PDA seed and submits it 
                to the sentinel_guardian Anchor program. The protocol is paused on-
                chain. Kafka, Discord, and PostgreSQL are notified simultaneously.
              </p>
            </div>
            <div className="bg-surface border border-border-default rounded-xl p-8 shadow-sm flex flex-col items-center text-center justify-center">
              <div className="font-mono text-[13px] text-primary font-semibold mb-3">AlertEvent emitted</div>
              <div className="font-mono text-xs text-brand-primary mb-3">↓</div>
              <div className="font-mono text-[13px] text-primary font-semibold mb-3">pause_withdrawals ix built</div>
              <div className="font-mono text-xs text-brand-primary mb-3">↓ (skipPreflight for speed)</div>
              <div className="font-mono text-[13px] text-primary font-semibold mb-3">Solana RPC &rarr; anchor program</div>
              <div className="font-mono text-xs text-brand-primary mb-3">↓</div>
              <div className="font-mono text-[13px] text-status-paused font-bold mb-3">sentinel_state.paused = true</div>
              <div className="font-mono text-xs text-brand-primary mb-4">↓ (background)</div>
              <div className="font-mono text-[13px] text-secondary bg-[#eef1f8] px-4 py-2.5 rounded-md w-full max-w-[320px] text-center">Kafka &rarr; Discord &rarr; DB</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
