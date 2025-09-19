"use client";
import EC2InstancesDataTable from "@/app/features/ec2-instances/components/EC2InstancesDataTable";
import Calendar23 from "@/components/shared/calendar-23";
import CostBreakdownSection from "./features/cost-breakdown/components/CostBreakdownSection";
import { CostBreakdownProvider } from "@/contexts/CostBreakdownContext";
import DashboardSection from "@/components/shared/DashboardSection";
import { EC2TableFilterProvider } from "@/contexts/TableFilterContext";

export default function Home() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <DashboardSection title="EC2 Instances" controls={<Calendar23 />}>
        <div className="rounded-lg bg-card shadow-card-foreground p-6">
          <EC2TableFilterProvider>
            <EC2InstancesDataTable />
          </EC2TableFilterProvider>
        </div>
      </DashboardSection>

      <CostBreakdownProvider>
        <CostBreakdownSection />
      </CostBreakdownProvider>
    </div>
  );
}
