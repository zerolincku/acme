import { Skeleton } from './skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <>
      {/* Header row */}
      <div className="border-b bg-muted/30 px-4 py-3">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-3.5 flex-1" />
          ))}
        </div>
      </div>
      {/* Body rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="border-b px-4 py-4">
          <div className="flex items-center gap-4">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <Skeleton
                key={colIdx}
                className={cn(
                  'h-4 flex-1',
                  colIdx === 0 && 'max-w-[180px]',
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
