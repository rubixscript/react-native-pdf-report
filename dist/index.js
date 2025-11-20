'use strict';

var React = require('react');
var reactNative = require('react-native');
var vectorIcons = require('@expo/vector-icons');
var DateTimePicker = require('@react-native-community/datetimepicker');

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
const { width: screenWidth } = reactNative.Dimensions.get('window');
const PDFReportModal = ({ visible, onClose, darkMode, books, readingSessions, userName, onGenerateReport, }) => {
    // Report type selection
    const [selectedReportType, setSelectedReportType] = React.useState('summary');
    // Customization options
    const [includeCharts, setIncludeCharts] = React.useState(true);
    const [includeSessionDetails, setIncludeSessionDetails] = React.useState(false);
    const [includeBookDetails, setIncludeBookDetails] = React.useState(true);
    const [includeAchievements, setIncludeAchievements] = React.useState(true);
    // Date range for custom reports
    const [customStartDate, setCustomStartDate] = React.useState();
    const [customEndDate, setCustomEndDate] = React.useState();
    // Book selection for book-specific reports
    const [selectedBookId, setSelectedBookId] = React.useState();
    // Custom title
    const [customTitle, setCustomTitle] = React.useState('');
    // UI state
    const [generating, setGenerating] = React.useState(false);
    const [showStartDatePicker, setShowStartDatePicker] = React.useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = React.useState(false);
    // Reset form when modal opens/closes
    React.useEffect(() => {
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
            type: 'summary',
            title: '📊 Summary Report',
            description: 'All-time reading statistics and achievements',
        },
        {
            type: 'monthly',
            title: '📅 Monthly Report',
            description: 'Current month reading progress and statistics',
        },
        {
            type: 'yearly',
            title: '📆 Yearly Report',
            description: 'Current year reading achievements and trends',
        },
        {
            type: 'custom',
            title: '📋 Custom Range',
            description: 'Select your own date range for the report',
        },
        {
            type: 'book-details',
            title: '📚 Book Details',
            description: 'Detailed report for a specific book',
        },
    ];
    // Get books that have reading sessions
    const getBooksWithSessions = () => {
        return books.filter(book => readingSessions.some(session => session.bookId === book.id));
    };
    // Handle report generation
    const handleGenerateReport = async () => {
        try {
            // Validate selections
            if (selectedReportType === 'custom') {
                if (!customStartDate || !customEndDate) {
                    reactNative.Alert.alert('Missing Date Range', 'Please select both start and end dates for custom reports.');
                    return;
                }
                if (customStartDate > customEndDate) {
                    reactNative.Alert.alert('Invalid Date Range', 'Start date must be before end date.');
                    return;
                }
            }
            if (selectedReportType === 'book-details' && !selectedBookId) {
                reactNative.Alert.alert('Missing Book Selection', 'Please select a book for the detailed report.');
                return;
            }
            setGenerating(true);
            // Prepare report options
            const reportOptions = {
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
        }
        catch (error) {
            console.error('Error generating report:', error);
            setGenerating(false);
            reactNative.Alert.alert('Generation Failed', 'There was an error generating your report. Please try again.', [{ text: 'OK' }]);
        }
    };
    // Date picker handlers
    const onStartDateChange = (event, selectedDate) => {
        setShowStartDatePicker(false);
        if (event.type === 'set' && selectedDate) {
            setCustomStartDate(selectedDate);
        }
    };
    const onEndDateChange = (event, selectedDate) => {
        setShowEndDatePicker(false);
        if (event.type === 'set' && selectedDate) {
            setCustomEndDate(selectedDate);
        }
    };
    // Format date for display
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };
    const modalStyles = reactNative.StyleSheet.create({
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
            ...reactNative.Platform.select({
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
    return (React.createElement(reactNative.Modal, { visible: visible, animationType: "slide", presentationStyle: "pageSheet", onRequestClose: onClose },
        React.createElement(reactNative.View, { style: [modalStyles.container, darkMode && { backgroundColor: '#000' }] },
            React.createElement(reactNative.TouchableOpacity, { style: modalStyles.overlay, activeOpacity: 1, onPress: onClose }),
            React.createElement(reactNative.View, { style: modalStyles.modalContainer },
                React.createElement(reactNative.View, { style: modalStyles.header },
                    React.createElement(reactNative.Text, { style: modalStyles.title }, "\uD83D\uDCC4 Create RubixScript Reading Report"),
                    React.createElement(reactNative.TouchableOpacity, { onPress: onClose },
                        React.createElement(vectorIcons.Ionicons, { name: "close", size: 24, color: darkMode ? '#ffffff' : '#000000' }))),
                React.createElement(reactNative.ScrollView, { style: modalStyles.content, showsVerticalScrollIndicator: false },
                    React.createElement(reactNative.View, { style: modalStyles.section },
                        React.createElement(reactNative.Text, { style: modalStyles.sectionTitle }, "Report Type"),
                        React.createElement(reactNative.View, { style: modalStyles.reportTypeGrid }, getReportTypes().map(({ type, title, description }) => (React.createElement(reactNative.TouchableOpacity, { key: type, style: [
                                modalStyles.reportTypeCard,
                                selectedReportType === type
                                    ? modalStyles.selectedReportType
                                    : modalStyles.unselectedReportType
                            ], onPress: () => setSelectedReportType(type) },
                            React.createElement(reactNative.Text, { style: [
                                    modalStyles.reportTypeTitle,
                                    {
                                        color: selectedReportType === type
                                            ? '#ffffff'
                                            : darkMode ? '#ffffff' : '#000000'
                                    }
                                ] }, title),
                            React.createElement(reactNative.Text, { style: [
                                    modalStyles.reportTypeDescription,
                                    {
                                        color: selectedReportType === type
                                            ? '#ffffff'
                                            : darkMode ? '#aaa' : '#666'
                                    }
                                ] }, description)))))),
                    selectedReportType === 'custom' && (React.createElement(reactNative.View, { style: modalStyles.section },
                        React.createElement(reactNative.Text, { style: modalStyles.sectionTitle }, "Date Range"),
                        React.createElement(reactNative.View, { style: modalStyles.dateInputContainer },
                            React.createElement(reactNative.Text, { style: [
                                    { marginBottom: 8, fontSize: 14, fontWeight: '500' },
                                    darkMode && { color: '#ffffff' }
                                ] }, "Start Date"),
                            React.createElement(reactNative.TouchableOpacity, { style: modalStyles.dateInput, onPress: () => setShowStartDatePicker(true) },
                                React.createElement(reactNative.Text, { style: modalStyles.dateText }, customStartDate ? formatDate(customStartDate) : 'Select start date'),
                                React.createElement(vectorIcons.Ionicons, { name: "calendar-outline", size: 20, color: darkMode ? '#ffffff' : '#000000' }))),
                        React.createElement(reactNative.View, { style: modalStyles.dateInputContainer },
                            React.createElement(reactNative.Text, { style: [
                                    { marginBottom: 8, fontSize: 14, fontWeight: '500' },
                                    darkMode && { color: '#ffffff' }
                                ] }, "End Date"),
                            React.createElement(reactNative.TouchableOpacity, { style: modalStyles.dateInput, onPress: () => setShowEndDatePicker(true) },
                                React.createElement(reactNative.Text, { style: modalStyles.dateText }, customEndDate ? formatDate(customEndDate) : 'Select end date'),
                                React.createElement(vectorIcons.Ionicons, { name: "calendar-outline", size: 20, color: darkMode ? '#ffffff' : '#000000' }))))),
                    selectedReportType === 'book-details' && (React.createElement(reactNative.View, { style: modalStyles.section },
                        React.createElement(reactNative.Text, { style: modalStyles.sectionTitle }, "Select Book"),
                        React.createElement(reactNative.View, { style: modalStyles.bookSelection }, getBooksWithSessions().map((book) => (React.createElement(reactNative.TouchableOpacity, { key: book.id, style: [
                                modalStyles.bookOption,
                                selectedBookId === book.id && modalStyles.selectedBook
                            ], onPress: () => setSelectedBookId(book.id) },
                            React.createElement(reactNative.Text, { style: modalStyles.bookTitle }, book.title),
                            React.createElement(reactNative.Text, { style: modalStyles.bookAuthor },
                                "by ",
                                book.author))))))),
                    React.createElement(reactNative.View, { style: modalStyles.section },
                        React.createElement(reactNative.Text, { style: modalStyles.sectionTitle }, "Custom Title (Optional)"),
                        React.createElement(reactNative.Text, { style: [
                                { marginBottom: 8, fontSize: 14, color: darkMode ? '#aaa' : '#666' }
                            ] }, "Add a personalized title to your report"),
                        React.createElement(reactNative.TextInput, { style: modalStyles.customInput, placeholder: "Enter custom report title...", placeholderTextColor: darkMode ? '#888' : '#999', value: customTitle, onChangeText: setCustomTitle })),
                    React.createElement(reactNative.View, { style: modalStyles.section },
                        React.createElement(reactNative.Text, { style: modalStyles.sectionTitle }, "Include in Report"),
                        React.createElement(reactNative.View, { style: modalStyles.optionRow },
                            React.createElement(reactNative.View, { style: { flex: 1 } },
                                React.createElement(reactNative.Text, { style: modalStyles.optionLabel }, "Charts & Graphs"),
                                React.createElement(reactNative.Text, { style: modalStyles.optionDescription }, "Visual representations of reading progress")),
                            React.createElement(reactNative.Switch, { value: includeCharts, onValueChange: setIncludeCharts, trackColor: { false: darkMode ? '#444' : '#ddd', true: '#007AFF' }, thumbColor: darkMode ? '#fff' : '#fff' })),
                        React.createElement(reactNative.View, { style: modalStyles.optionRow },
                            React.createElement(reactNative.View, { style: { flex: 1 } },
                                React.createElement(reactNative.Text, { style: modalStyles.optionLabel }, "Session Details"),
                                React.createElement(reactNative.Text, { style: modalStyles.optionDescription }, "Individual reading session information")),
                            React.createElement(reactNative.Switch, { value: includeSessionDetails, onValueChange: setIncludeSessionDetails, trackColor: { false: darkMode ? '#444' : '#ddd', true: '#007AFF' }, thumbColor: darkMode ? '#fff' : '#fff' })),
                        React.createElement(reactNative.View, { style: modalStyles.optionRow },
                            React.createElement(reactNative.View, { style: { flex: 1 } },
                                React.createElement(reactNative.Text, { style: modalStyles.optionLabel }, "Book Details"),
                                React.createElement(reactNative.Text, { style: modalStyles.optionDescription }, "Information about books in your library")),
                            React.createElement(reactNative.Switch, { value: includeBookDetails, onValueChange: setIncludeBookDetails, trackColor: { false: darkMode ? '#444' : '#ddd', true: '#007AFF' }, thumbColor: darkMode ? '#fff' : '#fff' })),
                        React.createElement(reactNative.View, { style: modalStyles.optionRow },
                            React.createElement(reactNative.View, { style: { flex: 1 } },
                                React.createElement(reactNative.Text, { style: modalStyles.optionLabel }, "Achievements"),
                                React.createElement(reactNative.Text, { style: modalStyles.optionDescription }, "Reading milestones and accomplishments")),
                            React.createElement(reactNative.Switch, { value: includeAchievements, onValueChange: setIncludeAchievements, trackColor: { false: darkMode ? '#444' : '#ddd', true: '#007AFF' }, thumbColor: darkMode ? '#fff' : '#fff' })))),
                React.createElement(reactNative.View, { style: modalStyles.footer },
                    React.createElement(reactNative.TouchableOpacity, { style: [modalStyles.button, modalStyles.cancelButton], onPress: onClose, disabled: generating },
                        React.createElement(reactNative.Text, { style: modalStyles.cancelButtonText }, "Cancel")),
                    React.createElement(reactNative.TouchableOpacity, { style: [
                            modalStyles.button,
                            modalStyles.generateButton,
                            generating && modalStyles.disabledButton
                        ], onPress: handleGenerateReport, disabled: generating },
                        React.createElement(reactNative.Text, { style: modalStyles.generateButtonText }, generating ? 'Generating...' : 'Generate Report'))))),
        showStartDatePicker && (React.createElement(DateTimePicker, { value: customStartDate || new Date(), mode: "date", display: "default", onChange: onStartDateChange, maximumDate: customEndDate || new Date() })),
        showEndDatePicker && (React.createElement(DateTimePicker, { value: customEndDate || new Date(), mode: "date", display: "default", onChange: onEndDateChange, minimumDate: customStartDate, maximumDate: new Date() }))));
};

exports.PDFReportModal = PDFReportModal;
//# sourceMappingURL=index.js.map
