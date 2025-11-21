/**
 * @utils Validators
 * @description Validation functions for form inputs
 */

/**
 * Validate custom date range
 */
export const validateDateRange = (
  startDate?: Date,
  endDate?: Date
): { isValid: boolean; error?: string } => {
  if (!startDate || !endDate) {
    return {
      isValid: false,
      error: 'Please select both start and end dates for custom reports.',
    };
  }

  if (startDate > endDate) {
    return {
      isValid: false,
      error: 'Start date must be before end date.',
    };
  }

  return { isValid: true };
};

/**
 * Validate item selection
 */
export const validateItemSelection = (
  itemId?: string,
  itemLabel: string = 'item'
): { isValid: boolean; error?: string } => {
  if (!itemId) {
    return {
      isValid: false,
      error: `Please select a ${itemLabel.toLowerCase()} for the detailed report.`,
    };
  }

  return { isValid: true };
};
