import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatUptime } from "@/lib/date-utils";
import { formatUSDCurrency, formatPercentage } from "@/lib/number-formatting";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "./StatusBadge";
import { ColumnFilterButton } from "./table-filter/ColumnFilterButton";
import { ArrowDown } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useWithResourceOptimisation } from "../hooks/useWithResourceOptimisation";

const colorIndicatorMap = {
  low: {
    bg: "bg-green-500",
    text: "text-green-800",
    badgeBg: "bg-green-100 hover:bg-green-200",
  },
  medium: {
    bg: "bg-yellow-500",
    text: "text-yellow-800",
    badgeBg: "bg-amber-100 hover:bg-amber-200",
  },
  high: {
    bg: "bg-red-500",
    text: "text-red-800",
    badgeBg: "bg-red-100 hover:bg-red-200",
  },
};

function getColorIndicator(percentage: number) {
  if (percentage >= 75) return colorIndicatorMap.high;
  if (percentage >= 30) return colorIndicatorMap.medium;
  return colorIndicatorMap.low;
}

function getWasteScoreColor(percentage: number) {
  if (percentage >= 75) return colorIndicatorMap.high;
  if (percentage >= 50) return colorIndicatorMap.medium;
  return colorIndicatorMap.low;
}

function getWasteScoreLabel(percentage: number) {
  if (percentage >= 75) return "High";
  if (percentage >= 50) return "Medium";
  return "Low";
}

const PercentUsageIndicator = ({ percentage }: { percentage: number }) => {
  const { bg } = getColorIndicator(percentage);
  return (
    <div className="flex gap-x-2 items-center">
      <Progress value={percentage} color={bg} className="h-2" />
      <span className={cn("font-medium text-xs text-muted-foreground")}>
        {formatPercentage(percentage / 100, 0)}
      </span>
    </div>
  );
};

interface ColumnFilterProps {
  typeOptions: string[];
  teamOptions: string[];
  wasteScoreOptions: string[];
}

