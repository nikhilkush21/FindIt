export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
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
      <div className="skeleton h-5 w-16 mb-6" />
      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-4">
          <div className="skeleton h-72 w-full rounded-xl" />
          <div className="skeleton h-32 w-full rounded-xl" />
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="skeleton h-48 w-full rounded-xl" />
          <div className="skeleton h-40 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3 p-4 bg-white rounded-xl border border-gray-100">
          <div className="skeleton w-10 h-10 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="skeleton h-3 w-1/3" />
            <div className="skeleton h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i}>
          <div className="skeleton h-3 w-20 mb-1.5" />
          <div className="skeleton h-10 w-full" />
        </div>
      ))}
      <div className="skeleton h-10 w-full mt-2" />
    </div>
  );
}
