/**
 * @hook useReportForm
 * @description Custom hook to manage report form state
 */

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { ReportType, ReportOptions, ReportLabels } from '../types';
import { DEFAULT_FORM_STATE } from '../utils/constants';
import { validateDateRange, validateItemSelection } from '../utils/validators';

interface UseReportFormProps {
  visible: boolean;
  labels: ReportLabels;
  onGenerateReport: (options: ReportOptions) => void;
  onClose: () => void;
}

export const useReportForm = ({
  visible,
  labels,
  onGenerateReport,
  onClose,
}: UseReportFormProps) => {
  // Report type selection
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('summary');

  // Customization options
  const [includeCharts, setIncludeCharts] = useState(DEFAULT_FORM_STATE.includeCharts);
  const [includeSessionDetails, setIncludeSessionDetails] = useState(
    DEFAULT_FORM_STATE.includeSessionDetails
  );
  const [includeItemDetails, setIncludeItemDetails] = useState(
    DEFAULT_FORM_STATE.includeItemDetails
  );
  const [includeAchievements, setIncludeAchievements] = useState(
    DEFAULT_FORM_STATE.includeAchievements
  );

  // Date range for custom reports
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();

  // Item selection for item-specific reports
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();

  // Custom title
  const [customTitle, setCustomTitle] = useState(DEFAULT_FORM_STATE.customTitle);

  // UI state
  const [generating, setGenerating] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (visible) {
      setSelectedReportType('summary');
      setIncludeCharts(DEFAULT_FORM_STATE.includeCharts);
      setIncludeSessionDetails(DEFAULT_FORM_STATE.includeSessionDetails);
      setIncludeItemDetails(DEFAULT_FORM_STATE.includeItemDetails);
      setIncludeAchievements(DEFAULT_FORM_STATE.includeAchievements);
      setCustomTitle(DEFAULT_FORM_STATE.customTitle);
      setSelectedItemId(undefined);
      setCustomStartDate(undefined);
      setCustomEndDate(undefined);
    }
  }, [visible]);

  // Handle report generation
  const handleGenerateReport = useCallback(async () => {
    try {
      // Validate selections
      if (selectedReportType === 'custom') {
        const validation = validateDateRange(customStartDate, customEndDate);
        if (!validation.isValid) {
          Alert.alert('Invalid Date Range', validation.error!);
          return;
        }
      }

      if (selectedReportType === 'item-details') {
        const validation = validateItemSelection(selectedItemId, labels.itemLabel);
        if (!validation.isValid) {
          Alert.alert('Missing Selection', validation.error!);
          return;
        }
      }

      setGenerating(true);

      // Prepare report options
      const reportOptions: ReportOptions = {
        type: selectedReportType,
        includeCharts,
        includeSessionDetails,
        includeItemDetails,
        includeAchievements,
        customTitle: customTitle || undefined,
        labels,
        ...(selectedReportType === 'custom' && {
          startDate: customStartDate,
          endDate: customEndDate,
        }),
        ...(selectedReportType === 'item-details' && {
          itemId: selectedItemId,
        }),
      };

      // Generate the report
      await onGenerateReport(reportOptions);

      setGenerating(false);
      onClose();
    } catch (error) {
      console.error('Error generating report:', error);
      setGenerating(false);
      Alert.alert(
        'Generation Failed',
        'There was an error generating your report. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }, [
    selectedReportType,
    customStartDate,
    customEndDate,
    selectedItemId,
    includeCharts,
    includeSessionDetails,
    includeItemDetails,
    includeAchievements,
    customTitle,
    labels,
    onGenerateReport,
    onClose,
  ]);

  return {
    // State
    selectedReportType,
    includeCharts,
    includeSessionDetails,
    includeItemDetails,
    includeAchievements,
    customStartDate,
    customEndDate,
    selectedItemId,
    customTitle,
    generating,
    showStartDatePicker,
    showEndDatePicker,

    // Setters
    setSelectedReportType,
    setIncludeCharts,
    setIncludeSessionDetails,
    setIncludeItemDetails,
    setIncludeAchievements,
    setCustomStartDate,
    setCustomEndDate,
    setSelectedItemId,
    setCustomTitle,
    setShowStartDatePicker,
    setShowEndDatePicker,

    // Handlers
    handleGenerateReport,
  };
};
