"use client";

import { GroupByDimensionWithTag } from "@/lib/services/types";
import React, { createContext, useContext, useState } from "react";

interface CostBreakdownContextType {
  groupBy: GroupByDimensionWithTag;
  setGroupBy: (groupBy: GroupByDimensionWithTag) => void;
  selectedTag: string | undefined;
  setSelectedTag: (tag: string | undefined) => void;
}

const CostBreakdownContext = createContext<
  CostBreakdownContextType | undefined
>(undefined);

export function CostBreakdownProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [groupBy, setGroupBy] =
    useState<GroupByDimensionWithTag>("RESOURCE_ID");
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  return (
    <CostBreakdownContext.Provider
      value={{
        groupBy,
        setGroupBy,
        selectedTag,
        setSelectedTag,
      }}
    >
      {children}
    </CostBreakdownContext.Provider>
  );
}

export function useCostBreakdownFilters() {
  const context = useContext(CostBreakdownContext);
  if (context === undefined) {
    throw new Error(
      "useCostBreakdownFilters must be used within a CostBreakdownProvider"
    );
  }
  return context;
}
