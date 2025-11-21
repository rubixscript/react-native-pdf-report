'use strict';

var React = require('react');
var reactNative = require('react-native');
var vectorIcons = require('@expo/vector-icons');
var DateTimePicker = require('@react-native-community/datetimepicker');

/**
 * @utils Constants
 * @description Shared constants and default values
 */
/**
 * Default labels for the report UI
 */
const DEFAULT_LABELS = {
    itemLabel: 'Item',
    itemLabelPlural: 'Items',
    sessionLabel: 'Session',
    sessionLabelPlural: 'Sessions',
    reportTitle: 'Activity Report',
    summaryLabel: 'Summary',
    progressLabel: 'Progress',
    durationLabel: 'Duration',
    totalLabel: 'Total',
};
/**
 * Default primary color
 */
const DEFAULT_PRIMARY_COLOR = '#007AFF';
/**
 * Default form state values
 */
const DEFAULT_FORM_STATE = {
    includeCharts: true,
    includeSessionDetails: false,
    includeItemDetails: true,
    includeAchievements: true,
    customTitle: '',
};

/**
 * @utils Validators
 * @description Validation functions for form inputs
 */
/**
 * Validate custom date range
 */
const validateDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) {
        return {
            isValid: false,
            error: 'Please select both start and end dates for custom reports.',
        };
    }
    if (startDate > endDate) {
        return {
            isValid: false,
            error: 'Start date must be before end date.',
        };
    }
    return { isValid: true };
};
/**
 * Validate item selection
 */
const validateItemSelection = (itemId, itemLabel = 'item') => {
    if (!itemId) {
        return {
            isValid: false,
            error: `Please select a ${itemLabel.toLowerCase()} for the detailed report.`,
        };
    }
    return { isValid: true };
};

/**
 * @hook useReportForm
 * @description Custom hook to manage report form state
 */
