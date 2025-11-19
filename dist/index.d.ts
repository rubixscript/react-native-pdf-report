/**
 * React Native PDF Report Library
 *
 * Type definitions for the PDF report library.
 *
 * @author RubixScript Team
 * @version 1.0.0
 */

// Export main component types
export { default as PDFReportModal } from './src/components/Modals/PDFReportModal';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUri?: string;
  totalPages: number;
  currentPage: number;
  startDate?: Date | string;
  completedDate?: Date | string | null;
  notes?: string[];
  category?: string;
  color?: string;
  lastReadText?: string;
  isPinned?: boolean;
  notificationTriggered?: boolean;
}

export interface ReadingSession {
  id: string;
  bookId: string;
  date: Date | string;
  startPage: number;
  endPage: number;
  duration: number;
  notes?: string;
  imageUrl?: string | null;
  ocrText?: string | null;
}

export type ReportType = 'monthly' | 'yearly' | 'custom' | 'summary' | 'book-details';

export interface ReportOptions {
  type: ReportType;
  startDate?: Date;
  endDate?: Date;
  includeCharts?: boolean;
  includeSessionDetails?: boolean;
  includeBookDetails?: boolean;
  includeAchievements?: boolean;
  bookId?: string;
  customTitle?: string;
}

export interface PDFReportModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
  books: Book[];
  readingSessions: ReadingSession[];
  userName?: string;
  onGenerateReport: (options: ReportOptions) => void;
}