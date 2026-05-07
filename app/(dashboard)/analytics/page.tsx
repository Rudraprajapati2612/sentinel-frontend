'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Brush } from 'recharts';

const severityData = [
  { time: '11:44 AM', severity: 0 },
  { time: '11:44 AM', severity: 85 },
  { time: '11:44 AM', severity: 70 },
  { time: '11:45 AM', severity: 0 },
  { time: '11:45 AM', severity: 0 },
  { time: '11:45 AM', severity: 80 },
  { time: '11:45 AM', severity: 60 },
  { time: '02:04 PM', severity: 0 },
  { time: '02:04 PM', severity: 0 },
  { time: '02:04 PM', severity: 85 },
  { time: '02:04 PM', severity: 65 },
  { time: '02:05 PM', severity: 0 },
  { time: '02:05 PM', severity: 0 },
  { time: '02:05 PM', severity: 82 },
  { time: '02:05 PM', severity: 62 },
  { time: '02:06 PM', severity: 0 },
];

const distributionData = [
  { name: '0-29', value: 0, fill: 'var(--bg-inset)' },
  { name: '30-59', value: 4, fill: 'var(--border-default)' },
  { name: '60-74', value: 0, fill: 'var(--bg-inset)' },
  { name: '75-89', value: 4, fill: 'var(--brand-primary)' },
  { name: '90-99', value: 0, fill: 'var(--bg-inset)' },
];

