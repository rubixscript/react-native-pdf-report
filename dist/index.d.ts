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
export { default as PDFReportModal } from './components/PDFReportModal';
export { ReportTypeSelector, DateRangeSelector, ItemSelector, CustomTitleInput, ReportOptionsToggles, ModalHeader, ModalFooter, SuccessModal, } from './components';
export { useReportForm, useReportTypes } from './hooks';
export { DEFAULT_LABELS, DEFAULT_PRIMARY_COLOR, DEFAULT_FORM_STATE, formatDate, formatDuration, formatCurrency, formatPercentage, validateDateRange, validateItemSelection, generatePDFHTML, downloadPDFReport, sharePDFReport, } from './utils';
export type { DataItem, ActivitySession, ReportLabels, ReportType, ReportTypeConfig, ReportOptions, PDFReportModalProps, Book, ReadingSession, } from './types';
