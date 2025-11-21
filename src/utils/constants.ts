/**
 * @utils Constants
 * @description Shared constants and default values
 */

import { ReportLabels } from '../types';

/**
 * Default labels for the report UI
 */
export const DEFAULT_LABELS: ReportLabels = {
  itemLabel: 'Item',
  itemLabelPlural: 'Items',
  sessionLabel: 'Session',
  sessionLabelPlural: 'Sessions',
  reportTitle: 'Activity Report',
  summaryLabel: 'Summary',
  progressLabel: 'Progress',
  durationLabel: 'Duration',
  totalLabel: 'Total',
};

/**
 * Default primary color
 */
export const DEFAULT_PRIMARY_COLOR = '#007AFF';

/**
 * Default form state values
 */
export const DEFAULT_FORM_STATE = {
  includeCharts: true,
  includeSessionDetails: false,
  includeItemDetails: true,
  includeAchievements: true,
  customTitle: '',
};
