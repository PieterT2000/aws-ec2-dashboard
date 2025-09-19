"use client";
import EC2InstancesDataTable from "@/app/features/ec2-instances/components/EC2InstancesDataTable";
import DateRangeSelector from "@/components/shared/DateRangeSelector";
import CostBreakdownSection from "./features/cost-breakdown/components/CostBreakdownSection";
import { CostBreakdownProvider } from "@/contexts/CostBreakdownContext";
import DashboardSection from "@/components/shared/DashboardSection";
import { EC2TableFilterProvider } from "@/contexts/TableFilterContext";
import KPIDashboard from "./features/kpi/components/KPIDashboard";

export default function Home() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Overview section */}
      <section id="overview">
        <DashboardSection title="Overview">
          <KPIDashboard />
        </DashboardSection>
      </section>

      {/* EC2 Instances section */}
      <section id="ec2-instances">
        <DashboardSection
          title="EC2 Instances"
          controls={<DateRangeSelector />}
        >
          <div className="rounded-lg bg-card shadow-card-foreground p-6">
            <EC2TableFilterProvider>
              <EC2InstancesDataTable />
            </EC2TableFilterProvider>
          </div>
        </DashboardSection>
      </section>

      {/* Cost Breakdown section */}
      <section id="cost-breakdown">
        <CostBreakdownProvider>
          <CostBreakdownSection />
        </CostBreakdownProvider>
      </section>
    </div>
  );
}
