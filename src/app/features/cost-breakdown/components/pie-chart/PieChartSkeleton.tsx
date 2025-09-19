import { Skeleton } from "@/components/ui/skeleton";
import { COLORS } from "../../const";
const PieChartSkeleton = () => {
  return (
    <div className="flex flex-col p-6 gap-y-2">
      <div className="flex-1 flex items-center justify-center">
        {/* Circular skeleton with sections */}
        <div className="relative size-80">
          <svg viewBox="0 0 200 200" className="size-full">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted/20"
            />
            {/* Skeleton sections with actual colors but muted */}
            <path
              d="M 100 20 A 80 80 0 0 1 180 100 L 100 100 Z"
              fill={COLORS[0]}
              className="opacity-30"
            />
            <path
              d="M 180 100 A 80 80 0 0 1 100 180 L 100 100 Z"
              fill={COLORS[1]}
              className="opacity-30"
            />
            <path
              d="M 100 180 A 80 80 0 0 1 20 100 L 100 100 Z"
              fill={COLORS[2]}
              className="opacity-30"
            />
            <path
              d="M 20 100 A 80 80 0 0 1 100 20 L 100 100 Z"
              fill={COLORS[3]}
              className="opacity-30"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartSkeleton;
