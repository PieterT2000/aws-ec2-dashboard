import { useCostBreakdownFilters } from "@/contexts/CostBreakdownContext";
import { TagKey } from "@/lib/services/types";

/**
 * Returns the groupByDimension and tag parameters for the cost breakdown query
 */
export function useGroupByParams() {
  const { groupBy, selectedTag } = useCostBreakdownFilters();

  if (groupBy === "TAG") {
    return { groupByDimension: undefined, tag: selectedTag as TagKey };
  }

  return { groupByDimension: groupBy, tag: undefined };
}
