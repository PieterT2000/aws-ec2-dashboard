import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  CostSavingRecommendations,
  TotalCostSavings,
} from "@/lib/services/cost-savings";

export const costSavingsQueryKeys = {
  all: ["cost-savings"],
};

export function useCostSavings() {
  return useQuery<{
    data: {
      recommendations: CostSavingRecommendations;
      totalSavings: TotalCostSavings;
    };
    success: boolean;
  }>({
    queryKey: costSavingsQueryKeys.all,
    queryFn: async () => {
      const response = await axios.get("/api/cost-savings");

      if (!response.data.success) {
        throw new Error("Failed to fetch cost savings recommendations");
      }

      return response.data;
    },
  });
}
