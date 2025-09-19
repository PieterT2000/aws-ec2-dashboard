import {
  ListRecommendationsCommand,
  ListRecommendationSummariesCommand,
} from "@aws-sdk/client-cost-optimization-hub";
import { costOptimizationClient } from "./aws-config";

export async function getCostSavingRecommendations() {
  try {
    const command = new ListRecommendationsCommand({});

    const response = await costOptimizationClient.send(command);
    const recommendations = response.items
      ?.filter((item) => item.currentResourceType === "Ec2Instance")
      .map((item) => ({
        resourceId: item.resourceId,
        actionType: item.actionType,
        estimatedMonthlyCost: item.estimatedMonthlyCost,
        estimatedMonthlySavings: item.estimatedMonthlySavings,
        estimatedSavingsPercentage: item.estimatedSavingsPercentage,
        recommendedResourceSummary: item.recommendedResourceSummary,
        recommendedResourceType: item.recommendedResourceType,
      }));
    return recommendations;
  } catch (error) {
    console.error("Error fetching cost savings recommendations:", error);
    throw error;
  }
}

export type CostSavingRecommendations = Awaited<
  ReturnType<typeof getCostSavingRecommendations>
>;

export async function getTotalCostSavings() {
  try {
    const command = new ListRecommendationSummariesCommand({
      filter: {
        resourceTypes: ["Ec2Instance"],
      },
      groupBy: "ResourceType",
      metrics: ["SavingsPercentage"],
    });

    const response = await costOptimizationClient.send(command);
    const absoluteSavings = response.estimatedTotalDedupedSavings;
    const percentageSavings = response.metrics?.savingsPercentage;
    return {
      absoluteSavings,
      percentageSavings,
    };
  } catch (error) {
    console.error("Error fetching total cost savings:", error);
    throw error;
  }
}

export type TotalCostSavings = Awaited<ReturnType<typeof getTotalCostSavings>>;
