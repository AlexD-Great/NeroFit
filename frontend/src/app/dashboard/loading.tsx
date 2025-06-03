import FastLoader from '@/components/FastLoader';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <FastLoader message="Loading dashboard..." size="lg" />
        </div>
      </div>
    </div>
  );
} 