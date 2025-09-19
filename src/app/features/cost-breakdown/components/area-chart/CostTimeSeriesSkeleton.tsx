import { Skeleton } from "@/components/ui/skeleton";
import { COLORS } from "../../const";

const CostTimeSeriesSkeleton = () => {
  return (
    <div className="space-y-4 p-6">
      <div className="h-80 relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-4">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-8" />
        </div>

        <div className="ml-12 mr-4 h-full flex flex-col">
          <div className="flex-1 relative">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              {/* Grid lines */}
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-muted/20"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Stacked area chart skeleton */}
              <path
                d="M0,200 L0,120 Q50,110 100,115 Q150,120 200,118 Q250,115 300,120 Q350,125 400,130 L400,200 Z"
                fill={COLORS[0]}
                className="opacity-30"
              />

              <path
                d="M0,120 L0,80 Q50,75 100,78 Q150,82 200,80 Q250,78 300,82 Q350,85 400,88 L400,130 Q350,125 300,120 Q250,115 200,118 Q150,120 100,115 Q50,110 0,120 Z"
                fill={COLORS[1]}
                className="opacity-30"
              />

              <path
                d="M0,80 L0,60 Q50,55 100,58 Q150,62 200,60 Q250,58 300,62 Q350,65 400,68 L400,88 Q350,85 300,82 Q250,78 200,80 Q150,82 100,78 Q50,75 0,80 Z"
                fill={COLORS[2]}
                className="opacity-30"
              />

              <path
                d="M0,60 L0,30 Q50,25 100,28 Q150,32 200,30 Q250,28 300,32 Q350,35 400,38 L400,68 Q350,65 300,62 Q250,58 200,60 Q150,62 100,58 Q50,55 0,60 Z"
                fill={COLORS[3]}
                className="opacity-30"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Legend Skeleton */}
      <div className="flex flex-wrap gap-4 justify-center pt-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: COLORS[index] }}
            />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CostTimeSeriesSkeleton;