const useReportForm = ({ visible, labels, onGenerateReport, onClose, }) => {
    // Report type selection
    const [selectedReportType, setSelectedReportType] = React.useState('summary');
    // Customization options
    const [includeCharts, setIncludeCharts] = React.useState(DEFAULT_FORM_STATE.includeCharts);
    const [includeSessionDetails, setIncludeSessionDetails] = React.useState(DEFAULT_FORM_STATE.includeSessionDetails);
    const [includeItemDetails, setIncludeItemDetails] = React.useState(DEFAULT_FORM_STATE.includeItemDetails);
    const [includeAchievements, setIncludeAchievements] = React.useState(DEFAULT_FORM_STATE.includeAchievements);
    // Date range for custom reports
    const [customStartDate, setCustomStartDate] = React.useState();
    const [customEndDate, setCustomEndDate] = React.useState();
    // Item selection for item-specific reports
    const [selectedItemId, setSelectedItemId] = React.useState();
    // Custom title
    const [customTitle, setCustomTitle] = React.useState(DEFAULT_FORM_STATE.customTitle);
    // UI state
    const [generating, setGenerating] = React.useState(false);
    const [showStartDatePicker, setShowStartDatePicker] = React.useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = React.useState(false);
    // Reset form when modal opens/closes
    React.useEffect(() => {
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
    const handleGenerateReport = React.useCallback(async () => {
        try {
            // Validate selections
            if (selectedReportType === 'custom') {
                const validation = validateDateRange(customStartDate, customEndDate);
                if (!validation.isValid) {
                    reactNative.Alert.alert('Invalid Date Range', validation.error);
                    return;
                }
            }
            if (selectedReportType === 'item-details') {
                const validation = validateItemSelection(selectedItemId, labels.itemLabel);
                if (!validation.isValid) {
                    reactNative.Alert.alert('Missing Selection', validation.error);
                    return;
                }
            }
            setGenerating(true);
            // Prepare report options
            const reportOptions = {
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
        }
        catch (error) {
            console.error('Error generating report:', error);
            setGenerating(false);
            reactNative.Alert.alert('Generation Failed', 'There was an error generating your report. Please try again.', [{ text: 'OK' }]);
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

/**
 * @hook useReportTypes
 * @description Custom hook to get report type configurations
 */
const useReportTypes = ({ customReportTypes, labels, }) => {
    return React.useMemo(() => {
        if (customReportTypes) {
            return customReportTypes;
        }
        return [
            {
                type: 'summary',
                title: `📊 ${labels.summaryLabel} Report`,
                description: 'All-time statistics and achievements',
                icon: '📊',
            },
            {
                type: 'monthly',
                title: '📅 Monthly Report',
                description: 'Current month progress and statistics',
                icon: '📅',
            },
            {
                type: 'yearly',
                title: '📆 Yearly Report',
                description: 'Current year achievements and trends',
                icon: '📆',
            },
            {
                type: 'custom',
                title: '📋 Custom Range',
                description: 'Select your own date range for the report',
                icon: '📋',
            },
            {
                type: 'item-details',
                title: `📚 ${labels.itemLabel} Details`,
                description: `Detailed report for a specific ${labels.itemLabel?.toLowerCase()}`,
                icon: '📚',
            },
        ];
    }, [customReportTypes, labels]);
};

/**
 * @component ReportTypeSelector
 * @description Component for selecting report type
 */
const ReportTypeSelector = ({ reportTypes, selectedType, onSelectType, darkMode, primaryColor, }) => {
    return (React.createElement(reactNative.View, { style: styles$7.section },
        React.createElement(reactNative.Text, { style: [styles$7.sectionTitle, darkMode && styles$7.darkText] }, "Report Type"),
        React.createElement(reactNative.View, { style: styles$7.reportTypeGrid }, reportTypes.map(({ type, title, description, icon }) => (React.createElement(reactNative.TouchableOpacity, { key: type, style: [
                styles$7.reportTypeCard,
                selectedType === type
                    ? { ...styles$7.selectedReportType, borderColor: primaryColor, backgroundColor: `${primaryColor}20` }
                    : darkMode
                        ? styles$7.unselectedReportTypeDark
                        : styles$7.unselectedReportTypeLight
            ], onPress: () => onSelectType(type), activeOpacity: 0.7 },
            React.createElement(reactNative.View, { style: styles$7.reportTypeContent },
                icon && React.createElement(reactNative.Text, { style: styles$7.reportTypeIcon }, icon),
                React.createElement(reactNative.View, { style: styles$7.reportTypeTextContainer },
                    React.createElement(reactNative.Text, { style: [
                            styles$7.reportTypeTitle,
                            {
                                color: selectedType === type
                                    ? primaryColor
                                    : darkMode
                                        ? '#ffffff'
                                        : '#000000',
                            },
                        ] }, title),
                    React.createElement(reactNative.Text, { style: [
                            styles$7.reportTypeDescription,
                            {
                                color: selectedType === type
                                    ? darkMode
                                        ? '#ddd'
                                        : '#333'
                                    : darkMode
                                        ? '#aaa'
                                        : '#666',
                            },
                        ] }, description)))))))));
};
const styles$7 = reactNative.StyleSheet.create({
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 16,
        letterSpacing: 0.2,
    },
    darkText: {
        color: '#ffffff',
    },
    reportTypeGrid: {
        gap: 12,
    },
    reportTypeCard: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        marginBottom: 12,
        minHeight: 80,
        justifyContent: 'center',
    },
    selectedReportType: {
        borderColor: '#007AFF',
        backgroundColor: '#007AFF20',
    },
    unselectedReportTypeDark: {
        backgroundColor: '#2a2a2a',
        borderColor: '#3a3a3a',
    },
    unselectedReportTypeLight: {
        backgroundColor: '#f8f9fa',
        borderColor: '#e8e8e8',
    },
    reportTypeContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reportTypeIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    reportTypeTextContainer: {
        flex: 1,
    },
    reportTypeTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
        letterSpacing: 0.1,
    },
    reportTypeDescription: {
        fontSize: 13,
        lineHeight: 18,
        opacity: 0.8,
    },
});

/**
 * @utils Formatters
 * @description Utility functions for formatting data
 */
/**
 * Format date for display
 */
const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};
/**
 * Format time duration in minutes to readable string
 */
const formatDuration = (minutes) => {
    if (minutes < 60) {
        return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};
/**
 * Format currency value
 */
const formatCurrency = (value, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(value);
};
/**
 * Format percentage
 */
const formatPercentage = (value) => {
    return `${Math.round(value)}%`;
};

/**
 * @component DateRangeSelector
 * @description Component for selecting custom date range
 */
const DateRangeSelector = ({ startDate, endDate, onStartDateChange, onEndDateChange, showStartPicker, showEndPicker, setShowStartPicker, setShowEndPicker, darkMode, primaryColor, }) => {
    return (React.createElement(reactNative.View, { style: styles$6.section },
        React.createElement(reactNative.Text, { style: [styles$6.sectionTitle, darkMode && styles$6.darkText] }, "Date Range"),
        React.createElement(reactNative.View, { style: styles$6.dateInputContainer },
            React.createElement(reactNative.Text, { style: [styles$6.dateLabel, darkMode && styles$6.darkText] }, "Start Date"),
            React.createElement(reactNative.TouchableOpacity, { style: [
                    styles$6.dateInput,
                    darkMode ? styles$6.dateInputDark : styles$6.dateInputLight,
                ], onPress: () => setShowStartPicker(true), activeOpacity: 0.7 },
                React.createElement(reactNative.Text, { style: [
                        styles$6.dateText,
                        darkMode && styles$6.darkText,
                        !startDate && styles$6.dateTextPlaceholder,
                    ] }, startDate ? formatDate(startDate) : 'Select start date'),
                React.createElement(vectorIcons.Ionicons, { name: "calendar-outline", size: 22, color: primaryColor }))),
        React.createElement(reactNative.View, { style: styles$6.dateInputContainer },
            React.createElement(reactNative.Text, { style: [styles$6.dateLabel, darkMode && styles$6.darkText] }, "End Date"),
            React.createElement(reactNative.TouchableOpacity, { style: [
                    styles$6.dateInput,
                    darkMode ? styles$6.dateInputDark : styles$6.dateInputLight,
                ], onPress: () => setShowEndPicker(true), activeOpacity: 0.7 },
                React.createElement(reactNative.Text, { style: [
                        styles$6.dateText,
                        darkMode && styles$6.darkText,
                        !endDate && styles$6.dateTextPlaceholder,
                    ] }, endDate ? formatDate(endDate) : 'Select end date'),
                React.createElement(vectorIcons.Ionicons, { name: "calendar-outline", size: 22, color: primaryColor }))),
        showStartPicker && (React.createElement(DateTimePicker, { value: startDate || new Date(), mode: "date", display: "default", onChange: onStartDateChange, maximumDate: endDate || new Date() })),
        showEndPicker && (React.createElement(DateTimePicker, { value: endDate || new Date(), mode: "date", display: "default", onChange: onEndDateChange, minimumDate: startDate, maximumDate: new Date() }))));
};
const styles$6 = reactNative.StyleSheet.create({
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 16,
        letterSpacing: 0.2,
    },
    darkText: {
        color: '#ffffff',
    },
    dateInputContainer: {
        marginBottom: 16,
    },
    dateLabel: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 10,
        color: '#000000',
    },
    dateInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1.5,
    },
    dateInputDark: {
        borderColor: '#3a3a3a',
        backgroundColor: '#2a2a2a',
    },
    dateInputLight: {
        borderColor: '#e0e0e0',
        backgroundColor: '#f8f9fa',
    },
    dateText: {
        fontSize: 16,
        color: '#000000',
        fontWeight: '500',
    },
    dateTextPlaceholder: {
        color: '#999',
        opacity: 0.6,
    },
});

/**
 * @component ItemSelector
 * @description Component for selecting an item for detailed report
 */
const ItemSelector = ({ items, selectedItemId, onSelectItem, itemLabel, itemLabelPlural, darkMode, primaryColor, }) => {
    return (React.createElement(reactNative.View, { style: styles$5.section },
        React.createElement(reactNative.Text, { style: [styles$5.sectionTitle, darkMode && styles$5.darkText] },
            "Select ",
            itemLabel),
        React.createElement(reactNative.View, { style: styles$5.itemSelection },
            items.map((item) => (React.createElement(reactNative.TouchableOpacity, { key: item.id, style: [
                    styles$5.itemOption,
                    darkMode ? styles$5.itemOptionDark : styles$5.itemOptionLight,
                    selectedItemId === item.id && {
                        ...styles$5.selectedItem,
                        borderColor: primaryColor,
                        backgroundColor: `${primaryColor}15`,
                    },
                ], onPress: () => onSelectItem(item.id), activeOpacity: 0.7 },
                React.createElement(reactNative.Text, { style: [styles$5.itemTitle, darkMode && styles$5.darkText] }, item.title),
                item.subtitle && (React.createElement(reactNative.Text, { style: [styles$5.itemSubtitle, darkMode && styles$5.darkSubtitleText] }, item.subtitle))))),
            items.length === 0 && (React.createElement(reactNative.Text, { style: [
                    styles$5.itemSubtitle,
                    darkMode && styles$5.darkSubtitleText,
                    styles$5.emptyText,
                ] },
                "No ",
                itemLabelPlural.toLowerCase(),
                " with sessions found")))));
};
const styles$5 = reactNative.StyleSheet.create({
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 16,
        letterSpacing: 0.2,
    },
    darkText: {
        color: '#ffffff',
    },
    darkSubtitleText: {
        color: '#aaa',
    },
    itemSelection: {
        gap: 10,
    },
    itemOption: {
        padding: 14,
        borderRadius: 12,
        borderWidth: 1.5,
    },
    itemOptionDark: {
        backgroundColor: '#2a2a2a',
        borderColor: '#3a3a3a',
    },
    itemOptionLight: {
        backgroundColor: '#f8f9fa',
        borderColor: '#e0e0e0',
    },
    selectedItem: {
        borderColor: '#007AFF',
        backgroundColor: '#007AFF15',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    itemSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
    },
});

