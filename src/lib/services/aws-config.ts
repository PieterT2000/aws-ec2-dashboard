import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import { EC2Client } from "@aws-sdk/client-ec2";
import { CostExplorerClient } from "@aws-sdk/client-cost-explorer";
import { GetCallerIdentityCommand, STSClient } from "@aws-sdk/client-sts";

export const awsConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
};

export const ec2Client = new EC2Client(awsConfig);
export const stsClient = new STSClient(awsConfig);
export const cloudwatchClient = new CloudWatchClient(awsConfig);
export const costExplorerClient = new CostExplorerClient(awsConfig);

export async function isValidCredential() {
  try {
    const command = new GetCallerIdentityCommand({});
    const response = await stsClient.send(command);
    return !!response.Account;
  } catch {
    return false;
  }
}
