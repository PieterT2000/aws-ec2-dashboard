"use client";

import { DataTable } from "./data-table";
import { useEC2Instances } from "../hooks/queries/useEC2Instances";
import { useWithResourceWasteCalculation } from "../hooks/useWithResourceWasteCalculation";
import { useDateRange } from "@/contexts/DateRangeContext";
import { ErrorState } from "@/components/ui/error-state";
import TableSkeleton from "./TableSkeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import { useFilteredInstances } from "../hooks/table-filter/useFilteredInstances";
import { useMemo } from "react";
import { createColumns } from "./columns";
import { useFilterColumns } from "../hooks/table-filter/useFilterColumns";
import FilterPopupPortal from "./table-filter/FilterPopupPortal";

function EC2InstancesDataTable() {
  const { dateRange } = useDateRange();
  const { data, isLoading, isError, error, isSuccess } = useEC2Instances({
    dateRange,
  });
  const instances = data?.data || [];
  const instancesWithWaste = useWithResourceWasteCalculation(instances);

  const {
    filteredInstances,
    searchQuery,
    hasActiveFilters,
    clearAllFilters,
    setSearchQuery,
  } = useFilteredInstances(instancesWithWaste);

  const columns = useFilterColumns(instancesWithWaste);

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load EC2 Instances"
        message={
          error instanceof Error
            ? error.message
            : "Unable to fetch EC2 instance data. Please check your connection and try again."
        }
        onRetry={() => window.location.reload()}
        className="shadow-card-foreground"
      />
    );
  }

  if (!isSuccess) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Table Section */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {filteredInstances.length} of {instances.length} Items
          {(hasActiveFilters || searchQuery.trim()) && (
            <span className="ml-2 text-primary">(filtered)</span>
          )}
        </p>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Clear All Filters
            </Button>
          )}
          <div className="relative w-[400px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search instances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-lg"
            />
          </div>
        </div>
      </div>
      <DataTable columns={columns} data={filteredInstances} />
      <FilterPopupPortal />
    </div>
  );
}

export default EC2InstancesDataTable;
