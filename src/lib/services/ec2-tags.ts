import { EC2Client, DescribeTagsCommand } from "@aws-sdk/client-ec2";

const ec2Client = new EC2Client({});

export interface EC2Tag {
  key: string;
  values: string[];
}

/**
 * Get all available EC2 tag keys
 */
export async function getAvailableTagKeys(): Promise<string[]> {
  try {
    const command = new DescribeTagsCommand({
      Filters: [
        {
          Name: "resource-type",
          Values: ["instance"],
        },
      ],
    });

    const response = await ec2Client.send(command);

    if (!response.Tags) {
      return [];
    }

    // Extract unique tag keys
    const tagKeys = new Set<string>();
    response.Tags.forEach((tag) => {
      if (tag.Key) {
        tagKeys.add(tag.Key);
      }
    });

    return Array.from(tagKeys).sort();
  } catch (error) {
    console.error("Error fetching EC2 tag keys:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch EC2 tag keys"
    );
  }
}