/**
 * @component CustomTitleInput
 * @description Component for entering custom report title
 */
const CustomTitleInput = ({ value, onChangeText, darkMode, }) => {
    return (React.createElement(reactNative.View, { style: styles$4.section },
        React.createElement(reactNative.Text, { style: [styles$4.sectionTitle, darkMode && styles$4.darkText] }, "Custom Title (Optional)"),
        React.createElement(reactNative.Text, { style: [
                styles$4.optionDescription,
                darkMode && styles$4.darkDescriptionText,
                styles$4.descriptionSpacing,
            ] }, "Add a personalized title to your report"),
        React.createElement(reactNative.TextInput, { style: [
                styles$4.customInput,
                darkMode ? styles$4.customInputDark : styles$4.customInputLight,
            ], placeholder: "Enter custom report title...", placeholderTextColor: darkMode ? '#666' : '#999', value: value, onChangeText: onChangeText })));
};
const styles$4 = reactNative.StyleSheet.create({
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 16,
        letterSpacing: 0.2,
    },
    darkText: {
        color: '#ffffff',
    },
    darkDescriptionText: {
        color: '#aaa',
    },
    optionDescription: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    descriptionSpacing: {
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    customInput: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1.5,
        fontSize: 16,
        fontWeight: '500',
    },
    customInputDark: {
        borderColor: '#3a3a3a',
        backgroundColor: '#2a2a2a',
        color: '#ffffff',
    },
    customInputLight: {
        borderColor: '#e0e0e0',
        backgroundColor: '#ffffff',
        color: '#000000',
    },
});

