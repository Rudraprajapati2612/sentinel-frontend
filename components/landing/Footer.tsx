import Link from 'next/link';
import { Shield } from 'lucide-react';
import { WATCHER_PUBKEY } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border-default py-12 px-6 text-sm text-secondary">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Shield className="text-brand-primary" fill="currentColor" size={20} />
          <span className="font-display font-medium text-primary">SentinelGuard</span>
          <span className="text-tertiary mx-2">|</span>
          <span>Built for the Colosseum Frontier Hackathon</span>
        </div>

        <div className="flex items-center gap-6 font-medium">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <Link href="#" className="hover:text-primary transition-colors">GitHub</Link>
          <Link href="#" className="hover:text-primary transition-colors">Documentation</Link>
        </div>

        <div className="flex flex-col items-end gap-1 text-tertiary text-xs">
          <span>Watcher: <span className="font-mono">{WATCHER_PUBKEY.slice(0, 8)}...{WATCHER_PUBKEY.slice(-4)}</span></span>
          <span>Deployed on Solana Localnet / Devnet</span>
        </div>
      </div>
    </footer>
  );
}
