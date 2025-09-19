"use client";

import TotalCostPieChart from "./pie-chart/TotalCostPieChart";
import CostTimeSeriesChart from "./area-chart/CostTimeSeriesChart";
import CostBreakdownControls from "./CostBreakdownControls";
import { useCostBreakdownFilters } from "@/contexts/CostBreakdownContext";
import DashboardSection from "@/components/shared/DashboardSection";
import { GroupByDimensionWithTag } from "@/lib/services/types";

const CostBreakdownSection = () => {
  const { groupBy, setGroupBy, selectedTag, setSelectedTag } =
    useCostBreakdownFilters();

  const handleGroupByChange = (value: GroupByDimensionWithTag) => {
    setGroupBy(value);
    // Clear selected tag when changing away from tag grouping
    if (value !== "TAG") {
      setSelectedTag(undefined);
    }
  };

  const handleTagChange = (value: string) => {
    setSelectedTag(value);
  };

  return (
    <DashboardSection
      title="Cost Breakdown"
      controls={
        <CostBreakdownControls
          groupBy={groupBy}
          onGroupByChange={handleGroupByChange}
          selectedTag={selectedTag}
          onTagChange={handleTagChange}
        />
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg bg-card shadow-card-foreground p-6">
          <TotalCostPieChart />
        </div>
        <div className="rounded-lg bg-card shadow-card-foreground p-6">
          <CostTimeSeriesChart />
        </div>
      </div>
    </DashboardSection>
  );
};

export default CostBreakdownSection;