const alertPieData = [
  { name: 'Flash Loan + Drain', value: 2, color: 'var(--brand-primary)' },
  { name: 'TVL Velocity', value: 2, color: 'var(--brand-light)' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[8px] p-3 shadow-[var(--shadow-md)] flex flex-col gap-1 min-w-[140px]">
        <p className="text-[12px] font-medium text-[var(--text-tertiary)]">{label}</p>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[var(--text-secondary)]">Severity</span>
          <span className="text-[14px] font-mono font-bold text-[var(--brand-primary)]">{payload[0].value}/99</span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[8px] p-3 shadow-[var(--shadow-md)] flex flex-col gap-1 min-w-[140px]">
        <p className="text-[12px] font-medium text-[var(--text-tertiary)]">Severity {label}</p>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[var(--text-secondary)]">Alerts</span>
          <span className="text-[14px] font-bold text-[var(--brand-primary)]">{payload[0].value}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col space-y-[24px] pt-2 pb-10">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-6 gap-[16px]">
        <div className="bg-surface border border-border-default rounded-[12px] p-[20px] shadow-[var(--shadow-sm)]">
          <div className="text-[12px] font-medium text-secondary mb-2">Total Alerts</div>
          <div className="text-[28px] font-display font-bold text-primary leading-none mb-2">4</div>
          <div className="text-[12px] text-secondary">All time</div>
        </div>
        <div className="bg-surface border border-border-default rounded-[12px] p-[20px] shadow-[var(--shadow-sm)]">
          <div className="text-[12px] font-medium text-secondary mb-2">Total At-Risk</div>
          <div className="text-[28px] font-display font-bold text-primary leading-none mb-2">$1.86M</div>
          <div className="text-[12px] text-secondary">USDC equivalent</div>
        </div>
        <div className="bg-surface border border-border-default rounded-[12px] p-[20px] shadow-[var(--shadow-sm)]">
          <div className="text-[12px] font-medium text-secondary mb-2">Avg Severity</div>
          <div className="text-[28px] font-display font-bold text-primary leading-none mb-2">82/99</div>
          <div className="text-[12px] text-secondary">Across all alerts</div>
        </div>
        <div className="bg-surface border border-border-default rounded-[12px] p-[20px] shadow-[var(--shadow-sm)]">
          <div className="text-[12px] font-medium text-secondary mb-2">Avg Response</div>
          <div className="text-[28px] font-display font-bold text-primary leading-none mb-2">2.8s</div>
          <div className="text-[12px] text-secondary">Detection &rarr; Pause</div>
        </div>
        <div className="bg-surface border border-border-default rounded-[12px] p-[20px] shadow-[var(--shadow-sm)]">
          <div className="text-[12px] font-medium text-secondary mb-2">Pause Rate</div>
          <div className="text-[28px] font-display font-bold text-primary leading-none mb-2">100%</div>
          <div className="text-[12px] text-secondary">4 pauses executed</div>
        </div>
        <div className="bg-surface border border-border-default rounded-[12px] p-[20px] shadow-[var(--shadow-sm)]">
          <div className="text-[12px] font-medium text-secondary mb-2">Rule Types</div>
          <div className="text-[28px] font-display font-bold text-primary leading-none mb-2">2</div>
          <div className="text-[12px] text-secondary">Active detection rules</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="flex gap-[24px]">
        {/* Severity Over Time Area Chart */}
        <div className="flex-1 min-w-0 bg-surface border border-border-default rounded-[12px] p-[24px] shadow-[var(--shadow-sm)]">
          <h3 className="font-display font-bold text-[16px] text-primary mb-1">Severity Over Time</h3>
          <p className="text-[13px] text-secondary mb-6">Per-alert severity scores across detection events. Use the brush below to zoom into specific timeframes.</p>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={severityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSeverity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-default)" opacity={0.5} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} dy={10} minTickGap={30} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} ticks={[0, 25, 50, 75, 100]} />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ stroke: 'var(--brand-primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="severity" 
                  stroke="var(--brand-primary)" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorSeverity)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--brand-primary)', style: { filter: 'drop-shadow(0 0 6px var(--brand-primary))' } }} 
                />
                <Brush 
                  dataKey="time" 
                  height={30} 
                  stroke="var(--border-strong)" 
                  fill="var(--bg-base)" 
                  tickFormatter={() => ''} 
                  travellerWidth={10}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Distribution Donut */}
        <div className="w-[320px] shrink-0 bg-surface border border-border-default rounded-[12px] p-[24px] shadow-[var(--shadow-sm)] flex flex-col">
          <h3 className="font-display font-bold text-[16px] text-primary mb-1">Alert Distribution</h3>
          <p className="text-[13px] text-secondary mb-2">Alerts by detection rule type</p>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-[180px] w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={alertPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {alertPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between items-center text-[12px]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)]" />
                  <span className="font-semibold text-primary">Flash Loan + Drain</span>
                </div>
                <span className="text-secondary">2</span>
              </div>
              <div className="flex justify-between items-center text-[12px]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand-light)]" />
                  <span className="font-semibold text-primary">TVL Velocity</span>
                </div>
                <span className="text-secondary">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Severity Distribution Bar Chart */}
      <div className="bg-surface border border-border-default rounded-[12px] p-[24px] shadow-[var(--shadow-sm)]">
        <h3 className="font-display font-bold text-[16px] text-primary mb-1">Severity Distribution</h3>
        <p className="text-[13px] text-secondary mb-6">Number of alerts per severity bucket</p>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }} barSize={120}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-default)" opacity={0.5} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} ticks={[0, 1, 2, 3, 4]} />
              <Tooltip cursor={{fill: 'transparent'}} content={<CustomBarTooltip />} />
              <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rule Performance Summary Table */}
      <div className="bg-surface border border-border-default rounded-[12px] shadow-[var(--shadow-sm)] overflow-hidden">
        <div className="p-[24px] border-b border-border-default">
          <h3 className="font-display font-bold text-[16px] text-primary mb-1">Rule Performance Summary</h3>
          <p className="text-[13px] text-secondary">Per-rule analytics breakdown</p>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--bg-base)]">
              <th className="py-3 px-6 text-[11px] font-bold tracking-wider text-tertiary uppercase">Rule</th>
              <th className="py-3 px-6 text-[11px] font-bold tracking-wider text-tertiary uppercase">Alerts</th>
              <th className="py-3 px-6 text-[11px] font-bold tracking-wider text-tertiary uppercase">Avg Severity</th>
              <th className="py-3 px-6 text-[11px] font-bold tracking-wider text-tertiary uppercase">Total At Risk</th>
              <th className="py-3 px-6 text-[11px] font-bold tracking-wider text-tertiary uppercase">Pause Rate</th>
              <th className="py-3 px-6 text-[11px] font-bold tracking-wider text-tertiary uppercase">Avg Response</th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            <tr className="border-b border-border-default">
              <td className="py-4 px-6">
                <span className="bg-surface border border-border-default rounded-md px-2.5 py-1 font-medium text-primary shadow-sm">Flash Loan + Drain</span>
              </td>
              <td className="py-4 px-6 font-bold text-primary">2</td>
              <td className="py-4 px-6 font-medium text-severity-high-text">79/99</td>
              <td className="py-4 px-6 font-bold text-status-paused">$1.03M</td>
              <td className="py-4 px-6 font-medium text-status-active">100%</td>
              <td className="py-4 px-6 text-secondary">2.8s</td>
            </tr>
            <tr className="border-b border-border-default">
              <td className="py-4 px-6">
                <span className="bg-surface border border-border-default rounded-md px-2.5 py-1 font-medium text-primary shadow-sm">TVL Velocity</span>
              </td>
              <td className="py-4 px-6 font-bold text-primary">2</td>
              <td className="py-4 px-6 font-medium text-severity-high-text">84/99</td>
              <td className="py-4 px-6 font-bold text-status-paused">$825.3K</td>
              <td className="py-4 px-6 font-medium text-status-active">100%</td>
              <td className="py-4 px-6 text-secondary">2.8s</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
