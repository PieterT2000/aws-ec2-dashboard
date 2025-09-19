"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { formatPercentage, formatUSDCurrency } from "@/lib/number-formatting";
import { cn } from "@/lib/utils";
import MiniLineChart from "./MiniLineChart";

interface KPICardProps {
  title: string;
  subtitle?: string;
  value?: number;
  percentageChange?: number;
  actualData?: number[];
  projectedData?: number[];
  className?: string;
  isError?: boolean;
  isLoading?: boolean;
}

const KPICard = ({
  title,
  subtitle,
  value,
  percentageChange,
  isLoading,
  isError,
  className = "",
  actualData,
  projectedData,
}: KPICardProps) => {
  const isPositive = percentageChange && percentageChange > 0;
  const isZero = Math.abs(percentageChange ?? 0) < 0.001;

  return (
    <Card
      className={`bg-card shadow-none shadow-card border-0 rounded-lg p-0 ${className}`}
    >
      <CardContent className="p-6">
        {isError ? (
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>

              <h3 className="text-2xl font-semibold text-foreground">$0</h3>
            </div>
            <div className="h-6 bg-muted animate-pulse rounded w-16"></div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
              <div className="h-8 bg-muted animate-pulse rounded w-32"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
            </div>
            <div className="h-6 bg-muted animate-pulse rounded w-16"></div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex gap-x-2 items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {title}
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {subtitle}
                </span>
              </div>

              <div className="flex gap-x-2 w-full justify-between items-start">
                <div className="flex items-center space-x-2">
                  <h3 className="text-2xl font-semibold text-foreground">
                    {value ? formatUSDCurrency(value) : "N/A"}
                  </h3>

                  {percentageChange !== undefined && (
                    <div className="flex items-center space-x-1">
                      {isPositive ? (
                        <ArrowUp className="h-3 w-3 text-red-600" />
                      ) : isZero ? (
                        <ArrowRight className="h-3 w-3 text-primary" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-green-600" />
                      )}
                      <span
                        className={cn(
                          "text-xs font-medium",
                          isPositive
                            ? "text-red-600"
                            : isZero
                            ? "text-primary"
                            : "text-green-600"
                        )}
                      >
                        {formatPercentage(percentageChange)}
                      </span>
                    </div>
                  )}
                </div>
                {actualData && (
                  <MiniLineChart
                    actualData={actualData}
                    projectedData={projectedData}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard;
