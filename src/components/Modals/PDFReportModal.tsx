/**
 * @component PDFReportModal
 * @description A comprehensive modal component for customizing and generating PDF reading reports
 *
 * @props
 * - visible: boolean - Controls visibility of the modal
 * - onClose: () => void - Handler for closing the modal
 * - darkMode: boolean - Current dark mode state
 * - books: Book[] - Array of books for report generation
 * - readingSessions: ReadingSession[] - Array of reading sessions
 * - userName?: string - Optional user name for personalization
 * - onGenerateReport: (options: ReportOptions) => void - Handler for report generation
 *
 * @states
 * - selectedReportType: ReportType - Currently selected report type
 * - includeCharts: boolean - Whether to include charts in the report
 * - includeSessionDetails: boolean - Whether to include detailed session information
 * - includeBookDetails: boolean - Whether to include detailed book information
 * - includeAchievements: boolean - Whether to include achievements section
 * - selectedBookId?: string - Selected book for book-specific reports
 * - customStartDate?: Date - Start date for custom date range reports
 * - customEndDate?: Date - End date for custom date range reports
 * - customTitle: string - Custom title for the report
 * - generating: boolean - Loading state for report generation
 *
 * @features
 * - Multiple report types (summary, monthly, yearly, custom, book-specific)
 * - Advanced customization options for report content
 * - Date range selection for custom reports
 * - Book selection for detailed book reports
 * - Real-time preview of selected options
 * - Loading states and error handling
 * - Responsive design with touch-friendly controls
 *
 * @dependencies
 * - @expo/vector-icons: For comprehensive icon library
 * - react-native components: For UI elements and platform-specific features
 * - expo-linear-gradient: For gradient backgrounds and visual effects
 * - @react-native-community/datetimepicker: For date selection functionality
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Switch,
  Alert,
  Dimensions,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Book, ReadingSession, PDFReportModalProps, ReportType, ReportOptions } from '../../types';

const { width: screenWidth } = Dimensions.get('window');

const PDFReportModal: React.FC<PDFReportModalProps> = ({
  visible,
  onClose,
  darkMode,
  books,
  readingSessions,
  userName,
  onGenerateReport,
}) => {
  // Report type selection
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('summary');

  // Customization options
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeSessionDetails, setIncludeSessionDetails] = useState(false);
  const [includeBookDetails, setIncludeBookDetails] = useState(true);
  const [includeAchievements, setIncludeAchievements] = useState(true);

  // Date range for custom reports
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();

  // Book selection for book-specific reports
  const [selectedBookId, setSelectedBookId] = useState<string | undefined>();

  // Custom title
  const [customTitle, setCustomTitle] = useState('');

  // UI state
  const [generating, setGenerating] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (visible) {
      // Set sensible defaults
      setSelectedReportType('summary');
      setIncludeCharts(true);
      setIncludeSessionDetails(false);
      setIncludeBookDetails(true);
      setIncludeAchievements(true);
      setCustomTitle('');
      setSelectedBookId(undefined);
      setCustomStartDate(undefined);
      setCustomEndDate(undefined);
    }
  }, [visible]);

  // Get available report types with descriptions
  const getReportTypes = () => [
    {
      type: 'summary' as ReportType,
      title: '📊 Summary Report',
      description: 'All-time reading statistics and achievements',
    },
    {
      type: 'monthly' as ReportType,
      title: '📅 Monthly Report',
      description: 'Current month reading progress and statistics',
    },
    {
      type: 'yearly' as ReportType,
      title: '📆 Yearly Report',
      description: 'Current year reading achievements and trends',
    },
    {
      type: 'custom' as ReportType,
      title: '📋 Custom Range',
      description: 'Select your own date range for the report',
    },
    {
      type: 'book-details' as ReportType,
      title: '📚 Book Details',
      description: 'Detailed report for a specific book',
    },
  ];

  // Get books that have reading sessions
  const getBooksWithSessions = () => {
    return books.filter(book =>
      readingSessions.some(session => session.bookId === book.id)
    );
  };

  // Handle report generation
  const handleGenerateReport = async () => {
    try {
      // Validate selections
      if (selectedReportType === 'custom') {
        if (!customStartDate || !customEndDate) {
          Alert.alert('Missing Date Range', 'Please select both start and end dates for custom reports.');
          return;
        }
        if (customStartDate > customEndDate) {
          Alert.alert('Invalid Date Range', 'Start date must be before end date.');
          return;
        }
      }

      if (selectedReportType === 'book-details' && !selectedBookId) {
        Alert.alert('Missing Book Selection', 'Please select a book for the detailed report.');
        return;
      }

      setGenerating(true);

      // Prepare report options
      const reportOptions: ReportOptions = {
        type: selectedReportType,
        includeCharts,
        includeSessionDetails,
        includeBookDetails,
        includeAchievements,
        customTitle: customTitle || undefined,
        ...(selectedReportType === 'custom' && {
          startDate: customStartDate,
          endDate: customEndDate,
        }),
        ...(selectedReportType === 'book-details' && {
          bookId: selectedBookId,
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
  };

  // Date picker handlers
  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      setCustomStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      setCustomEndDate(selectedDate);
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const modalStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '90%',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
        },
        android: {
          elevation: 10,
        },
      }),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: darkMode ? '#333' : '#e0e0e0',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: darkMode ? '#ffffff' : '#000000',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 25,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: darkMode ? '#ffffff' : '#000000',
      marginBottom: 15,
    },
    reportTypeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 20,
    },
    reportTypeCard: {
      width: (screenWidth - 60) / 2,
      padding: 15,
      borderRadius: 12,
      borderWidth: 2,
      marginBottom: 10,
    },
    selectedReportType: {
      backgroundColor: '#007AFF',
      borderColor: '#007AFF',
    },
    unselectedReportType: {
      backgroundColor: darkMode ? '#2a2a2a' : '#f8f9fa',
      borderColor: darkMode ? '#444' : '#e0e0e0',
    },
    reportTypeTitle: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 5,
    },
    reportTypeDescription: {
      fontSize: 12,
      lineHeight: 16,
    },
    optionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: darkMode ? '#333' : '#f0f0f0',
    },
    optionLabel: {
      flex: 1,
      fontSize: 16,
      color: darkMode ? '#ffffff' : '#000000',
    },
    optionDescription: {
      fontSize: 12,
      color: darkMode ? '#aaa' : '#666',
      marginTop: 2,
    },
    dateInputContainer: {
      marginBottom: 15,
    },
    dateInput: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: darkMode ? '#444' : '#ddd',
      backgroundColor: darkMode ? '#2a2a2a' : '#f8f9fa',
    },
    dateText: {
      fontSize: 16,
      color: darkMode ? '#ffffff' : '#000000',
    },
    bookSelection: {
      marginBottom: 15,
    },
    bookOption: {
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: darkMode ? '#444' : '#ddd',
      marginBottom: 8,
      backgroundColor: darkMode ? '#2a2a2a' : '#f8f9fa',
    },
    selectedBook: {
      borderColor: '#007AFF',
      backgroundColor: '#007AFF20',
    },
    bookTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: darkMode ? '#ffffff' : '#000000',
      marginBottom: 2,
    },
    bookAuthor: {
      fontSize: 14,
      color: darkMode ? '#aaa' : '#666',
    },
    customInput: {
      padding: 15,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: darkMode ? '#444' : '#ddd',
      backgroundColor: darkMode ? '#2a2a2a' : '#ffffff',
      color: darkMode ? '#ffffff' : '#000000',
      fontSize: 16,
      marginBottom: 15,
    },
    footer: {
      flexDirection: 'row',
      padding: 20,
      gap: 15,
      borderTopWidth: 1,
      borderTopColor: darkMode ? '#333' : '#e0e0e0',
    },
    button: {
      flex: 1,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: darkMode ? '#333' : '#f0f0f0',
    },
    generateButton: {
      backgroundColor: '#007AFF',
    },
    disabledButton: {
      backgroundColor: darkMode ? '#222' : '#e0e0e0',
      opacity: 0.6,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: darkMode ? '#ffffff' : '#000000',
    },
    generateButtonText: {
      color: '#ffffff',
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[modalStyles.container, darkMode && { backgroundColor: '#000' }]}>
        <TouchableOpacity
          style={modalStyles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={modalStyles.modalContainer}>
          {/* Header */}
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>📄 Create OnePage Reading Report</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={darkMode ? '#ffffff' : '#000000'}
              />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={modalStyles.content} showsVerticalScrollIndicator={false}>
            {/* Report Type Selection */}
            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>Report Type</Text>
              <View style={modalStyles.reportTypeGrid}>
                {getReportTypes().map(({ type, title, description }) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      modalStyles.reportTypeCard,
                      selectedReportType === type
                        ? modalStyles.selectedReportType
                        : modalStyles.unselectedReportType
                    ]}
                    onPress={() => setSelectedReportType(type)}
                  >
                    <Text style={[
                      modalStyles.reportTypeTitle,
                      {
                        color: selectedReportType === type
                          ? '#ffffff'
                          : darkMode ? '#ffffff' : '#000000'
                      }
                    ]}>
                      {title}
                    </Text>
                    <Text style={[
                      modalStyles.reportTypeDescription,
                      {
                        color: selectedReportType === type
                          ? '#ffffff'
                          : darkMode ? '#aaa' : '#666'
                      }
                    ]}>
                      {description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Custom Date Range (for custom reports) */}
            {selectedReportType === 'custom' && (
              <View style={modalStyles.section}>
                <Text style={modalStyles.sectionTitle}>Date Range</Text>

                <View style={modalStyles.dateInputContainer}>
                  <Text style={[
                    { marginBottom: 8, fontSize: 14, fontWeight: '500' },
                    darkMode && { color: '#ffffff' }
                  ]}>
                    Start Date
                  </Text>
                  <TouchableOpacity
                    style={modalStyles.dateInput}
                    onPress={() => setShowStartDatePicker(true)}
                  >
                    <Text style={modalStyles.dateText}>
                      {customStartDate ? formatDate(customStartDate) : 'Select start date'}
                    </Text>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={darkMode ? '#ffffff' : '#000000'}
                    />
                  </TouchableOpacity>
                </View>

                <View style={modalStyles.dateInputContainer}>
                  <Text style={[
                    { marginBottom: 8, fontSize: 14, fontWeight: '500' },
                    darkMode && { color: '#ffffff' }
                  ]}>
                    End Date
                  </Text>
                  <TouchableOpacity
                    style={modalStyles.dateInput}
                    onPress={() => setShowEndDatePicker(true)}
                  >
                    <Text style={modalStyles.dateText}>
                      {customEndDate ? formatDate(customEndDate) : 'Select end date'}
                    </Text>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={darkMode ? '#ffffff' : '#000000'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Book Selection (for book-specific reports) */}
            {selectedReportType === 'book-details' && (
              <View style={modalStyles.section}>
                <Text style={modalStyles.sectionTitle}>Select Book</Text>
                <View style={modalStyles.bookSelection}>
                  {getBooksWithSessions().map((book) => (
                    <TouchableOpacity
                      key={book.id}
                      style={[
                        modalStyles.bookOption,
                        selectedBookId === book.id && modalStyles.selectedBook
                      ]}
                      onPress={() => setSelectedBookId(book.id)}
                    >
                      <Text style={modalStyles.bookTitle}>{book.title}</Text>
                      <Text style={modalStyles.bookAuthor}>by {book.author}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Custom Title */}
            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>Custom Title (Optional)</Text>
              <Text style={[
                { marginBottom: 8, fontSize: 14, color: darkMode ? '#aaa' : '#666' }
              ]}>
                Add a personalized title to your report
              </Text>
              <TextInput
                style={modalStyles.customInput}
                placeholder="Enter custom report title..."
                placeholderTextColor={darkMode ? '#888' : '#999'}
                value={customTitle}
                onChangeText={setCustomTitle}
              />
            </View>

            {/* Content Options */}
            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>Include in Report</Text>

              <View style={modalStyles.optionRow}>
                <View style={{ flex: 1 }}>
                  <Text style={modalStyles.optionLabel}>Charts & Graphs</Text>
                  <Text style={modalStyles.optionDescription}>
                    Visual representations of reading progress
                  </Text>
                </View>
                <Switch
                  value={includeCharts}
                  onValueChange={setIncludeCharts}
                  trackColor={{ false: darkMode ? '#444' : '#ddd', true: '#007AFF' }}
                  thumbColor={darkMode ? '#fff' : '#fff'}
                />
              </View>

              <View style={modalStyles.optionRow}>
                <View style={{ flex: 1 }}>
                  <Text style={modalStyles.optionLabel}>Session Details</Text>
                  <Text style={modalStyles.optionDescription}>
                    Individual reading session information
                  </Text>
                </View>
                <Switch
                  value={includeSessionDetails}
                  onValueChange={setIncludeSessionDetails}
                  trackColor={{ false: darkMode ? '#444' : '#ddd', true: '#007AFF' }}
                  thumbColor={darkMode ? '#fff' : '#fff'}
                />
              </View>

              <View style={modalStyles.optionRow}>
                <View style={{ flex: 1 }}>
                  <Text style={modalStyles.optionLabel}>Book Details</Text>
                  <Text style={modalStyles.optionDescription}>
                    Information about books in your library
                  </Text>
                </View>
                <Switch
                  value={includeBookDetails}
                  onValueChange={setIncludeBookDetails}
                  trackColor={{ false: darkMode ? '#444' : '#ddd', true: '#007AFF' }}
                  thumbColor={darkMode ? '#fff' : '#fff'}
                />
              </View>

              <View style={modalStyles.optionRow}>
                <View style={{ flex: 1 }}>
                  <Text style={modalStyles.optionLabel}>Achievements</Text>
                  <Text style={modalStyles.optionDescription}>
                    Reading milestones and accomplishments
                  </Text>
                </View>
                <Switch
                  value={includeAchievements}
                  onValueChange={setIncludeAchievements}
                  trackColor={{ false: darkMode ? '#444' : '#ddd', true: '#007AFF' }}
                  thumbColor={darkMode ? '#fff' : '#fff'}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={modalStyles.footer}>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.cancelButton]}
              onPress={onClose}
              disabled={generating}
            >
              <Text style={modalStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                modalStyles.button,
                modalStyles.generateButton,
                generating && modalStyles.disabledButton
              ]}
              onPress={handleGenerateReport}
              disabled={generating}
            >
              <Text style={modalStyles.generateButtonText}>
                {generating ? 'Generating...' : 'Generate Report'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={customStartDate || new Date()}
          mode="date"
          display="default"
          onChange={onStartDateChange}
          maximumDate={customEndDate || new Date()}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={customEndDate || new Date()}
          mode="date"
          display="default"
          onChange={onEndDateChange}
          minimumDate={customStartDate}
          maximumDate={new Date()}
        />
      )}
    </Modal>
  );
};

export default PDFReportModal;