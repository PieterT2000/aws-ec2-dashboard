"use client";

import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEC2TableFilter } from "@/contexts/TableFilterContext";

interface ColumnFilterButtonProps {
  column: "type" | "team" | "wasteScore";
  options: string[];
}

export function ColumnFilterButton({
  column,
  options,
}: ColumnFilterButtonProps) {
  const { hasFilter, openFilter, filterValues } = useEC2TableFilter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Get the position of the clicked element
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2, // Center horizontally
      y: rect.bottom + 8, // Below the icon with some spacing
    };

    openFilter(column, options, filterValues[column], position);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn(
        "size-6 hover:cursor-pointer",
        hasFilter(column) && "bg-primary/10 text-primary"
      )}
    >
      <Filter className="size-4" />
    </Button>
  );
}
