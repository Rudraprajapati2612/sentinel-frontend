import StatsRow from '@/components/dashboard/StatsRow';
import TVLChart from '@/components/dashboard/TVLChart';
import AlertFeed from '@/components/dashboard/AlertFeed';
import ProtocolPanel from '@/components/dashboard/ProtocolPanel';
import AlertTable from '@/components/dashboard/AlertTable';

export default function DashboardPage() {
  return (
    <div className="pb-16 flex flex-col gap-2">
      <StatsRow />
      <TVLChart />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
        <div className="lg:col-span-7 xl:col-span-7 2xl:col-span-8 h-full">
          <AlertFeed />
        </div>
        <div className="lg:col-span-5 xl:col-span-5 2xl:col-span-4 h-full">
          <ProtocolPanel />
        </div>
      </div>
      
      <AlertTable />
    </div>
  );
}
