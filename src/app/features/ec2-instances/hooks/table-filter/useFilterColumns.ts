import { useCallback, useMemo } from "react";
import { useWithResourceOptimisation } from "../useWithResourceOptimisation";
import { createColumns } from "../../components/columns";

export function useFilterColumns(
  instances: ReturnType<typeof useWithResourceOptimisation>
) {
  const getUniqueValues = useCallback(
    (column: "type" | "team" | "wasteScore") => {
      switch (column) {
        case "type":
          return Array.from(
            new Set(
              instances.map((item) => item.type || "unknown").filter(Boolean)
            )
          );
        case "team":
          return Array.from(
            new Set(
              instances
                .map((item) => item.tags?.Team || "Unassigned")
                .filter(Boolean)
            )
          );
        case "wasteScore":
          return ["Low", "Medium", "High"];
        default:
          return [];
      }
    },
    [instances]
  );

  // Memoize columns - only recreate when options change
  const columnsWithFilters = useMemo(() => {
    return createColumns({
      typeOptions: getUniqueValues("type"),
      teamOptions: getUniqueValues("team"),
      wasteScoreOptions: getUniqueValues("wasteScore"),
    });
  }, [getUniqueValues]);
  return columnsWithFilters;
}
