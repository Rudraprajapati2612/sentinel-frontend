export default function Stats() {
  const stats = [
    { num: '2', label: 'Rules Active' },
    { num: '< 3s', label: 'Response Time' },
    { num: '5', label: 'Scenarios Tested' },
    { num: '100%', label: 'Pause Rate' },
  ];

  return (
    <section className="bg-subtle border-y border-border-default py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-x-0 md:divide-x divide-border-default h-full">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center px-4">
              <span className="font-display font-bold text-2xl text-primary">{stat.num}</span>
              <span className="font-body text-[13px] text-secondary mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
