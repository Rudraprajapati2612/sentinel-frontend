import Link from 'next/link';

export default function DashboardStub() {
  return (
    <div className="min-h-screen bg-base py-32 px-6 text-center flex flex-col items-center justify-center">
      <h1 className="font-display text-4xl font-bold mb-4 text-primary">Dashboard</h1>
      <p className="text-secondary max-w-xl mb-8">
        The dashboard view is simulated for this demo. The actual SentinelGuard integration 
        would display live protocol data.
      </p>
      <Link href="/" className="px-6 py-3 bg-brand-primary text-white rounded-xl font-medium">
        &larr; Back to Landing Page
      </Link>
    </div>
  );
}
