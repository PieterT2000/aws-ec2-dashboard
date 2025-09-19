"use client";

import * as React from "react";
import { CalendarDays, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDateRange } from "@/contexts/DateRangeContext";
import { DateRange } from "react-day-picker";
import { useQueryClient } from "@tanstack/react-query";
import { ec2InstancesQueryKeys } from "@/app/features/ec2-instances/hooks/queries/useEC2Instances";
import { costBreakdownQueryKeys } from "@/app/features/cost-breakdown/hooks/useCostBreakdownQueries";
import { Alert, AlertDescription } from "../ui/alert";

const DateRangeSelector = () => {
  const { dateRange, setDateRange } = useDateRange();
  const queryClient = useQueryClient();

  const formatDateRange = (range: typeof dateRange) => {
    if (!range?.from) return "Select date";
    if (!range?.to)
      return range.from.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    return `${range.from.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} - ${range.to.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);

    if (!range || !range.from || !range.to) return;
    const newFrom = new Date(range.from);
    const newTo = new Date(range.to);
    if (newFrom.getTime() === newTo.getTime()) {
      newTo.setHours(23, 59, 59, 999);
    }
    // else if difference is 14 days, set end date to 23:59:59 on day before
    else if (newTo.getTime() - newFrom.getTime() === 14 * 24 * 60 * 60 * 1000) {
      newTo.setHours(23, 59, 59, 999);
      newTo.setDate(newTo.getDate() - 1);
    }

    queryClient.invalidateQueries({
      queryKey: ec2InstancesQueryKeys.all,
    });
    queryClient.invalidateQueries({
      queryKey: costBreakdownQueryKeys.all,
    });
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Disable future dates
    if (date > today) return true;
    if (!dateRange?.from) return false;

    const diffInDays = Math.ceil(
      (date.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffInDays > 14; // MAX 2 weeks for hourly granularity
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              id="dates"
              className="w-min justify-start font-normal shadow-card-foreground hover:bg-card/50 border-0 px-3 py-2 h-auto rounded-lg bg-card text-muted-foreground"
            >
              <CalendarDays className="h-4 w-4 mr-2 " />
              <span>{formatDateRange(dateRange)}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0 max-w-[250px]"
            align="start"
          >
            <Calendar
              mode="range"
              selected={dateRange}
              captionLayout="dropdown"
              onSelect={handleDateRangeChange}
              disabled={isDateDisabled}
            />
            <Alert className=" bg-blue-50 dark:border-blue-800 dark:bg-blue-950 border-none rounded-none rounded-b-md">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200 text-xs">
                Only last 14 days available due to hourly granularity.
              </AlertDescription>
            </Alert>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateRangeSelector;
