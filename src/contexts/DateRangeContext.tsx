"use client";

import React, { createContext, useContext, useState } from "react";
import { type DateRange } from "react-day-picker";

interface DateRangeContextType {
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(
  undefined
);

const defaultRange: DateRange = {
  from: new Date(new Date().setDate(new Date().getDate() - 2)),
  to: new Date(),
};

export function DateRangeProvider({ children }: { children: React.ReactNode }) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultRange
  );

  return (
    <DateRangeContext.Provider
      value={{
        dateRange,
        setDateRange,
      }}
    >
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }
  return context;
}
