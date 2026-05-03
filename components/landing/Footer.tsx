import Link from 'next/link';
import { Shield, ArrowRight, Github, Twitter, BookOpen, Terminal } from 'lucide-react';
import { WATCHER_PUBKEY } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-[#f8fafc] border-t border-slate-200/60 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Pre-Footer CTA */}
        <div className="relative overflow-hidden rounded-[32px] bg-[#0f172a] px-8 py-16 md:px-16 md:py-20 mb-20 shadow-[0_32px_64px_rgba(15,23,42,0.12)]">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2563eb] rounded-full mix-blend-screen filter blur-[120px] opacity-20 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <h2 className="font-display text-[32px] sm:text-[40px] font-bold text-white leading-[1.1] tracking-tight mb-4">
                Secure your protocol in milliseconds.
              </h2>
              <p className="text-slate-400 text-[17px] leading-relaxed">
                SentinelGuard provides real-time transaction parsing and automated response, ensuring your TVL is protected before the next block is finalized.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-7 py-4 text-[16px] font-medium text-white shadow-[0_14px_34px_rgba(37,99,235,0.28)] transition-all hover:-translate-y-1 hover:bg-[#1d4ed8] hover:shadow-[0_20px_40px_rgba(29,78,216,0.4)]"
              >
                Launch Dashboard <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 w-fit">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#2563eb] shadow-[0_8px_16px_rgba(37,99,235,0.2)]">
                <Shield className="text-white" size={20} fill="currentColor" />
              </div>
              <span className="font-display font-bold text-[24px] text-[#0f172a] tracking-tight">
                SentinelGuard
              </span>
            </Link>
            <p className="text-slate-500 text-[15px] leading-relaxed max-w-sm mb-6">
              Real-time Solana security infrastructure. Autonomous threat detection and on-chain protocol pausing.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
              <span className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider">
                Built for Colosseum Hackathon
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[#0f172a] text-[15px] mb-5 tracking-tight">Product</h3>
            <ul className="flex flex-col gap-4 text-[15px] text-slate-500 font-medium">
              <li><Link href="/dashboard" className="hover:text-[#2563eb] transition-colors flex items-center gap-2"><Terminal size={16} /> Dashboard</Link></li>
              <li><Link href="#" className="hover:text-[#2563eb] transition-colors flex items-center gap-2"><BookOpen size={16} /> Documentation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#0f172a] text-[15px] mb-5 tracking-tight">Developers</h3>
            <ul className="flex flex-col gap-4 text-[15px] text-slate-500 font-medium">
              <li><Link href="#" className="hover:text-[#2563eb] transition-colors flex items-center gap-2"><Github size={16} /> GitHub</Link></li>
              <li><Link href="#" className="hover:text-[#2563eb] transition-colors flex items-center gap-2"><Twitter size={16} /> Twitter / X</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-200/60">
          <p className="text-slate-400 text-[14px]">
            &copy; {new Date().getFullYear()} SentinelGuard. All rights reserved.
          </p>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[13px] text-slate-500 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Solana Devnet
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[13px] text-slate-500 shadow-sm">
              Watcher: <span className="font-mono text-slate-700 font-semibold">{WATCHER_PUBKEY.slice(0, 8)}...{WATCHER_PUBKEY.slice(-4)}</span>
            </div>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
