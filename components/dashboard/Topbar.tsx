'use client';

import { Suspense } from 'react';

export default function Topbar() {
  return (
    <header className="h-[64px] bg-surface flex items-center justify-between px-8 border-b border-border-default sticky top-0 z-30">
      <h1 className="font-display font-bold text-xl text-primary">Dashboard</h1>
      
      <div className="flex items-center gap-6">
        <span className="text-[13px] text-tertiary font-mono">
          Last updated: 3s ago
        </span>
        <div className="flex items-center gap-2 bg-subtle px-3 py-1.5 rounded-full border border-brand-light">
          <div className="w-2 h-2 rounded-full bg-status-watching animate-pulse" />
          <span className="text-[12px] font-semibold text-brand-primary tracking-wide">Live</span>
        </div>
        <button className="text-[13px] font-medium px-4 py-1.5 border border-border-default rounded flex items-center gap-2 hover:bg-black/5 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg>
          Refresh
        </button>
      </div>
    </header>
  );
}
