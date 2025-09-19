"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Filter, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColumnFilterProps {
  column: "type" | "team" | "wasteScore";
  label: string;
  options: string[];
  selectedValues: string[];
  onFilterChange: (values: string[]) => void;
  onClearFilter: () => void;
  hasFilter: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function ColumnFilter({
  column,
  label,
  options,
  selectedValues,
  onFilterChange,
  onClearFilter,
  hasFilter,
  isOpen,
  onToggle,
  onClose,
}: ColumnFilterProps) {
  const handleOptionToggle = (option: string) => {
    if (selectedValues.includes(option)) {
      onFilterChange(selectedValues.filter((v) => v !== option));
    } else {
      onFilterChange([...selectedValues, option]);
    }
  };

  const handleClearFilter = () => {
    onClearFilter();
    onClose();
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => (open ? onToggle() : onClose())}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle();
          }}
          className={cn(
            "h-6 w-6 p-0 hover:bg-muted",
            hasFilter && "bg-primary/10 text-primary"
          )}
        >
          <Filter className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0"
        align="start"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <Command>
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <h4 className="text-sm font-medium">{label} Filter</h4>
            {hasFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClearFilter();
                }}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.includes(option);
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
                    <Checkbox
                      id={`${column}-${option}`}
                      checked={isSelected}
                      onCheckedChange={() => {
                        handleOptionToggle(option);
                      }}
                    />
                    <span className="flex-1">{option}</span>
                    {isSelected && <Check className="h-4 w-4" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
