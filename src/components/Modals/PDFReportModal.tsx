/**
 * @component PDFReportModal
 * @description A comprehensive modal component for customizing and generating PDF reports
 * Supports any type of tracking app: reading, pomodoro, expense, skill tracking, etc.
 *
 * @props
 * - visible: boolean - Controls visibility of the modal
 * - onClose: () => void - Handler for closing the modal
 * - darkMode: boolean - Current dark mode state
 * - data: DataItem[] - Array of data items for report generation
 * - sessions: ActivitySession[] - Array of activity sessions
 * - userName?: string - Optional user name for personalization
 * - onGenerateReport: (options: ReportOptions) => void - Handler for report generation
 * - labels?: ReportLabels - Custom labels for UI text
 * - reportTypes?: ReportTypeConfig[] - Custom report type configurations
 * - primaryColor?: string - Custom primary color (default: #007AFF)
 * - accentColor?: string - Custom accent color
 *
 * @features
 * - Fully customizable for any tracking app type
 * - Multiple report types (summary, monthly, yearly, custom, item-specific)
 * - Advanced customization options for report content
 * - Modular architecture with reusable components
 * - Responsive design with touch-friendly controls
 * - Beautiful, modern UI with smooth animations
 */

import React, { useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { DataItem, ActivitySession, PDFReportModalProps } from '../../types';
import { useReportForm } from '../../hooks/useReportForm';
import { useReportTypes } from '../../hooks/useReportTypes';
import { DEFAULT_LABELS, DEFAULT_PRIMARY_COLOR } from '../../utils/constants';
import { ReportTypeSelector } from '../ReportTypeSelector/ReportTypeSelector';
import { DateRangeSelector } from '../DateRangeSelector/DateRangeSelector';
import { ItemSelector } from '../ItemSelector/ItemSelector';
import { CustomTitleInput } from '../CustomTitleInput/CustomTitleInput';
import { ReportOptionsToggles } from '../ReportOptions/ReportOptionsToggles';
import { ModalHeader } from '../ModalHeader/ModalHeader';
import { ModalFooter } from '../ModalFooter/ModalFooter';

const PDFReportModal: React.FC<PDFReportModalProps> = ({
  visible,
  onClose,
  darkMode,
  data,
  sessions,
  userName,
  onGenerateReport,
  labels: customLabels,
  reportTypes: customReportTypes,
  primaryColor = DEFAULT_PRIMARY_COLOR,
  accentColor,
}) => {
  // Merge custom labels with defaults
  const labels = useMemo(
    () => ({
      ...DEFAULT_LABELS,
      ...customLabels,
    }),
    [customLabels]
  );

  // Get report types configuration
  const reportTypes = useReportTypes({
    customReportTypes,
    labels,
  });

  // Use custom hook for form management
  const {
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
    handleGenerateReport,
  } = useReportForm({
    visible,
    labels,
    onGenerateReport,
    onClose,
  });

  // Get items that have sessions
  const itemsWithSessions = useMemo(
    () => data.filter((item) => sessions.some((session) => session.itemId === item.id)),
    [data, sessions]
  );

  // Date picker handlers
  const onStartDateChange = useCallback((event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      setCustomStartDate(selectedDate);
    }
  }, [setShowStartDatePicker, setCustomStartDate]);

  const onEndDateChange = useCallback((event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      setCustomEndDate(selectedDate);
    }
  }, [setShowEndDatePicker, setCustomEndDate]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />

        <View
          style={[
            styles.modalContainer,
            darkMode && styles.modalContainerDark,
          ]}
        >
          {/* Header */}
          <ModalHeader
            title={labels.reportTitle || 'Activity Report'}
            onClose={onClose}
            darkMode={darkMode}
          />

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Report Type Selection */}
            <ReportTypeSelector
              reportTypes={reportTypes}
              selectedType={selectedReportType}
              onSelectType={setSelectedReportType}
              darkMode={darkMode}
              primaryColor={primaryColor}
            />

            {/* Custom Date Range (for custom reports) */}
            {selectedReportType === 'custom' && (
              <DateRangeSelector
                startDate={customStartDate}
                endDate={customEndDate}
                onStartDateChange={onStartDateChange}
                onEndDateChange={onEndDateChange}
                showStartPicker={showStartDatePicker}
                showEndPicker={showEndDatePicker}
                setShowStartPicker={setShowStartDatePicker}
                setShowEndPicker={setShowEndDatePicker}
                darkMode={darkMode}
                primaryColor={primaryColor}
              />
            )}

            {/* Item Selection (for item-specific reports) */}
            {selectedReportType === 'item-details' && (
              <ItemSelector
                items={itemsWithSessions}
                selectedItemId={selectedItemId}
                onSelectItem={setSelectedItemId}
                itemLabel={labels.itemLabel || 'Item'}
                itemLabelPlural={labels.itemLabelPlural || 'Items'}
                darkMode={darkMode}
                primaryColor={primaryColor}
              />
            )}

            {/* Custom Title */}
            <CustomTitleInput
              value={customTitle}
              onChangeText={setCustomTitle}
              darkMode={darkMode}
            />

            {/* Content Options */}
            <ReportOptionsToggles
              includeCharts={includeCharts}
              includeSessionDetails={includeSessionDetails}
              includeItemDetails={includeItemDetails}
              includeAchievements={includeAchievements}
              onToggleCharts={setIncludeCharts}
              onToggleSessionDetails={setIncludeSessionDetails}
              onToggleItemDetails={setIncludeItemDetails}
              onToggleAchievements={setIncludeAchievements}
              labels={labels}
              darkMode={darkMode}
              primaryColor={primaryColor}
            />
          </ScrollView>

          {/* Footer */}
          <ModalFooter
            onCancel={onClose}
            onGenerate={handleGenerateReport}
            generating={generating}
            darkMode={darkMode}
            primaryColor={primaryColor}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  modalContainerDark: {
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

export default PDFReportModal;
