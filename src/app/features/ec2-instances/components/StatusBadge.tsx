import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const getStatusColor = (state: string) => {
  if (state === "running") return "bg-green-600";
  if (["stopping", "pending"].includes(state)) return "bg-yellow-600";
  if (state === "stopped") return "bg-red-600";
  return "bg-gray-600";
};

interface StatusBadgeProps {
  state: string;
}

const StatusBadge = ({ state }: StatusBadgeProps) => {
  const color = getStatusColor(state);
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className={cn("size-2 rounded-full", color)} />
      </TooltipTrigger>
      <TooltipContent>Status: {state}</TooltipContent>
    </Tooltip>
  );
};

export default StatusBadge;
