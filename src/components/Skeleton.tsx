export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`skeleton rounded-lg ${className}`} />
  );
}

export function SoftwareSkeleton() {
  return (
    <div className="bg-card border border-border rounded-[32px] p-5 flex flex-col gap-5 h-full">
      <div className="flex items-start justify-between">
        <Skeleton className="size-20 rounded-[24px]" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="mt-auto pt-5 flex items-center justify-between border-t border-border/50">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
    </div>
  );
}
