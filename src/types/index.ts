/**
 * @types PDF Report Library
 * @description TypeScript type definitions for generic PDF report generation
 */

/**
 * Generic data item that can represent anything trackable
 * (books, tasks, expenses, skills, pomodoro sessions, etc.)
 */
export interface DataItem {
  id: string;
  title: string;
  subtitle?: string; // e.g., author for books, category for expenses
  imageUri?: string;
  progress?: number; // 0-100 for generic progress
  total?: number; // total units (pages, tasks, hours, etc.)
  current?: number; // current units completed
  startDate?: Date | string;
  completedDate?: Date | string | null;
  notes?: string[];
  category?: string;
  color?: string;
  metadata?: Record<string, any>; // flexible field for app-specific data
  isPinned?: boolean;
  [key: string]: any; // allow additional custom fields
}

/**
 * Generic activity session for tracking any type of activity
 * (reading sessions, work sessions, expenses, practice sessions, etc.)
 */
export interface ActivitySession {
  id: string;
  itemId: string; // reference to DataItem
  date: Date | string;
  startValue?: number; // e.g., start page, start time
  endValue?: number; // e.g., end page, end time
  duration?: number; // duration in minutes
  value?: number; // for tracking amounts (expense amount, skill points, etc.)
  notes?: string;
  imageUrl?: string | null;
  metadata?: Record<string, any>; // flexible field for app-specific data
  [key: string]: any; // allow additional custom fields
}

/**
 * Configuration for customizing report labels and terminology
 */
export interface ReportLabels {
  // Main entities
  itemLabel?: string; // e.g., "Book", "Task", "Expense", "Skill"
  itemLabelPlural?: string; // e.g., "Books", "Tasks", "Expenses", "Skills"
  sessionLabel?: string; // e.g., "Reading Session", "Work Session", "Transaction"
  sessionLabelPlural?: string; // e.g., "Reading Sessions", "Work Sessions", "Transactions"

  // Report titles
  reportTitle?: string; // e.g., "Reading Report", "Productivity Report", "Expense Report"
  summaryLabel?: string; // e.g., "Reading Summary", "Work Summary", "Financial Summary"

  // Metrics
  progressLabel?: string; // e.g., "Pages Read", "Tasks Completed", "Amount Spent"
  durationLabel?: string; // e.g., "Reading Time", "Work Time", "Study Time"
  totalLabel?: string; // e.g., "Total Books", "Total Tasks", "Total Expenses"
}

export type ReportType = 'monthly' | 'yearly' | 'custom' | 'summary' | 'item-details';

/**
 * Configuration for report type with custom labels
 */
export interface ReportTypeConfig {
  type: ReportType;
  title: string;
  description: string;
  icon?: string;
}

export interface ReportOptions {
  type: ReportType;
  startDate?: Date;
  endDate?: Date;
  includeCharts?: boolean;
  includeSessionDetails?: boolean;
  includeItemDetails?: boolean;
  includeAchievements?: boolean;
  itemId?: string;
  customTitle?: string;
  labels?: ReportLabels; // custom labels for this report
}

export interface PDFReportModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
  data: DataItem[]; // generic data items
  sessions: ActivitySession[]; // generic activity sessions
  userName?: string;
  onGenerateReport: (options: ReportOptions) => void;
  labels?: ReportLabels; // custom labels for the UI
  reportTypes?: ReportTypeConfig[]; // custom report type configurations
  primaryColor?: string; // customizable primary color
  accentColor?: string; // customizable accent color
}

// Legacy type aliases for backward compatibility
/** @deprecated Use DataItem instead */
export type Book = DataItem;
/** @deprecated Use ActivitySession instead */
export type ReadingSession = ActivitySession;