'use client';

import { useState } from 'react';
import AlertTable from '@/components/dashboard/AlertTable';
import CustomDropdown from '@/components/shared/CustomDropdown';

export default function AlertsPage() {
  const [ruleFilter, setRuleFilter] = useState('All Rules');
  const [severityFilter, setSeverityFilter] = useState('All Severities');

  return (
    <div className="flex flex-col pt-2">
      <div className="flex items-center justify-between mb-[24px]">
        <div className="flex items-center gap-[12px]">
          <CustomDropdown 
            value={ruleFilter} 
            onChange={setRuleFilter} 
            options={['All Rules', 'Flash Loan + Drain', 'TVL Velocity Drop', 'Bridge Outflow Spike']} 
          />
          <CustomDropdown 
            value={severityFilter} 
            onChange={setSeverityFilter} 
            options={['All Severities', 'Critical (>=90)', 'High (>=75)', 'Medium (>=60)']} 
          />
        </div>
        <button className="bg-[var(--bg-surface)] border border-[var(--border-default)] text-primary font-medium text-[13px] px-[16px] py-[8px] rounded-xl hover:bg-subtle transition-colors shadow-sm flex items-center gap-2">
          Hide Rules Reference
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 min-w-0 relative">
          <AlertTable ruleFilter={ruleFilter} severityFilter={severityFilter} />
        </div>
        <div className="w-full lg:w-[320px] shrink-0">
          <div className="bg-[var(--bg-base)] border border-[var(--border-default)] rounded-[12px] p-[24px]">
            <h3 className="font-display font-bold text-[16px] text-primary mb-5">Detection Rules Reference</h3>
            <div className="space-y-[24px]">
              <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[8px] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[12px] font-bold text-tertiary">R1</span>
                  <div className="text-[14px] font-bold text-primary">Flash Loan + Drain</div>
                </div>
                <div className="text-[13px] text-secondary leading-relaxed">
                  Fires when flash loan evidence (confidence &gt; 50%) is found within the same 10-slot window as a TVL drop exceeding 20%. Score is weighted by confidence and slot distance.
                </div>
              </div>
              <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[8px] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[12px] font-bold text-tertiary">R2</span>
                  <div className="text-[14px] font-bold text-primary">TVL Velocity</div>
                </div>
                <div className="text-[13px] text-secondary leading-relaxed">
                  Fires when TVL drops more than 20% within a 10-slot rolling window. Score scales linearly: 20% &rarr; 60, 50% &rarr; 80, 80% &rarr; 99. Immune to false positives from normal deposit/withdrawal cycles.
                </div>
              </div>
              <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[8px] p-4 opacity-70">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[12px] font-bold text-tertiary">R3</span>
                  <div className="text-[14px] font-bold text-primary">Bridge Outflow Spike</div>
                </div>
                <div className="text-[13px] text-secondary leading-relaxed">
                  Fires when token outflows through known Solana bridge programs exceed a configurable multiplier of the 30-slot average outflow baseline.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
