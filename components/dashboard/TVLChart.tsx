'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { formatUSD } from '@/lib/utils';
import { TVLSnapshot } from '@/lib/types';

const INITIAL_DATA: TVLSnapshot[] = [
  { slot: 1040, tvl_usd: 1400000, timestamp: new Date(Date.now() - 40000).toISOString() },
  { slot: 1041, tvl_usd: 1390000, timestamp: new Date(Date.now() - 36000).toISOString() },
  { slot: 1042, tvl_usd: 1395000, timestamp: new Date(Date.now() - 32000).toISOString() },
  { slot: 1043, tvl_usd: 1405000, timestamp: new Date(Date.now() - 28000).toISOString() },
  { slot: 1044, tvl_usd: 1398000, timestamp: new Date(Date.now() - 24000).toISOString() },
  { slot: 1045, tvl_usd: 1390000, timestamp: new Date(Date.now() - 20000).toISOString() },
  { slot: 1046, tvl_usd: 1385000, timestamp: new Date(Date.now() - 16000).toISOString() },
  { slot: 1047, tvl_usd: 1380000, timestamp: new Date(Date.now() - 12000).toISOString() },
  { slot: 1048, tvl_usd: 1375000, timestamp: new Date(Date.now() - 8000).toISOString() },
  { slot: 1049, tvl_usd: 1370000, timestamp: new Date(Date.now() - 4000).toISOString() },
  { slot: 1050, tvl_usd: 1365000, timestamp: new Date(Date.now()).toISOString() },
  { slot: 1051, tvl_usd: 1100000, timestamp: new Date(Date.now()).toISOString() }, // drop 
  { slot: 1052, tvl_usd: 900000, timestamp: new Date(Date.now()).toISOString() }, // drop
  { slot: 1053, tvl_usd: 882200, timestamp: new Date(Date.now()).toISOString(), alert_rule: 'FLASH_LOAN_DRAIN' },
  { slot: 1054, tvl_usd: 882200, timestamp: new Date(Date.now()).toISOString() }, // paused flat
  { slot: 1055, tvl_usd: 882200, timestamp: new Date(Date.now()).toISOString() },
];

export default function TVLChart() {
  const [data, setData] = useState<TVLSnapshot[]>(INITIAL_DATA);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[360px] bg-surface border border-border-default rounded-xl w-full" />;

  return (
    <div className="bg-surface border border-border-default rounded-xl p-6 shadow-sm mb-8">
      <div className="mb-6">
        <h2 className="font-display font-semibold text-[18px] text-primary">Protocol TVL — Real Time Monitor</h2>
        <span className="text-[13px] text-tertiary">10-slot rolling window · Updates every 5s</span>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="slot" 
              tickFormatter={(v) => `#${v}`} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-tertiary)', fontSize: 12, fontFamily: 'var(--font-mono)' }} 
              dy={10}
            />
            <YAxis 
              tickFormatter={(v) => formatUSD(v)} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} 
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-md)' }}
              labelStyle={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginBottom: '8px' }}
              labelFormatter={(v) => `Slot #${v}`}
              formatter={(val: any) => [<span key="val" className="font-medium text-primary">{formatUSD(Number(val))}</span>, 'TVL']}
            />
            
            {/* Find alerts and draw vertical lines */}
            {data.filter(d => d.alert_rule).map(d => (
              <ReferenceLine 
                key={d.slot} 
                x={d.slot} 
                stroke="var(--status-paused)" 
                strokeDasharray="4 4" 
                label={{ position: 'top', value: 'ALERT FIRED', fill: 'var(--status-paused)', fontSize: 11, fontWeight: 700 }} 
              />
            ))}

            <Area type="monotone" dataKey="tvl_usd" fill="var(--brand-light)" fillOpacity={0.3} stroke="none" />
            <Line type="monotone" dataKey="tvl_usd" stroke="var(--brand-primary)" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: 'var(--brand-primary)', stroke: '#fff', strokeWidth: 2 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
