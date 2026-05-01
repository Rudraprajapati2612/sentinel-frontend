'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, History, Settings, ExternalLink } from 'lucide-react';
import { WATCHER_PUBKEY, MOCK_PROTOCOL_ID, SENTINEL_STATE_PDA } from '@/lib/constants';
import AddressBadge from '@/components/shared/AddressBadge';
import StatusIndicator from '@/components/shared/StatusIndicator';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/alerts', label: 'Alert History', icon: History },
    { href: '/controls', label: 'Controls', icon: Settings },
    { href: '/docs', label: 'Integration Guide', icon: ExternalLink },
  ];

  return (
    <aside className="w-[240px] fixed top-0 left-0 h-screen bg-surface border-r border-border-default flex flex-col z-40">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-1">
          <Shield className="text-brand-primary" fill="currentColor" size={20} />
          <span className="font-display font-semibold text-primary text-[16px]">SENTINEL_GUARD</span>
        </Link>
        <span className="text-tertiary text-[11px] font-mono ml-7 block">v1.0.0</span>
      </div>

      <div className="px-6 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-status-watching animate-pulse" />
          <span className="text-[12px] font-medium text-secondary">Watcher Live</span>
        </div>
        <AddressBadge address={WATCHER_PUBKEY} chars={6} />
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-[14px] ${
                active 
                  ? 'bg-subtle text-brand-primary' 
                  : 'text-secondary hover:bg-black/5 hover:text-primary'
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border-default bg-black/[0.01]">
        <div className="text-[11px] font-bold tracking-wider uppercase text-tertiary mb-3">Protocol</div>
        
        <div className="mb-4">
          <AddressBadge address={MOCK_PROTOCOL_ID} chars={6} />
          <div className="mt-2 text-[12px]"><StatusIndicator status="ACTIVE" showText /></div>
        </div>

        <div className="text-[11px] font-bold tracking-wider uppercase text-tertiary mb-2">SentinelState</div>
        <AddressBadge address={SENTINEL_STATE_PDA} chars={6} />
      </div>
    </aside>
  );
}