export const createColumns = (
  filterProps: ColumnFilterProps
): ColumnDef<ReturnType<typeof useWithResourceOptimisation>[number]>[] => [
  {
    accessorKey: "name",
    header: "Instance",
    cell: ({ row }) => {
      const instance = row.original;
      const name = instance.name || "no name";
      const region = instance.region || "unknown region";
      const id = instance.id || "unknown";
      const state = instance.state || "unknown state";

      return (
        <div className="grid gap-y-2">
          <div className="flex items-center gap-2 justify-between">
            <div className="font-semibold text-foreground text-sm">{name}</div>
            <StatusBadge state={state} />
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Id: {id}</span>
              <span>•</span>
              {region}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: () => (
      <div className="flex items-center gap-2">
        <ColumnFilterButton column="type" options={filterProps.typeOptions} />
        <span>Type</span>
      </div>
    ),
    cell: ({ row }) => {
      const instanceType = row.original.type;

      return instanceType ? (
        <div className="text-sm">
          <Badge variant={"secondary"} className="text-xs">
            {instanceType}
          </Badge>
        </div>
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "tags.Team",
    header: () => (
      <div className="flex items-center gap-2">
        <ColumnFilterButton column="team" options={filterProps.teamOptions} />
        <span>Team</span>
      </div>
    ),
    cell: ({ row }) => {
      const team = row.original.tags?.Team || "Unassigned";

      return team ? (
        <div className="text-sm">
          <Badge variant={"outline"} className="text-xs">
            {team}
          </Badge>
        </div>
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "uptime",
    header: "Uptime",
    enableSorting: true,
    cell: ({ row }) => {
      const uptime = row.original.uptime || 0;
      const formattedUptime = formatUptime(uptime);

      return (
        <div className="text-sm text-muted-foreground font-mono">
          {formattedUptime}
        </div>
      );
    },
  },
  {
    accessorKey: "costStats.avgCost",
    header: "Hourly Cost (Avg)",
    enableSorting: true,
    cell: ({ row }) => {
      const avgCost = row.original.costStats?.avgCost;

      return avgCost ? (
        <div className="text-sm text-foreground font-mono">
          {formatUSDCurrency(avgCost)}
        </div>
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "metrics.cpuUsagePercent",
    header: "CPU Usage",
    enableSorting: true,
    cell: ({ row }) => {
      const cpuUsage = row.original.metrics?.cpuUsagePercent || 0;
      return <PercentUsageIndicator percentage={cpuUsage} />;
    },
  },
  {
    accessorKey: "metrics.memoryUsagePercent",
    header: "Memory Usage",
    enableSorting: true,
    cell: ({ row }) => {
      const memoryUsage = row.original.metrics?.memoryUsagePercent || 0;
      return <PercentUsageIndicator percentage={memoryUsage} />;
    },
  },
  // {
  //   accessorKey: "metrics.diskUsagePercent",
  //   header: "Disk Usage (Avg)",
  //   enableSorting: true,
  //   cell: ({ row }) => {
  //     const diskUsage = row.original.metrics?.diskUsagePercent || 0;
  //     return <PercentUsageIndicator percentage={diskUsage} />;
  //   },
  // },
  {
    accessorKey: "wasteScore",
    header: () => (
      <div className="flex items-center gap-2">
        <ColumnFilterButton
          column="wasteScore"
          options={filterProps.wasteScoreOptions}
        />
        <span>Waste</span>
      </div>
    ),
    cell: ({ row }) => {
      const wasteScore = row.original.wasteScore || 0;
      const { text, badgeBg } = getWasteScoreColor(wasteScore);
      const label = getWasteScoreLabel(wasteScore);
      return (
        <Badge
          variant={"default"}
          className={cn("text-xs w-[70px] flex justify-center", badgeBg, text)}
        >
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "costSavings.estimatedMonthlySavings",
    header: "Cost saving action",
    enableSorting: true,
    cell: ({ row }) => {
      const costSavingsPercentage =
        row.original.costSavings?.estimatedSavingsPercentage ?? 0;
      const recommendedResourceSummary =
        row.original.costSavings?.recommendedResourceSummary ?? "";

      return (
        <Tooltip>
          <TooltipTrigger>
            <div className="flex gap-x-3">
              {recommendedResourceSummary && (
                <Badge variant={"secondary"} className="text-xs">
                  {recommendedResourceSummary}
                </Badge>
              )}
              {costSavingsPercentage > 0 && (
                <div className="flex items-center">
                  <div className="flex items-center gap-0.5 text-green-600">
                    <span className="text-sm font-medium">
                      {formatPercentage(costSavingsPercentage / 100, 0)}
                    </span>
                    <ArrowDown className="size-4" />
                  </div>
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent
            className="bg-card border rounded-lg border-border shadow-card-foreground"
            arrowClassName="bg-card fill-card"
          >
            <div className="space-y-4 p-2">
              <div className="space-y-1">
                <h4 className="font-semibold text-sm text-foreground">
                  Cost Optimization Opportunity
                </h4>
                <p className="text-xs text-muted-foreground">
                  Reduce costs by migrating to a more efficient instance type
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-medium text-xs text-foreground uppercase tracking-wide">
                  Recommended Action
                </h5>
                <div className="bg-background/50 rounded-md p-2">
                  <p className="text-xs text-foreground">
                    Migrate from{" "}
                    <span className="text-black font-semibold">
                      {row.original.type}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-primary">
                      {recommendedResourceSummary}
                    </span>
                  </p>
                </div>
              </div>

              {(row.original.costSavings?.estimatedMonthlySavings ||
                costSavingsPercentage > 0) && (
                <div className="space-y-2">
                  <h5 className="font-medium text-xs text-foreground uppercase tracking-wide">
                    Estimated Savings
                  </h5>
                  <div className="grid grid-cols-3 gap-3">
                    {row.original.costSavings?.estimatedMonthlyCost && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Current</p>
                        <p className="font-semibold text-sm text-red-600">
                          {formatUSDCurrency(
                            row.original.costSavings.estimatedMonthlyCost
                          )}
                        </p>
                      </div>
                    )}

                    {row.original.costSavings?.estimatedMonthlySavings && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Savings</p>
                        <p className="font-semibold text-sm text-green-600">
                          {formatUSDCurrency(
                            row.original.costSavings.estimatedMonthlySavings
                          )}
                        </p>
                      </div>
                    )}
                    {costSavingsPercentage > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Reduction
                        </p>
                        <div className="flex items-center gap-0.5 text-green-600">
                          <span className="text-sm font-semibold">
                            {formatPercentage(costSavingsPercentage / 100, 0)}
                          </span>
                          <ArrowDown className="size-3" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
];
