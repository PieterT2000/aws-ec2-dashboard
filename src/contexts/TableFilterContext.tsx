"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export interface FilterValues {
  type: string[];
  team: string[];
  wasteScore: string[];
}

export interface FilterState {
  isOpen: boolean;
  activeColumn: "type" | "team" | "wasteScore" | null;
  options: string[];
  selectedValues: string[];
  position: { x: number; y: number } | null;
}

const initialFilterValues: FilterValues = {
  type: [],
  team: [],
  wasteScore: [],
};

const initialFilterState: FilterState = {
  isOpen: false,
  activeColumn: null,
  options: [],
  selectedValues: [],
  position: null,
};

interface FilterContextType {
  filterValues: FilterValues;
  filterState: FilterState;
  openFilter: (
    column: "type" | "team" | "wasteScore",
    options: string[],
    selectedValues: string[],
    position: { x: number; y: number }
  ) => void;
  closeFilter: () => void;
  updateFilterValues: (column: keyof FilterValues, values: string[]) => void;
  clearFilter: (column: keyof FilterValues) => void;
  clearAllFilters: () => void;
  hasFilter: (column: keyof FilterValues) => boolean;
  hasActiveFilters: boolean;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function EC2TableFilterProvider({ children }: { children: ReactNode }) {
  const [filterValues, setFilterValues] =
    useState<FilterValues>(initialFilterValues);
  const [filterState, setFilterState] =
    useState<FilterState>(initialFilterState);

  const openFilter = useCallback(
    (
      column: "type" | "team" | "wasteScore",
      options: string[],
      selectedValues: string[],
      position: { x: number; y: number }
    ) => {
      setFilterState({
        isOpen: true,
        activeColumn: column,
        options,
        selectedValues,
        position,
      });
    },
    []
  );

  const closeFilter = useCallback(() => {
    setFilterState(initialFilterState);
  }, []);

  const updateFilterValues = useCallback(
    (column: keyof FilterValues, values: string[]) => {
      setFilterValues((prev) => ({
        ...prev,
        [column]: values,
      }));

      // Update the current filter state if it's the active column
      setFilterState((prev) => ({
        ...prev,
        selectedValues: values,
      }));
    },
    []
  );

  const clearFilter = useCallback((column: keyof FilterValues) => {
    setFilterValues((prev) => ({
      ...prev,
      [column]: [],
    }));

    // If this is the active column, update the state and close
    setFilterState((prev) => {
      if (prev.activeColumn === column) {
        return {
          ...prev,
          selectedValues: [],
        };
      }
      return prev;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilterValues(initialFilterValues);
    setFilterState(initialFilterState);
  }, []);

  const hasFilter = useCallback(
    (column: keyof FilterValues) => {
      return filterValues[column].length > 0;
    },
    [filterValues]
  );

  const hasActiveFilters =
    filterValues.type.length > 0 ||
    filterValues.team.length > 0 ||
    filterValues.wasteScore.length > 0;

  return (
    <FilterContext.Provider
      value={{
        filterValues,
        filterState,
        openFilter,
        closeFilter,
        updateFilterValues,
        clearFilter,
        clearAllFilters,
        hasFilter,
        hasActiveFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useEC2TableFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}
