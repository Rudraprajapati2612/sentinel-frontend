'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, Bell, BarChart2, Settings, BookOpen } from 'lucide-react';
import { WATCHER_PUBKEY, MOCK_PROTOCOL_ID, SENTINEL_STATE_PDA } from '@/lib/constants';
import AddressBadge from '@/components/shared/AddressBadge';
import StatusIndicator from '@/components/shared/StatusIndicator';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/alerts', label: 'Alert History', icon: Bell },
    { href: '/analytics', label: 'Analytics', icon: BarChart2 },
    { href: '/controls', label: 'Controls', icon: Settings },
    { href: '/integration', label: 'Integration Guide', icon: BookOpen },
  ];

  return (
    <aside className="w-[240px] fixed top-0 left-0 h-screen bg-surface border-r border-border-default flex flex-col z-40">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-1">
          <Shield className="text-brand-primary flex-shrink-0" fill="transparent" size={20} />
          <span className="font-display font-bold text-primary text-[15px] uppercase tracking-wide">SENTINEL_GUARD</span>
        </Link>
        <span className="text-tertiary text-[11px] font-mono ml-7 block">v1.0.0</span>
      </div>

      <div className="px-6 pb-6 border-b border-border-default mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-status-active" />
          <span className="text-[12px] font-semibold text-primary">Watcher Live</span>
        </div>
        <div className="text-[11px] text-tertiary font-mono truncate">
          EbVbJDyH...Ya7m
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-[14px] ${
                active 
                  ? 'bg-subtle text-brand-primary border-l-[3px] border-brand-primary' 
                  : 'text-secondary hover:bg-subtle border-l-[3px] border-transparent'
              }`}
            >
              <Icon size={18} className={active ? "text-brand-primary" : "text-secondary"} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 bg-surface mt-auto">
        <div className="text-[11px] font-bold tracking-wider uppercase text-tertiary mb-3">Protocol</div>
        
        <div className="mb-4">
          <div className="text-[12px] text-tertiary font-mono mb-1">3Eue3cN8...xcaC</div>
          <div className="text-[12px]"><StatusIndicator status="ACTIVE" showText /></div>
        </div>

        <div className="text-[11px] font-bold tracking-wider uppercase text-tertiary mb-2">SentinelState</div>
        <div className="text-[12px] text-tertiary font-mono">2oQ8Z6ua...mt8q</div>
      </div>

      <div className="fixed bottom-6 left-6 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-[18px] shadow-lg cursor-pointer">
        N
      </div>
    </aside>
  );
}
