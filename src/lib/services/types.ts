export const VALID_TAG_KEYS = ["Team", "Name"] as const;
export type TagKey = (typeof VALID_TAG_KEYS)[number];

export const VALID_GROUP_BY_DIMENSIONS = [
  "RESOURCE_ID",
  "INSTANCE_TYPE",
] as const;
export type GroupByDimension = (typeof VALID_GROUP_BY_DIMENSIONS)[number];

export const VALID_GROUP_BY_DIMENSIONS_WITH_TAG = [
  "RESOURCE_ID",
  "INSTANCE_TYPE",
  "TAG",
] as const;
export type GroupByDimensionWithTag =
  (typeof VALID_GROUP_BY_DIMENSIONS_WITH_TAG)[number];
