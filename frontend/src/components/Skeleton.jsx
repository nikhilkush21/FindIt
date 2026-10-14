export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="skeleton h-44 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
        <div className="flex justify-between pt-2">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="page-container">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="skeleton h-80 w-full" />
        <div className="space-y-4">
          <div className="skeleton h-6 w-24" />
          <div className="skeleton h-8 w-3/4" />
          <div className="space-y-2">
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-4 w-2/5" />
          </div>
          <div className="skeleton h-20 w-full" />
          <div className="skeleton h-28 w-full" />
        </div>
      </div>
    </div>
  );
}
