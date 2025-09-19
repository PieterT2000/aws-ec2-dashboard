import { Skeleton } from "@/components/ui/skeleton";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TableSkeleton = ({ className }: { className?: string }) => {
  return (
    <Card className={cn("shadow-none", className)}>
      <CardContent className="space-y-4">
        {/* Table Header Skeleton */}
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Table Skeleton */}
        <div className="space-y-3">
          {/* Table Header Row */}
          <div className="grid grid-cols-6 gap-4 py-3 border-b">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Table Rows Skeleton */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 py-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <div className="space-y-2">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TableSkeleton;
