/**
 * Main entry point for @rubixscript/react-native-pdf-report library
 * This provides proper module exports for Metro bundler
 */

// Export types for TypeScript users
export * from './types';

// The actual component export will be handled by Metro bundler
// which can resolve the .tsx file directly
export { default as PDFReportModal } from './components/Modals/PDFReportModal';