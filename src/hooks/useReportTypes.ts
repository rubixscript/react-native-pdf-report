/**
 * @hook useReportTypes
 * @description Custom hook to get report type configurations
 */

import { useMemo } from 'react';
import { ReportTypeConfig, ReportLabels, ReportType } from '../types';

interface UseReportTypesProps {
  customReportTypes?: ReportTypeConfig[];
  labels: ReportLabels;
}

export const useReportTypes = ({
  customReportTypes,
  labels,
}: UseReportTypesProps): ReportTypeConfig[] => {
  return useMemo(() => {
    if (customReportTypes) {
      return customReportTypes;
    }

    return [
      {
        type: 'summary' as ReportType,
        title: `📊 ${labels.summaryLabel} Report`,
        description: 'All-time statistics and achievements',
        icon: '📊',
      },
      {
        type: 'monthly' as ReportType,
        title: '📅 Monthly Report',
        description: 'Current month progress and statistics',
        icon: '📅',
      },
      {
        type: 'yearly' as ReportType,
        title: '📆 Yearly Report',
        description: 'Current year achievements and trends',
        icon: '📆',
      },
      {
        type: 'custom' as ReportType,
        title: '📋 Custom Range',
        description: 'Select your own date range for the report',
        icon: '📋',
      },
      {
        type: 'item-details' as ReportType,
        title: `📚 ${labels.itemLabel} Details`,
        description: `Detailed report for a specific ${labels.itemLabel?.toLowerCase()}`,
        icon: '📚',
      },
    ];
  }, [customReportTypes, labels]);
};
