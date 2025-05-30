import FastLoader from '@/components/FastLoader';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
      <FastLoader message="Loading NeroFit..." size="lg" />
    </div>
  );
} 