/**
 * @component ReportOptionsToggles
 * @description Component for toggling report content options
 */
const ReportOptionsToggles = ({ includeCharts, includeSessionDetails, includeItemDetails, includeAchievements, onToggleCharts, onToggleSessionDetails, onToggleItemDetails, onToggleAchievements, labels, darkMode, primaryColor, }) => {
    const trackColor = {
        false: darkMode ? '#3a3a3a' : '#ddd',
        true: primaryColor,
    };
    return (React.createElement(reactNative.View, { style: styles$3.section },
        React.createElement(reactNative.Text, { style: [styles$3.sectionTitle, darkMode && styles$3.darkText] }, "Include in Report"),
        React.createElement(reactNative.View, { style: [styles$3.optionRow, darkMode && styles$3.optionRowDark] },
            React.createElement(reactNative.View, { style: styles$3.optionContent },
                React.createElement(reactNative.Text, { style: [styles$3.optionLabel, darkMode && styles$3.darkText] }, "\uD83D\uDCCA Charts & Graphs"),
                React.createElement(reactNative.Text, { style: [styles$3.optionDescription, darkMode && styles$3.darkDescriptionText] }, "Visual representations of progress and trends")),
            React.createElement(reactNative.Switch, { value: includeCharts, onValueChange: onToggleCharts, trackColor: trackColor, thumbColor: "#fff", ios_backgroundColor: trackColor.false })),
        React.createElement(reactNative.View, { style: [styles$3.optionRow, darkMode && styles$3.optionRowDark] },
            React.createElement(reactNative.View, { style: styles$3.optionContent },
                React.createElement(reactNative.Text, { style: [styles$3.optionLabel, darkMode && styles$3.darkText] },
                    "\uD83D\uDCDD ",
                    labels.sessionLabel,
                    " Details"),
                React.createElement(reactNative.Text, { style: [styles$3.optionDescription, darkMode && styles$3.darkDescriptionText] },
                    "Individual ",
                    labels.sessionLabel?.toLowerCase(),
                    " information")),
            React.createElement(reactNative.Switch, { value: includeSessionDetails, onValueChange: onToggleSessionDetails, trackColor: trackColor, thumbColor: "#fff", ios_backgroundColor: trackColor.false })),
        React.createElement(reactNative.View, { style: [styles$3.optionRow, darkMode && styles$3.optionRowDark] },
            React.createElement(reactNative.View, { style: styles$3.optionContent },
                React.createElement(reactNative.Text, { style: [styles$3.optionLabel, darkMode && styles$3.darkText] },
                    "\uD83D\uDCDA ",
                    labels.itemLabel,
                    " Details"),
                React.createElement(reactNative.Text, { style: [styles$3.optionDescription, darkMode && styles$3.darkDescriptionText] },
                    "Information about ",
                    labels.itemLabelPlural?.toLowerCase())),
            React.createElement(reactNative.Switch, { value: includeItemDetails, onValueChange: onToggleItemDetails, trackColor: trackColor, thumbColor: "#fff", ios_backgroundColor: trackColor.false })),
        React.createElement(reactNative.View, { style: [styles$3.optionRow, darkMode && styles$3.optionRowDark] },
            React.createElement(reactNative.View, { style: styles$3.optionContent },
                React.createElement(reactNative.Text, { style: [styles$3.optionLabel, darkMode && styles$3.darkText] }, "\uD83C\uDFC6 Achievements"),
                React.createElement(reactNative.Text, { style: [styles$3.optionDescription, darkMode && styles$3.darkDescriptionText] }, "Milestones and accomplishments")),
            React.createElement(reactNative.Switch, { value: includeAchievements, onValueChange: onToggleAchievements, trackColor: trackColor, thumbColor: "#fff", ios_backgroundColor: trackColor.false }))));
};
const styles$3 = reactNative.StyleSheet.create({
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 16,
        letterSpacing: 0.2,
    },
    darkText: {
        color: '#ffffff',
    },
    darkDescriptionText: {
        color: '#aaa',
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 10,
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
    },
    optionRowDark: {
        backgroundColor: '#2a2a2a',
    },
    optionContent: {
        flex: 1,
        marginRight: 12,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
});

