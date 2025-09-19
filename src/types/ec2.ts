export interface EC2Instance {
  id: string;
  state: string;
  type: string;
  privateIp: string;
  publicIp?: string;
  launchTime: string;
  region?: string;
  tags: {
    Name: Array<{
      Key: string;
      Value: string;
    }>;
    Team?: Array<{
      Key: string;
      Value: string;
    }>;
  };
  status?: {
    AvailabilityZone: string;
    AvailabilityZoneId: string;
    Operator: {
      Managed: boolean;
    };
    InstanceId: string;
    InstanceState: {
      Code: number;
      Name: string;
    };
    InstanceStatus: {
      Details: Array<{
        Name: string;
        Status: string;
      }>;
      Status: string;
    };
    SystemStatus: {
      Details: Array<{
        Name: string;
        Status: string;
      }>;
      Status: string;
    };
    AttachedEbsStatus: {
      Details: Array<{
        Name: string;
        Status: string;
      }>;
      Status: string;
    };
  };
  metrics?: {
    CPUUtilization?: number;
    MemoryUtilization?: number;
    EBSWriteOps?: number;
    EBSReadOps?: number;
    NetworkIn?: number;
    NetworkOut?: number;
    // New fields from the API
    cpuUsagePercent?: number;
    memoryUsagePercent?: number;
    diskUsagePercent?: number;
  };
  // Calculated fields
  uptime?: number; // in hours
  cost?: {
    total: number;
    hourly: number;
  };
  wasteScore?: number; // percentage
  efficiencyLevel?: "low" | "medium" | "high" | "critical";
}

export interface EC2Response {
  success: boolean;
  data: EC2Instance[];
}
