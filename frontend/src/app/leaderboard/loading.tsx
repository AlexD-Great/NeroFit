export default function LeaderboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header skeleton */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="h-8 w-32 bg-white/20 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-white/20 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header skeleton */}
        <div className="mb-8">
          <div className="h-10 w-64 bg-white/20 rounded animate-pulse mb-2"></div>
          <div className="h-6 w-96 bg-white/20 rounded animate-pulse"></div>
        </div>

        {/* Time filter skeleton */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-2 border border-white/20">
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 w-20 bg-white/20 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Podium skeleton */}
        <div className="mb-12">
          <div className="flex justify-center items-end space-x-4 mb-8">
            {/* 2nd place */}
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 w-16 bg-white/20 rounded animate-pulse mb-1"></div>
              <div className="h-3 w-12 bg-white/20 rounded animate-pulse mb-2"></div>
              <div className="w-16 h-24 bg-white/20 rounded-t-lg animate-pulse"></div>
            </div>
            
            {/* 1st place */}
            <div className="text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 w-20 bg-white/20 rounded animate-pulse mb-1"></div>
              <div className="h-3 w-16 bg-white/20 rounded animate-pulse mb-2"></div>
              <div className="w-20 h-32 bg-white/20 rounded-t-lg animate-pulse"></div>
            </div>
            
            {/* 3rd place */}
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 w-16 bg-white/20 rounded animate-pulse mb-1"></div>
              <div className="h-3 w-12 bg-white/20 rounded animate-pulse mb-2"></div>
              <div className="w-16 h-20 bg-white/20 rounded-t-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Leaderboard table skeleton */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
          <div className="p-6">
            <div className="h-6 w-32 bg-white/20 rounded animate-pulse mb-4"></div>
            
            {/* Table header */}
            <div className="grid grid-cols-5 gap-4 py-3 border-b border-white/20">
              <div className="h-4 w-12 bg-white/20 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-white/20 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-white/20 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-white/20 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-white/20 rounded animate-pulse"></div>
            </div>
            
            {/* Table rows */}
            {[...Array(10)].map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4 py-4 border-b border-white/10 last:border-b-0">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-4 w-4 bg-white/20 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-white/20 rounded-full animate-pulse"></div>
                  <div>
                    <div className="h-4 w-20 bg-white/20 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-16 bg-white/20 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-4 w-12 bg-white/20 rounded animate-pulse"></div>
                <div className="h-4 w-8 bg-white/20 rounded animate-pulse"></div>
                <div className="h-4 w-6 bg-white/20 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 