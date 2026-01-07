import { differenceInBusinessDays, format, formatDistanceToNow } from 'date-fns';

/**
 * Calculate business days between two dates (excludes weekends)
 */
export function calculateBusinessDays(startDate: Date, endDate: Date): number {
  return differenceInBusinessDays(endDate, startDate);
}

/**
 * Get business days since a date until now
 */
export function getBusinessDaysSince(date: Date): number {
  return calculateBusinessDays(date, new Date());
}

/**
 * Format a date in a human-readable way
 */
export function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Add business days to a date
 */
export function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let addedDays = 0;

  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      addedDays++;
    }
  }

  return result;
}
