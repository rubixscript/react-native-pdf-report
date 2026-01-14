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

import React, { useMemo, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  Text,
} from 'react-native';
import { DataItem, ActivitySession, PDFReportModalProps, ReportOptions } from '../../types';
import { useReportForm, useReportTypes } from '../../hooks';
import { DEFAULT_LABELS, DEFAULT_PRIMARY_COLOR } from '../../utils';
import { ReportTypeSelector } from '../ReportTypeSelector';
import { DateRangeSelector } from '../DateRangeSelector';
import { ItemSelector } from '../ItemSelector';
import { CustomTitleInput } from '../CustomTitleInput';
import { ReportOptionsToggles } from '../ReportOptions';
import { ModalHeader } from '../ModalHeader';
import { ModalFooter } from '../ModalFooter';
import { SuccessModal } from '../SuccessModal';

const PDFReportModal: React.FC<PDFReportModalProps> = ({
  visible,
  onClose,
  darkMode,
  data,
  sessions,
  userName,
  onGenerateReport,
  onShareReport,
  onDownloadReport,
  labels: customLabels,
  reportTypes: customReportTypes,
  primaryColor = DEFAULT_PRIMARY_COLOR,
  accentColor,
}) => {
  // State for success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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

  // Reset success modal state when main modal opens
  useMemo(() => {
    if (visible) {
      setShowSuccessModal(false);
    }
  }, [visible]);

  // Handle share from success modal
  const handleShare = useCallback(() => {
    const options: ReportOptions = {
      type: selectedReportType,
      includeCharts,
      includeSessionDetails,
      includeItemDetails,
      includeAchievements,
      startDate: customStartDate,
      endDate: customEndDate,
      itemId: selectedItemId,
      customTitle,
    };
    onShareReport?.(options);
    setShowSuccessModal(false);
  }, [
    selectedReportType,
    includeCharts,
    includeSessionDetails,
    includeItemDetails,
    includeAchievements,
    customStartDate,
    customEndDate,
    selectedItemId,
    customTitle,
    onShareReport,
  ]);

  // Handle download from success modal
  const handleDownload = useCallback(() => {
    const options: ReportOptions = {
      type: selectedReportType,
      includeCharts,
      includeSessionDetails,
      includeItemDetails,
      includeAchievements,
      startDate: customStartDate,
      endDate: customEndDate,
      itemId: selectedItemId,
      customTitle,
    };
    onDownloadReport?.(options);
    setShowSuccessModal(false);
  }, [
    selectedReportType,
    includeCharts,
    includeSessionDetails,
    includeItemDetails,
    includeAchievements,
    customStartDate,
    customEndDate,
    selectedItemId,
    customTitle,
    onDownloadReport,
  ]);

  // Handle generate - show success modal after report is generated
  const handleGenerate = useCallback(async () => {
    await handleGenerateReport();
    // Small delay to show success modal after main modal closes
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 300);
  }, [handleGenerateReport]);

  // Get report title for success modal
  const reportTitle = customTitle || `${selectedReportType} ${labels.reportTitle || 'Report'}`;

  return (
    <>
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

            {/* PDF Preview */}
            <View style={[styles.previewSection, darkMode && styles.previewSectionDark]}>
              <Text style={[styles.previewTitle, darkMode && styles.previewTitleDark]}>PDF Preview</Text>
              <View style={[styles.previewCard, darkMode && styles.previewCardDark]}>
                <View style={styles.previewHeader}>
                  <View style={[styles.previewIcon, { backgroundColor: primaryColor }]}>
                    <Text style={styles.previewIconText}>📄</Text>
                  </View>
                  <View style={styles.previewHeaderInfo}>
                    <Text style={[styles.previewReportTitle, darkMode && styles.previewReportTitleDark]}>
                      {customTitle || `${selectedReportType} ${labels.reportTitle || 'Report'}`}
                    </Text>
                    <Text style={[styles.previewReportSubtitle, darkMode && styles.previewReportSubtitleDark]}>
                      {data.length} {labels.itemLabelPlural || 'Items'} • {sessions.length} {labels.sessionLabelPlural || 'Sessions'}
                    </Text>
                  </View>
                </View>
                <View style={styles.previewContent}>
                  {includeCharts && (
                    <View style={styles.previewItem}>
                      <View style={[styles.previewBullet, { backgroundColor: primaryColor }]} />
                      <Text style={[styles.previewItemText, darkMode && styles.previewItemTextDark]}>Charts & Graphs</Text>
                    </View>
                  )}
                  {includeItemDetails && (
                    <View style={styles.previewItem}>
                      <View style={[styles.previewBullet, { backgroundColor: primaryColor }]} />
                      <Text style={[styles.previewItemText, darkMode && styles.previewItemTextDark]}>{labels.itemLabelPlural || 'Items'} Details</Text>
                    </View>
                  )}
                  {includeSessionDetails && (
                    <View style={styles.previewItem}>
                      <View style={[styles.previewBullet, { backgroundColor: primaryColor }]} />
                      <Text style={[styles.previewItemText, darkMode && styles.previewItemTextDark]}>{labels.sessionLabelPlural || 'Sessions'} Details</Text>
                    </View>
                  )}
                  {includeAchievements && (
                    <View style={styles.previewItem}>
                      <View style={[styles.previewBullet, { backgroundColor: primaryColor }]} />
                      <Text style={[styles.previewItemText, darkMode && styles.previewItemTextDark]}>Achievements & Milestones</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <ModalFooter
            onCancel={onClose}
            onGenerate={handleGenerate}
            generating={generating}
            darkMode={darkMode}
            primaryColor={primaryColor}
          />
        </View>
      </View>
    </Modal>

    {/* Success Modal */}
    <SuccessModal
      visible={showSuccessModal}
      onClose={() => setShowSuccessModal(false)}
      onShare={handleShare}
      onDownload={handleDownload}
      darkMode={darkMode}
      primaryColor={primaryColor}
      reportTitle={reportTitle}
    />
    </>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    minHeight: 200,
  },
  previewSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  previewSectionDark: {
    backgroundColor: 'transparent',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  previewTitleDark: {
    color: '#fff',
  },
  previewCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  previewCardDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#3a3a3a',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewIconText: {
    fontSize: 24,
  },
  previewHeaderInfo: {
    flex: 1,
  },
  previewReportTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  previewReportTitleDark: {
    color: '#fff',
  },
  previewReportSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  previewReportSubtitleDark: {
    color: '#999',
  },
  previewContent: {
    // gap: 10, // Not supported in older RN versions
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  previewItemText: {
    fontSize: 14,
    color: '#555',
  },
  previewItemTextDark: {
    color: '#aaa',
  },
});

export default PDFReportModal;
