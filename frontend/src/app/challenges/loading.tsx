export default function ChallengesLoading() {
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

        {/* Stats section skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 w-24 bg-white/20 rounded animate-pulse"></div>
                <div className="h-6 w-6 bg-white/20 rounded animate-pulse"></div>
              </div>
              <div className="h-8 w-12 bg-white/20 rounded animate-pulse mb-1"></div>
              <div className="h-3 w-20 bg-white/20 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Filters skeleton */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="h-10 w-full bg-white/20 rounded-lg animate-pulse"></div>
            </div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-20 bg-white/20 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Challenges grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-white/20 rounded animate-pulse"></div>
                  <div>
                    <div className="h-5 w-32 bg-white/20 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-24 bg-white/20 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-5 w-16 bg-white/20 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-12 bg-white/20 rounded animate-pulse"></div>
                </div>
              </div>
              
              <div className="h-3 w-full bg-white/20 rounded animate-pulse mb-4"></div>
              <div className="h-2 w-full bg-white/20 rounded animate-pulse mb-4"></div>
              
              <div className="flex justify-between items-center">
                <div className="h-4 w-20 bg-white/20 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-white/20 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 