/**
 * @component ModalHeader
 * @description Modal header with title and close button
 */
const ModalHeader = ({ title, onClose, darkMode, }) => {
    return (React.createElement(reactNative.View, { style: [styles$2.header, darkMode && styles$2.headerDark] },
        React.createElement(reactNative.Text, { style: [styles$2.title, darkMode && styles$2.darkText] },
            "\uD83D\uDCC4 ",
            title),
        React.createElement(reactNative.TouchableOpacity, { style: [styles$2.closeButton, darkMode && styles$2.closeButtonDark], onPress: onClose },
            React.createElement(vectorIcons.Ionicons, { name: "close", size: 22, color: darkMode ? '#ffffff' : '#000000' }))));
};
const styles$2 = reactNative.StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerDark: {
        borderBottomColor: '#333',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000000',
        letterSpacing: 0.3,
    },
    darkText: {
        color: '#ffffff',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonDark: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
});

/**
 * @component ModalFooter
 * @description Modal footer with action buttons
 */
const ModalFooter = ({ onCancel, onGenerate, generating, darkMode, primaryColor, }) => {
    return (React.createElement(reactNative.View, { style: [styles$1.footer, darkMode && styles$1.footerDark] },
        React.createElement(reactNative.TouchableOpacity, { style: [
                styles$1.button,
                styles$1.cancelButton,
                darkMode ? styles$1.cancelButtonDark : styles$1.cancelButtonLight,
            ], onPress: onCancel, disabled: generating, activeOpacity: 0.7 },
            React.createElement(reactNative.Text, { style: [
                    styles$1.buttonText,
                    darkMode ? styles$1.cancelButtonTextDark : styles$1.cancelButtonTextLight,
                ] }, "Cancel")),
        React.createElement(reactNative.TouchableOpacity, { style: [
                styles$1.button,
                { backgroundColor: primaryColor },
                generating && styles$1.disabledButton,
            ], onPress: onGenerate, disabled: generating, activeOpacity: 0.7 },
            React.createElement(reactNative.Text, { style: [styles$1.buttonText, styles$1.generateButtonText] }, generating ? 'Generating...' : 'Generate Report'))));
};
const styles$1 = reactNative.StyleSheet.create({
    footer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#ffffff',
    },
    footerDark: {
        borderTopColor: '#333',
        backgroundColor: '#1a1a1a',
    },
    button: {
        flex: 1,
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
    },
    cancelButton: {
        borderWidth: 1.5,
    },
    cancelButtonLight: {
        backgroundColor: '#f0f0f0',
        borderColor: '#e0e0e0',
    },
    cancelButtonDark: {
        backgroundColor: '#2a2a2a',
        borderColor: '#3a3a3a',
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    cancelButtonTextLight: {
        color: '#000000',
    },
    cancelButtonTextDark: {
        color: '#ffffff',
    },
    generateButtonText: {
        color: '#ffffff',
    },
});

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
const PDFReportModal = ({ visible, onClose, darkMode, data, sessions, userName, onGenerateReport, labels: customLabels, reportTypes: customReportTypes, primaryColor = DEFAULT_PRIMARY_COLOR, accentColor, }) => {
    // Merge custom labels with defaults
    const labels = React.useMemo(() => ({
        ...DEFAULT_LABELS,
        ...customLabels,
    }), [customLabels]);
    // Get report types configuration
    const reportTypes = useReportTypes({
        customReportTypes,
        labels,
    });
    // Use custom hook for form management
    const { selectedReportType, includeCharts, includeSessionDetails, includeItemDetails, includeAchievements, customStartDate, customEndDate, selectedItemId, customTitle, generating, showStartDatePicker, showEndDatePicker, setSelectedReportType, setIncludeCharts, setIncludeSessionDetails, setIncludeItemDetails, setIncludeAchievements, setCustomStartDate, setCustomEndDate, setSelectedItemId, setCustomTitle, setShowStartDatePicker, setShowEndDatePicker, handleGenerateReport, } = useReportForm({
        visible,
        labels,
        onGenerateReport,
        onClose,
    });
    // Get items that have sessions
    const itemsWithSessions = React.useMemo(() => data.filter((item) => sessions.some((session) => session.itemId === item.id)), [data, sessions]);
    // Date picker handlers
    const onStartDateChange = React.useCallback((event, selectedDate) => {
        setShowStartDatePicker(false);
        if (event.type === 'set' && selectedDate) {
            setCustomStartDate(selectedDate);
        }
    }, [setShowStartDatePicker, setCustomStartDate]);
    const onEndDateChange = React.useCallback((event, selectedDate) => {
        setShowEndDatePicker(false);
        if (event.type === 'set' && selectedDate) {
            setCustomEndDate(selectedDate);
        }
    }, [setShowEndDatePicker, setCustomEndDate]);
    return (React.createElement(reactNative.Modal, { visible: visible, animationType: "slide", transparent: true, onRequestClose: onClose },
        React.createElement(reactNative.View, { style: styles.modalOverlay },
            React.createElement(reactNative.TouchableOpacity, { style: { flex: 1 }, activeOpacity: 1, onPress: onClose }),
            React.createElement(reactNative.View, { style: [
                    styles.modalContainer,
                    darkMode && styles.modalContainerDark,
                ] },
                React.createElement(ModalHeader, { title: labels.reportTitle || 'Activity Report', onClose: onClose, darkMode: darkMode }),
                React.createElement(reactNative.ScrollView, { style: styles.content, showsVerticalScrollIndicator: false },
                    React.createElement(ReportTypeSelector, { reportTypes: reportTypes, selectedType: selectedReportType, onSelectType: setSelectedReportType, darkMode: darkMode, primaryColor: primaryColor }),
                    selectedReportType === 'custom' && (React.createElement(DateRangeSelector, { startDate: customStartDate, endDate: customEndDate, onStartDateChange: onStartDateChange, onEndDateChange: onEndDateChange, showStartPicker: showStartDatePicker, showEndPicker: showEndDatePicker, setShowStartPicker: setShowStartDatePicker, setShowEndPicker: setShowEndDatePicker, darkMode: darkMode, primaryColor: primaryColor })),
                    selectedReportType === 'item-details' && (React.createElement(ItemSelector, { items: itemsWithSessions, selectedItemId: selectedItemId, onSelectItem: setSelectedItemId, itemLabel: labels.itemLabel || 'Item', itemLabelPlural: labels.itemLabelPlural || 'Items', darkMode: darkMode, primaryColor: primaryColor })),
                    React.createElement(CustomTitleInput, { value: customTitle, onChangeText: setCustomTitle, darkMode: darkMode }),
                    React.createElement(ReportOptionsToggles, { includeCharts: includeCharts, includeSessionDetails: includeSessionDetails, includeItemDetails: includeItemDetails, includeAchievements: includeAchievements, onToggleCharts: setIncludeCharts, onToggleSessionDetails: setIncludeSessionDetails, onToggleItemDetails: setIncludeItemDetails, onToggleAchievements: setIncludeAchievements, labels: labels, darkMode: darkMode, primaryColor: primaryColor })),
                React.createElement(ModalFooter, { onCancel: onClose, onGenerate: handleGenerateReport, generating: generating, darkMode: darkMode, primaryColor: primaryColor })))));
};
const styles = reactNative.StyleSheet.create({
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
        ...reactNative.Platform.select({
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

exports.CustomTitleInput = CustomTitleInput;
exports.DEFAULT_FORM_STATE = DEFAULT_FORM_STATE;
exports.DEFAULT_LABELS = DEFAULT_LABELS;
exports.DEFAULT_PRIMARY_COLOR = DEFAULT_PRIMARY_COLOR;
exports.DateRangeSelector = DateRangeSelector;
exports.ItemSelector = ItemSelector;
exports.ModalFooter = ModalFooter;
exports.ModalHeader = ModalHeader;
exports.PDFReportModal = PDFReportModal;
exports.ReportOptionsToggles = ReportOptionsToggles;
exports.ReportTypeSelector = ReportTypeSelector;
exports.formatCurrency = formatCurrency;
exports.formatDate = formatDate;
exports.formatDuration = formatDuration;
exports.formatPercentage = formatPercentage;
exports.useReportForm = useReportForm;
exports.useReportTypes = useReportTypes;
exports.validateDateRange = validateDateRange;
exports.validateItemSelection = validateItemSelection;
//# sourceMappingURL=index.js.map
