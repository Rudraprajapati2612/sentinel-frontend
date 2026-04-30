import { Shield } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 h-16 bg-surface/80 backdrop-blur-md border-b border-border-default px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Shield className="text-brand-primary" fill="currentColor" size={24} />
        <span className="font-display font-semibold text-primary text-xl">SentinelGuard</span>
      </div>
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link href="#" className="text-secondary hover:text-primary transition-colors">Documentation</Link>
        <Link href="#" className="text-secondary hover:text-primary transition-colors">GitHub</Link>
        <Link href="/dashboard" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-dark transition-colors">
          Launch Dashboard &rarr;
        </Link>
      </div>
    </nav>
  );
}
