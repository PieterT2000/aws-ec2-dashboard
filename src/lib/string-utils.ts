/**
 * Parses the key to a readable label. If the key is a tag value, the tagkey prefix is removed.
 */
export const getLabelFromKey = (key: string, isTagKey: boolean) => {
  if (isTagKey) {
    return key.toLowerCase().split("$").slice(1).join(" ");
  }
  return key;
};
