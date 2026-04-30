import { Check } from 'lucide-react';
import ExplorerLink from '../shared/ExplorerLink';

const SCENARIOS = [
  { id: 1, type: "Normal deposits + 3.3% withdrawal", expected: "No alert", result: "Silent", tx: null },
  { id: 2, type: "Rapid 81% drain in 3 transactions", expected: "TVL_VELOCITY", result: "Severity 99, <3s", tx: "3sX4PLsGqo9rhVCZ1vRWRoK9kx7VNkkYfrDmrDnjgNHHawpeK7MqccZxVJesYp8N9XDUyeNYxvoZuCU5rYyet3F8" },
  { id: 3, type: "Flash loan + 40% drain exploit", expected: "FLASH_LOAN_DRAIN", result: "Severity 64, <5s", tx: "28wPiUdajetVddnuKq7NHqMVfgRcrYxKccq1E1vAjRuwCsH2LRQDbBRvTi9sz5XuFtPZm7Vk1SYUDARFMAHZMsou" },
  { id: 4, type: "10% single drain (below threshold)", expected: "No alert", result: "Silent", tx: null },
  { id: 5, type: "Slow 5%×8 cumulative bleed", expected: "TVL_VELOCITY", result: "Fires at slice 5", tx: "cooldown" },
];

export default function ProvenInTesting() {
  return (
    <section className="py-24 bg-surface border-y border-border-default">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <span className="text-brand-primary text-[12px] font-semibold tracking-[0.1em] uppercase mb-4 block">
            BATTLE TESTED
          </span>
          <h2 className="font-display font-bold text-[36px] text-primary">
            5 attack scenarios. All detected.
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-subtle border-y border-border-default text-sm text-secondary font-medium uppercase tracking-wider">
                <th className="py-4 px-6 font-display">Scenario</th>
                <th className="py-4 px-6 font-display">Attack Type</th>
                <th className="py-4 px-6 font-display">Expected</th>
                <th className="py-4 px-6 font-display">Result</th>
                <th className="py-4 px-6 font-display">On-chain Pause</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default text-[15px] text-primary font-body">
              {SCENARIOS.map((row) => (
                <tr key={row.id} className="hover:bg-subtle/50 transition-colors">
                  <td className="py-5 px-6 text-tertiary">{row.id}</td>
                  <td className="py-5 px-6">{row.type}</td>
                  <td className="py-5 px-6 font-mono text-[13px]">{row.expected}</td>
                  <td className="py-5 px-6 flex items-center gap-2 text-severity-safe-text">
                    <Check size={16} /> {row.result}
                  </td>
                  <td className="py-5 px-6">
                    {row.tx === 'cooldown' ? (
                      <span className="text-tertiary italic text-sm">Cooldown active</span>
                    ) : row.tx ? (
                      <ExplorerLink signature={row.tx} />
                    ) : (
                      <span className="text-tertiary">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
