const Loading = ({ isSmall }) => {
  if (isSmall) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-5 h-5 rounded-full animate-spin border-2 border-solid border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-20 animate-pulse">
      {/* Section Skeleton */}
      <div>
        {/* Title Skeleton */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-10 w-48 bg-gray-200 rounded-lg"></div>
          <div className="h-[2px] flex-grow bg-gray-100"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Featured Skeleton (Left) */}
          <div className="lg:col-span-7">
            <div className="w-full h-[500px] bg-gray-200 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              <div className="absolute bottom-10 left-10 right-10 space-y-4">
                <div className="h-6 w-32 bg-gray-300 rounded-full"></div>
                <div className="h-10 w-3/4 bg-gray-300 rounded-lg"></div>
                <div className="h-4 w-full bg-gray-300 rounded-md"></div>
              </div>
            </div>
          </div>

          {/* Secondary Skeletons (Right) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-5 p-4 rounded-2xl border border-gray-100 relative overflow-hidden">
                <div className="w-24 h-24 md:w-32 md:h-28 bg-gray-200 rounded-xl flex-shrink-0"></div>
                <div className="flex flex-col justify-center py-1 flex-grow space-y-3">
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  <div className="h-5 w-full bg-gray-200 rounded"></div>
                  <div className="h-5 w-2/3 bg-gray-200 rounded"></div>
                  <div className="h-2 w-24 bg-gray-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default Loading;
