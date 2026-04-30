'use client';
import { useState } from 'react';
import { truncateAddress } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';

export default function AddressBadge({ address, chars = 8, showCopy = true }: { address: string; chars?: number; showCopy?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-2 bg-inset px-2 py-1 rounded-md w-fit">
      <span className="font-mono text-[13px] text-primary">{truncateAddress(address, chars)}</span>
      {showCopy && (
        <button
          onClick={handleCopy}
          className="text-tertiary hover:text-primary transition-colors focus:outline-none"
          title="Copy address"
        >
          {copied ? <Check size={14} className="text-status-active" /> : <Copy size={14} />}
        </button>
      )}
    </div>
  );
}
