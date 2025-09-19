"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { X, Check } from "lucide-react";
import { useEC2TableFilter } from "@/contexts/TableFilterContext";

const FilterPopupPortal = () => {
  const { filterState, closeFilter, updateFilterValues, clearFilter } =
    useEC2TableFilter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOptionToggle = (option: string) => {
    if (!filterState.activeColumn) return;

    const currentValues = filterState.selectedValues;
    let newValues: string[];

    if (currentValues.includes(option)) {
      newValues = currentValues.filter((v) => v !== option);
    } else {
      newValues = [...currentValues, option];
    }

    updateFilterValues(filterState.activeColumn, newValues);
  };

  const handleClearFilter = () => {
    if (!filterState.activeColumn) return;
    clearFilter(filterState.activeColumn);
    closeFilter();
  };

  const getColumnLabel = (column: string) => {
    switch (column) {
      case "type":
        return "Instance Type";
      case "team":
        return "Team";
      case "wasteScore":
        return "Waste Score";
      default:
        return "Filter";
    }
  };

  if (
    !mounted ||
    !filterState.isOpen ||
    !filterState.activeColumn ||
    !filterState.position
  ) {
    return null;
  }

  // Calculate position with bounds checking
  const portalWidth = 320; // w-80 = 320px
  const portalHeight = 400; // estimated height
  const margin = 16;

  let left = filterState.position.x - portalWidth / 2; // Center horizontally
  let top = filterState.position.y;

  // Ensure portal doesn't go off-screen
  if (left < margin) {
    left = margin;
  } else if (left + portalWidth > window.innerWidth - margin) {
    left = window.innerWidth - portalWidth - margin;
  }

  if (top + portalHeight > window.innerHeight - margin) {
    top = filterState.position.y - portalHeight - 8; // Show above instead
  }

  const portalContent = (
    <div
      className="fixed inset-0 z-50"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "auto",
      }}
    >
      <div
        className="absolute inset-0 bg-black/20"
        onClick={closeFilter}
        style={{ pointerEvents: "auto" }}
      />
      <div
        className="absolute z-10 w-80 bg-background border rounded-lg shadow-lg"
        style={{
          left: `${left}px`,
          top: `${top}px`,
          position: "absolute",
          pointerEvents: "auto",
        }}
      >
        <Command>
          <div className="flex items-center justify-between px-3 py-1 border-b">
            <div className="text-sm font-medium">
              {getColumnLabel(filterState.activeColumn)} Filter
            </div>
            {filterState.selectedValues.length > 0 && (
              <Button
                variant="link"
                size="sm"
                onClick={handleClearFilter}
                className="p-0"
              >
                Clear
              </Button>
            )}
          </div>
          <CommandInput
            placeholder={`Search ${getColumnLabel(
              filterState.activeColumn
            ).toLowerCase()}...`}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {filterState.options.map((option) => {
                const isSelected = filterState.selectedValues.includes(option);
                return (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => {
                      handleOptionToggle(option);
                    }}
                    className="flex items-center space-x-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <span className="flex-1">{option}</span>
                    {isSelected && <Check className="h-4 w-4" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  );

  return createPortal(portalContent, document.body);
};

export default FilterPopupPortal;
