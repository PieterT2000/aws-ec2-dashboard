import { useMemo, useState } from "react";
import { useWithResourceWasteCalculation } from "../useWithResourceWasteCalculation";
import { useEC2TableFilter } from "@/contexts/TableFilterContext";

export function useFilteredInstances(
  instances: ReturnType<typeof useWithResourceWasteCalculation>
) {
  const { filterValues, clearAllFilters, hasActiveFilters } =
    useEC2TableFilter();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    return instances.filter((instance) => {
      // Type filter
      if (filterValues.type.length > 0) {
        const instanceType = instance.type || "unknown";
        if (!filterValues.type.includes(instanceType)) return false;
      }

      // Team filter
      if (filterValues.team.length > 0) {
        const team = instance.tags?.Team || "Unassigned";
        if (!filterValues.team.includes(team)) return false;
      }

      // Waste Score filter
      if (filterValues.wasteScore.length > 0) {
        const wasteScore = instance.wasteScore || 0;
        let wasteScoreLabel = "Low";
        if (wasteScore >= 75) wasteScoreLabel = "High";
        else if (wasteScore >= 50) wasteScoreLabel = "Medium";

        if (!filterValues.wasteScore.includes(wasteScoreLabel)) return false;
      }

      return true;
    });
  }, [instances, filterValues]);

  // Apply text search filtering to already filtered data
  const filteredInstances = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return filteredData;
    }

    return filteredData.filter((instance) => {
      // Search through all relevant text fields
      const searchableText = [
        instance.name || "",
        instance.id || "",
        instance.type || "",
        instance.region || "",
        instance.state || "",
        instance.tags?.Team || "",
        instance.costStats?.avgCost?.toString() || "",
        instance.metrics?.cpuUsagePercent?.toString() || "",
        instance.metrics?.memoryUsagePercent?.toString() || "",
        instance.metrics?.diskUsagePercent?.toString() || "",
        instance.wasteScore?.toString() || "",
        // Add waste score label
        instance.wasteScore >= 75
          ? "High"
          : instance.wasteScore >= 50
          ? "Medium"
          : "Low",
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [filteredData, searchQuery]);

  return {
    filteredInstances,
    searchQuery,
    hasActiveFilters,
    clearAllFilters,
    setSearchQuery,
  };
}
