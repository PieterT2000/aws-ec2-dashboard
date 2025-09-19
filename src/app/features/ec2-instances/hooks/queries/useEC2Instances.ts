"use client";
import { EC2InstanceTabularData } from "@/lib/services/ec2";
import { formatISODateStr } from "@/lib/date-utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DateRange } from "react-day-picker";

export const ec2InstancesQueryKeys = {
  all: ["ec2-instances"],
  byDateRange: (dateRange: DateRange | undefined) => [
    ...ec2InstancesQueryKeys.all,
    dateRange,
  ],
};

export function useEC2Instances({
  dateRange,
}: {
  dateRange: DateRange | undefined;
}) {
  return useQuery<{ success: boolean; data: EC2InstanceTabularData }>({
    queryKey: ec2InstancesQueryKeys.byDateRange(dateRange),
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to) {
        throw new Error("Date range is required");
      }

      const response = await axios.get("/api/ec2-instances", {
        params: {
          startDate: formatISODateStr(dateRange.from),
          endDate: formatISODateStr(dateRange.to),
        },
      });
      if (!response.data.success) {
        throw new Error("Failed to fetch EC2 instances");
      }
      return response.data;
    },
  });
}
