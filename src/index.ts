/**
 * @main PDF Report Library
 * @description Main entry point for the versatile PDF report library
 * Supports any tracking app: reading, pomodoro, expenses, skills, habits, and more
 *
 * @architecture Modular
 * - 9 reusable components
 * - 2 custom hooks
 * - Utility functions (formatters, validators, constants)
 * - Full TypeScript support
 */

// ============================================================================
// Main Component Export
// ============================================================================
export { default as PDFReportModal } from './components/PDFReportModal';

// ============================================================================
// Modular Components Export
// ============================================================================
export {
  ReportTypeSelector,
  DateRangeSelector,
  ItemSelector,
  CustomTitleInput,
  ReportOptionsToggles,
  ModalHeader,
  ModalFooter,
  SuccessModal,
} from './components';

// ============================================================================
// Custom Hooks Export
// ============================================================================
export { useReportForm, useReportTypes } from './hooks';

// ============================================================================
// Utilities Export
// ============================================================================
export {
  // Constants
  DEFAULT_LABELS,
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_FORM_STATE,
  // Formatters
  formatDate,
  formatDuration,
  formatCurrency,
  formatPercentage,
  // Validators
  validateDateRange,
  validateItemSelection,
  // PDF Generator
  generatePDFHTML,
  downloadPDFReport,
  sharePDFReport,
} from './utils';

// ============================================================================
// TypeScript Types Export
// ============================================================================
export type {
  // Main types
  DataItem,
  ActivitySession,
  ReportLabels,
  ReportType,
  ReportTypeConfig,
  ReportOptions,
  PDFReportModalProps,
  // Legacy types for backward compatibility
  Book,
  ReadingSession,
} from './types';
