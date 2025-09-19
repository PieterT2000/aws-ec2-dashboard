/**
 * Format a JS Date to a ISO string like yyyy-MM-ddThh:mm:ssZ
 * @param date - Date to format
 */
export function formatISODateStr(date: Date) {
  return date.toISOString().replace(/.\d+Z$/g, "Z");
}

/**
 * Format uptime in milliseconds to a string like "days hours" or "hours"
 * @param uptimeMs - Uptime in milliseconds
 */
export function formatUptime(uptimeMs: number): string {
  const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (days > 0) {
    return `${days}d ${remainingHours}h`;
  }
  return `${hours}h`;
}

export function formatDateAsDayMonth(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  });
}
