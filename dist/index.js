'use strict';

var React = require('react');
var reactNative = require('react-native');
var Print = require('expo-print');
var FileSystem = require('expo-file-system/legacy');
var Sharing = require('expo-sharing');
var vectorIcons = require('@expo/vector-icons');
var DateTimePicker = require('@react-native-community/datetimepicker');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var Print__namespace = /*#__PURE__*/_interopNamespaceDefault(Print);
var FileSystem__namespace = /*#__PURE__*/_interopNamespaceDefault(FileSystem);
var Sharing__namespace = /*#__PURE__*/_interopNamespaceDefault(Sharing);

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
 * @pdf-generator
 * @description Utility functions for generating PDF reports
 */
/**
 * Generate HTML content for the PDF report
 */
const generatePDFHTML = (options, data, sessions, itemName = 'Item', itemNamePlural = 'Items', sessionLabel = 'Sessions') => {
    const reportTitle = options.customTitle || `${options.type} Report`;
    const generatedDate = new Date().toLocaleDateString();
    // Filter data based on selected options
    const filteredData = options.itemId
        ? data.filter(item => item.id === options.itemId)
        : data;
    const completedItems = filteredData.filter(item => {
        // Assuming items have a currentPage/totalPages or similar progress indicator
        const itemAny = item;
        return itemAny.currentPage === itemAny.totalPages;
    });
    const totalProgress = filteredData.reduce((sum, item) => {
        const itemAny = item;
        return sum + (itemAny.currentPage || 0);
    }, 0);
    const totalDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${reportTitle}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          padding: 40px;
          color: #333;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #007AFF;
        }
        .header h1 {
          color: #007AFF;
          font-size: 32px;
          margin-bottom: 10px;
        }
        .header p {
          color: #666;
          font-size: 14px;
        }
        .summary {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        .summary-item {
          text-align: center;
        }
        .summary-item .label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .summary-item .value {
          font-size: 28px;
          font-weight: bold;
          color: #007AFF;
          margin-top: 5px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h2 {
          color: #333;
          font-size: 20px;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e0e0e0;
        }
        .item-card {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 15px;
        }
        .item-card:last-child { margin-bottom: 0; }
        .item-title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 5px;
        }
        .item-subtitle {
          color: #666;
          font-size: 14px;
          margin-bottom: 10px;
        }
        .item-meta {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          font-size: 13px;
          color: #666;
        }
        .item-meta span {
          background: #f0f0f0;
          padding: 5px 12px;
          border-radius: 15px;
        }
        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          margin-top: 10px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #007AFF, #00C7BE);
          border-radius: 4px;
        }
        .session-item {
          padding: 15px;
          border-left: 3px solid #007AFF;
          background: #f8f9fa;
          margin-bottom: 10px;
          border-radius: 0 8px 8px 0;
        }
        .session-date {
          font-weight: 600;
          color: #333;
          margin-bottom: 5px;
        }
        .session-details {
          font-size: 13px;
          color: #666;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          text-align: center;
          color: #999;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${reportTitle}</h1>
        <p>Generated on ${generatedDate}</p>
      </div>

      ${options.includeItemDetails ? `
      <div class="summary">
        <div class="summary-item">
          <div class="label">Total ${itemNamePlural}</div>
          <div class="value">${filteredData.length}</div>
        </div>
        <div class="summary-item">
          <div class="label">Completed</div>
          <div class="value">${completedItems.length}</div>
        </div>
        <div class="summary-item">
          <div class="label">Progress</div>
          <div class="value">${totalProgress}</div>
        </div>
        <div class="summary-item">
          <div class="label">Time</div>
          <div class="value">${Math.round(totalDuration)}m</div>
        </div>
      </div>
      ` : ''}

      ${options.includeItemDetails ? `
      <div class="section">
        <h2>${itemNamePlural} Overview</h2>
        ${filteredData.map(item => {
        const itemAny = item;
        const progress = itemAny.totalPages
            ? Math.round((itemAny.currentPage / itemAny.totalPages) * 100)
            : 0;
        return `
            <div class="item-card">
              <div class="item-title">${itemAny.title || item.name || item.id}</div>
              ${itemAny.author ? `<div class="item-subtitle">by ${itemAny.author}</div>` : ''}
              ${itemAny.category ? `<div class="item-meta"><span>${itemAny.category}</span></div>` : ''}
              ${itemAny.totalPages ? `
                <div class="item-meta">
                  <span>${itemAny.currentPage}/${itemAny.totalPages}</span>
                  <span>${progress}% complete</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
              ` : ''}
            </div>
          `;
    }).join('')}
      </div>
      ` : ''}

      ${options.includeSessionDetails ? `
      <div class="section">
        <h2>Recent ${sessionLabel}</h2>
        ${sessions.slice(0, 10).map(session => {
        const relatedItem = data.find(d => d.id === session.itemId);
        const itemAny = relatedItem;
        return `
            <div class="session-item">
              <div class="session-date">${session.date || 'No date'}</div>
              <div class="session-details">
                <strong>${itemAny?.title || itemAny?.name || 'Unknown'}</strong> •
                ${session.duration ? `${session.duration} minutes` : ''}
                ${session.notes ? `• "${session.notes}"` : ''}
              </div>
            </div>
          `;
    }).join('')}
      </div>
      ` : ''}

      ${options.includeAchievements ? `
      <div class="section">
        <h2>Achievements</h2>
        <div class="item-card">
          <div class="item-title">📚 Consistent Tracker</div>
          <div class="item-subtitle">Completed ${completedItems.length} ${itemName.toLowerCase()}${completedItems.length !== 1 ? 's' : ''}!</div>
        </div>
        ${totalProgress > 100 ? `
          <div class="item-card">
            <div class="item-title">📖 High Achiever</div>
            <div class="item-subtitle">Recorded ${totalProgress} total progress units!</div>
          </div>
        ` : ''}
        ${totalDuration > 120 ? `
          <div class="item-card">
            <div class="item-title">⏰ Dedicated</div>
            <div class="item-subtitle">Spent over ${Math.round(totalDuration / 60)} hours!</div>
          </div>
        ` : ''}
      </div>
      ` : ''}

      <div class="footer">
        <p>Generated by PDF Report Library • ${generatedDate}</p>
      </div>
    </body>
    </html>
  `;
};
/**
 * Generate and save PDF report to device
 */
const downloadPDFReport = async (options, data, sessions, itemName, itemNamePlural, sessionLabel) => {
    const html = generatePDFHTML(options, data, sessions, itemName, itemNamePlural, sessionLabel);
    const { uri } = await Print__namespace.printToFileAsync({ html });
    // Create a permanent file in documents directory using the legacy API
    const fileName = `Report_${Date.now()}.pdf`;
    const fileUri = FileSystem__namespace.documentDirectory + fileName;
    await FileSystem__namespace.copyAsync({ from: uri, to: fileUri });
    return fileUri;
};
/**
 * Generate and share PDF report
 */
const sharePDFReport = async (options, data, sessions, itemName, itemNamePlural, sessionLabel) => {
    const html = generatePDFHTML(options, data, sessions, itemName, itemNamePlural, sessionLabel);
    const { uri } = await Print__namespace.printToFileAsync({ html });
    await Sharing__namespace.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Report',
    });
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
    return (React.createElement(reactNative.View, { style: styles$8.section },
        React.createElement(reactNative.Text, { style: [styles$8.sectionTitle, darkMode && styles$8.darkText] }, "Report Type"),
        React.createElement(reactNative.View, { style: styles$8.reportTypeGrid }, reportTypes.map(({ type, title, description, icon }) => (React.createElement(reactNative.TouchableOpacity, { key: type, style: [
                styles$8.reportTypeCard,
                selectedType === type
                    ? { ...styles$8.selectedReportType, borderColor: primaryColor, backgroundColor: `${primaryColor}20` }
                    : darkMode
                        ? styles$8.unselectedReportTypeDark
                        : styles$8.unselectedReportTypeLight
            ], onPress: () => onSelectType(type), activeOpacity: 0.7 },
            React.createElement(reactNative.View, { style: styles$8.reportTypeContent },
                icon && React.createElement(reactNative.Text, { style: styles$8.reportTypeIcon }, icon),
                React.createElement(reactNative.View, { style: styles$8.reportTypeTextContainer },
                    React.createElement(reactNative.Text, { style: [
                            styles$8.reportTypeTitle,
                            {
                                color: selectedType === type
                                    ? primaryColor
                                    : darkMode
                                        ? '#ffffff'
                                        : '#000000',
                            },
                        ] }, title),
                    React.createElement(reactNative.Text, { style: [
                            styles$8.reportTypeDescription,
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
const styles$8 = reactNative.StyleSheet.create({
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
 * @component DateRangeSelector
 * @description Component for selecting custom date range
 */
const DateRangeSelector = ({ startDate, endDate, onStartDateChange, onEndDateChange, showStartPicker, showEndPicker, setShowStartPicker, setShowEndPicker, darkMode, primaryColor, }) => {
    return (React.createElement(reactNative.View, { style: styles$7.section },
        React.createElement(reactNative.Text, { style: [styles$7.sectionTitle, darkMode && styles$7.darkText] }, "Date Range"),
        React.createElement(reactNative.View, { style: styles$7.dateInputContainer },
            React.createElement(reactNative.Text, { style: [styles$7.dateLabel, darkMode && styles$7.darkText] }, "Start Date"),
            React.createElement(reactNative.TouchableOpacity, { style: [
                    styles$7.dateInput,
                    darkMode ? styles$7.dateInputDark : styles$7.dateInputLight,
                ], onPress: () => setShowStartPicker(true), activeOpacity: 0.7 },
                React.createElement(reactNative.Text, { style: [
                        styles$7.dateText,
                        darkMode && styles$7.darkText,
                        !startDate && styles$7.dateTextPlaceholder,
                    ] }, startDate ? formatDate(startDate) : 'Select start date'),
                React.createElement(vectorIcons.Ionicons, { name: "calendar-outline", size: 22, color: primaryColor }))),
        React.createElement(reactNative.View, { style: styles$7.dateInputContainer },
            React.createElement(reactNative.Text, { style: [styles$7.dateLabel, darkMode && styles$7.darkText] }, "End Date"),
            React.createElement(reactNative.TouchableOpacity, { style: [
                    styles$7.dateInput,
                    darkMode ? styles$7.dateInputDark : styles$7.dateInputLight,
                ], onPress: () => setShowEndPicker(true), activeOpacity: 0.7 },
                React.createElement(reactNative.Text, { style: [
                        styles$7.dateText,
                        darkMode && styles$7.darkText,
                        !endDate && styles$7.dateTextPlaceholder,
                    ] }, endDate ? formatDate(endDate) : 'Select end date'),
                React.createElement(vectorIcons.Ionicons, { name: "calendar-outline", size: 22, color: primaryColor }))),
        showStartPicker && (React.createElement(DateTimePicker, { value: startDate || new Date(), mode: "date", display: "default", onChange: onStartDateChange, maximumDate: endDate || new Date() })),
        showEndPicker && (React.createElement(DateTimePicker, { value: endDate || new Date(), mode: "date", display: "default", onChange: onEndDateChange, minimumDate: startDate, maximumDate: new Date() }))));
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
    return (React.createElement(reactNative.View, { style: styles$6.section },
        React.createElement(reactNative.Text, { style: [styles$6.sectionTitle, darkMode && styles$6.darkText] },
            "Select ",
            itemLabel),
        React.createElement(reactNative.View, { style: styles$6.itemSelection },
            items.map((item) => (React.createElement(reactNative.TouchableOpacity, { key: item.id, style: [
                    styles$6.itemOption,
                    darkMode ? styles$6.itemOptionDark : styles$6.itemOptionLight,
                    selectedItemId === item.id && {
                        ...styles$6.selectedItem,
                        borderColor: primaryColor,
                        backgroundColor: `${primaryColor}15`,
                    },
                ], onPress: () => onSelectItem(item.id), activeOpacity: 0.7 },
                React.createElement(reactNative.Text, { style: [styles$6.itemTitle, darkMode && styles$6.darkText] }, item.title),
                item.subtitle && (React.createElement(reactNative.Text, { style: [styles$6.itemSubtitle, darkMode && styles$6.darkSubtitleText] }, item.subtitle))))),
            items.length === 0 && (React.createElement(reactNative.Text, { style: [
                    styles$6.itemSubtitle,
                    darkMode && styles$6.darkSubtitleText,
                    styles$6.emptyText,
                ] },
                "No ",
                itemLabelPlural.toLowerCase(),
                " with sessions found")))));
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
    return (React.createElement(reactNative.View, { style: styles$5.section },
        React.createElement(reactNative.Text, { style: [styles$5.sectionTitle, darkMode && styles$5.darkText] }, "Custom Title (Optional)"),
        React.createElement(reactNative.Text, { style: [
                styles$5.optionDescription,
                darkMode && styles$5.darkDescriptionText,
                styles$5.descriptionSpacing,
            ] }, "Add a personalized title to your report"),
        React.createElement(reactNative.TextInput, { style: [
                styles$5.customInput,
                darkMode ? styles$5.customInputDark : styles$5.customInputLight,
            ], placeholder: "Enter custom report title...", placeholderTextColor: darkMode ? '#666' : '#999', value: value, onChangeText: onChangeText })));
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
    return (React.createElement(reactNative.View, { style: styles$4.section },
        React.createElement(reactNative.Text, { style: [styles$4.sectionTitle, darkMode && styles$4.darkText] }, "Include in Report"),
        React.createElement(reactNative.View, { style: [styles$4.optionRow, darkMode && styles$4.optionRowDark] },
            React.createElement(reactNative.View, { style: styles$4.optionContent },
                React.createElement(reactNative.Text, { style: [styles$4.optionLabel, darkMode && styles$4.darkText] }, "\uD83D\uDCCA Charts & Graphs"),
                React.createElement(reactNative.Text, { style: [styles$4.optionDescription, darkMode && styles$4.darkDescriptionText] }, "Visual representations of progress and trends")),
            React.createElement(reactNative.Switch, { value: includeCharts, onValueChange: onToggleCharts, trackColor: trackColor, thumbColor: "#fff", ios_backgroundColor: trackColor.false })),
        React.createElement(reactNative.View, { style: [styles$4.optionRow, darkMode && styles$4.optionRowDark] },
            React.createElement(reactNative.View, { style: styles$4.optionContent },
                React.createElement(reactNative.Text, { style: [styles$4.optionLabel, darkMode && styles$4.darkText] },
                    "\uD83D\uDCDD ",
                    labels.sessionLabel,
                    " Details"),
                React.createElement(reactNative.Text, { style: [styles$4.optionDescription, darkMode && styles$4.darkDescriptionText] },
                    "Individual ",
                    labels.sessionLabel?.toLowerCase(),
                    " information")),
            React.createElement(reactNative.Switch, { value: includeSessionDetails, onValueChange: onToggleSessionDetails, trackColor: trackColor, thumbColor: "#fff", ios_backgroundColor: trackColor.false })),
        React.createElement(reactNative.View, { style: [styles$4.optionRow, darkMode && styles$4.optionRowDark] },
            React.createElement(reactNative.View, { style: styles$4.optionContent },
                React.createElement(reactNative.Text, { style: [styles$4.optionLabel, darkMode && styles$4.darkText] },
                    "\uD83D\uDCDA ",
                    labels.itemLabel,
                    " Details"),
                React.createElement(reactNative.Text, { style: [styles$4.optionDescription, darkMode && styles$4.darkDescriptionText] },
                    "Information about ",
                    labels.itemLabelPlural?.toLowerCase())),
            React.createElement(reactNative.Switch, { value: includeItemDetails, onValueChange: onToggleItemDetails, trackColor: trackColor, thumbColor: "#fff", ios_backgroundColor: trackColor.false })),
        React.createElement(reactNative.View, { style: [styles$4.optionRow, darkMode && styles$4.optionRowDark] },
            React.createElement(reactNative.View, { style: styles$4.optionContent },
                React.createElement(reactNative.Text, { style: [styles$4.optionLabel, darkMode && styles$4.darkText] }, "\uD83C\uDFC6 Achievements"),
                React.createElement(reactNative.Text, { style: [styles$4.optionDescription, darkMode && styles$4.darkDescriptionText] }, "Milestones and accomplishments")),
            React.createElement(reactNative.Switch, { value: includeAchievements, onValueChange: onToggleAchievements, trackColor: trackColor, thumbColor: "#fff", ios_backgroundColor: trackColor.false }))));
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
    return (React.createElement(reactNative.View, { style: [styles$3.header, darkMode && styles$3.headerDark] },
        React.createElement(reactNative.Text, { style: [styles$3.title, darkMode && styles$3.darkText] },
            "\uD83D\uDCC4 ",
            title),
        React.createElement(reactNative.TouchableOpacity, { style: [styles$3.closeButton, darkMode && styles$3.closeButtonDark], onPress: onClose },
            React.createElement(vectorIcons.Ionicons, { name: "close", size: 22, color: darkMode ? '#ffffff' : '#000000' }))));
};
const styles$3 = reactNative.StyleSheet.create({
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
    return (React.createElement(reactNative.View, { style: [styles$2.footer, darkMode && styles$2.footerDark] },
        React.createElement(reactNative.TouchableOpacity, { style: [
                styles$2.button,
                styles$2.cancelButton,
                darkMode ? styles$2.cancelButtonDark : styles$2.cancelButtonLight,
            ], onPress: onCancel, disabled: generating, activeOpacity: 0.7 },
            React.createElement(reactNative.Text, { style: [
                    styles$2.buttonText,
                    darkMode ? styles$2.cancelButtonTextDark : styles$2.cancelButtonTextLight,
                ] }, "Cancel")),
        React.createElement(reactNative.TouchableOpacity, { style: [
                styles$2.button,
                styles$2.generateButton,
                { backgroundColor: primaryColor },
                generating && styles$2.disabledButton,
            ], onPress: onGenerate, disabled: generating, activeOpacity: 0.7 },
            React.createElement(reactNative.Text, { style: [styles$2.buttonText, styles$2.generateButtonText] }, generating ? 'Generating...' : 'Generate Report'))));
};
const styles$2 = reactNative.StyleSheet.create({
    footer: {
        flexDirection: 'row',
        padding: 20,
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
        marginRight: 12,
    },
    cancelButtonLight: {
        backgroundColor: '#f0f0f0',
        borderColor: '#e0e0e0',
    },
    cancelButtonDark: {
        backgroundColor: '#2a2a2a',
        borderColor: '#3a3a3a',
    },
    generateButton: {
        marginLeft: 12,
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
 * @component SuccessModal
 * @description A beautiful success modal shown after report generation with share and download options
 */
const SuccessModal = ({ visible, onClose, onShare, onDownload, darkMode, primaryColor, reportTitle = 'Report', }) => {
    return (React.createElement(reactNative.Modal, { visible: visible, transparent: true, animationType: "fade", onRequestClose: onClose },
        React.createElement(reactNative.View, { style: styles$1.overlay },
            React.createElement(reactNative.View, { style: [styles$1.container, darkMode && styles$1.containerDark] },
                React.createElement(reactNative.View, { style: [styles$1.iconContainer, { backgroundColor: `${primaryColor}15` }] },
                    React.createElement(reactNative.View, { style: [styles$1.iconCircle, { backgroundColor: primaryColor }] },
                        React.createElement(reactNative.Text, { style: styles$1.checkmark }, "\u2713"))),
                React.createElement(reactNative.Text, { style: [styles$1.title, darkMode && styles$1.titleDark] }, "Report Generated!"),
                React.createElement(reactNative.Text, { style: [styles$1.subtitle, darkMode && styles$1.subtitleDark] },
                    "Your ",
                    reportTitle,
                    " has been generated successfully."),
                React.createElement(reactNative.View, { style: [styles$1.detailsCard, darkMode && styles$1.detailsCardDark] },
                    React.createElement(reactNative.View, { style: styles$1.detailRow },
                        React.createElement(reactNative.View, { style: [styles$1.detailDot, { backgroundColor: primaryColor }] }),
                        React.createElement(reactNative.Text, { style: [styles$1.detailText, darkMode && styles$1.detailTextDark] }, "High-quality PDF format")),
                    React.createElement(reactNative.View, { style: styles$1.detailRow },
                        React.createElement(reactNative.View, { style: [styles$1.detailDot, { backgroundColor: primaryColor }] }),
                        React.createElement(reactNative.Text, { style: [styles$1.detailText, darkMode && styles$1.detailTextDark] }, "Ready to share or download")),
                    React.createElement(reactNative.View, { style: styles$1.detailRow },
                        React.createElement(reactNative.View, { style: [styles$1.detailDot, { backgroundColor: primaryColor }] }),
                        React.createElement(reactNative.Text, { style: [styles$1.detailText, darkMode && styles$1.detailTextDark] }, "Includes all selected data"))),
                React.createElement(reactNative.View, { style: styles$1.buttonContainer },
                    React.createElement(reactNative.TouchableOpacity, { style: [styles$1.actionButton, darkMode && styles$1.actionButtonDark], onPress: onDownload, activeOpacity: 0.8 },
                        React.createElement(reactNative.View, { style: [styles$1.buttonIcon, { backgroundColor: `${primaryColor}20` }] },
                            React.createElement(reactNative.Text, { style: styles$1.buttonIconText }, "\u2193")),
                        React.createElement(reactNative.Text, { style: [styles$1.actionButtonText, darkMode && styles$1.actionButtonTextDark] }, "Download")),
                    React.createElement(reactNative.TouchableOpacity, { style: [styles$1.actionButton, styles$1.primaryButton, { backgroundColor: primaryColor }], onPress: onShare, activeOpacity: 0.8 },
                        React.createElement(reactNative.View, { style: [styles$1.buttonIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }] },
                            React.createElement(reactNative.Text, { style: [styles$1.buttonIconText, styles$1.buttonIconTextWhite] }, "\u2191")),
                        React.createElement(reactNative.Text, { style: [styles$1.actionButtonText, styles$1.primaryButtonText] }, "Share"))),
                React.createElement(reactNative.TouchableOpacity, { style: styles$1.closeButton, onPress: onClose, activeOpacity: 0.7 },
                    React.createElement(reactNative.Text, { style: [styles$1.closeButtonText, darkMode && styles$1.closeButtonTextDark] }, "Close"))))));
};
const styles$1 = reactNative.StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    containerDark: {
        backgroundColor: '#1a1a1a',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        fontSize: 36,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    titleDark: {
        color: '#fff',
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 8,
        lineHeight: 22,
    },
    subtitleDark: {
        color: '#999',
    },
    detailsCard: {
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    detailsCardDark: {
        backgroundColor: '#2a2a2a',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 12,
    },
    detailText: {
        fontSize: 14,
        color: '#555',
        flex: 1,
    },
    detailTextDark: {
        color: '#aaa',
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 20,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        marginRight: 12,
    },
    actionButtonDark: {
        backgroundColor: '#2a2a2a',
        borderColor: '#3a3a3a',
    },
    primaryButton: {
        backgroundColor: '#007AFF',
        borderColor: 'transparent',
        marginRight: 0,
        marginLeft: 12,
    },
    buttonIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    buttonIconText: {
        fontSize: 20,
        color: '#007AFF',
    },
    buttonIconTextWhite: {
        color: '#ffffff',
    },
    actionButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    actionButtonTextDark: {
        color: '#fff',
    },
    primaryButtonText: {
        color: '#ffffff',
    },
    closeButton: {
        padding: 12,
    },
    closeButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#999',
    },
    closeButtonTextDark: {
        color: '#666',
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
const PDFReportModal = ({ visible, onClose, darkMode, data, sessions, userName, onGenerateReport, onShareReport, onDownloadReport, labels: customLabels, reportTypes: customReportTypes, primaryColor = DEFAULT_PRIMARY_COLOR, accentColor, }) => {
    // State for success modal
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
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
    // Reset success modal state when main modal opens
    React.useMemo(() => {
        if (visible) {
            setShowSuccessModal(false);
        }
    }, [visible]);
    // Handle share from success modal
    const handleShare = React.useCallback(() => {
        const options = {
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
    const handleDownload = React.useCallback(() => {
        const options = {
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
    const handleGenerate = React.useCallback(async () => {
        await handleGenerateReport();
        // Small delay to show success modal after main modal closes
        setTimeout(() => {
            setShowSuccessModal(true);
        }, 300);
    }, [handleGenerateReport]);
    // Get report title for success modal
    const reportTitle = customTitle || `${selectedReportType} ${labels.reportTitle || 'Report'}`;
    return (React.createElement(React.Fragment, null,
        React.createElement(reactNative.Modal, { visible: visible, animationType: "slide", transparent: true, onRequestClose: onClose },
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
                        React.createElement(ReportOptionsToggles, { includeCharts: includeCharts, includeSessionDetails: includeSessionDetails, includeItemDetails: includeItemDetails, includeAchievements: includeAchievements, onToggleCharts: setIncludeCharts, onToggleSessionDetails: setIncludeSessionDetails, onToggleItemDetails: setIncludeItemDetails, onToggleAchievements: setIncludeAchievements, labels: labels, darkMode: darkMode, primaryColor: primaryColor }),
                        React.createElement(reactNative.View, { style: [styles.previewSection, darkMode && styles.previewSectionDark] },
                            React.createElement(reactNative.Text, { style: [styles.previewTitle, darkMode && styles.previewTitleDark] }, "PDF Preview"),
                            React.createElement(reactNative.View, { style: [styles.previewCard, darkMode && styles.previewCardDark] },
                                React.createElement(reactNative.View, { style: styles.previewHeader },
                                    React.createElement(reactNative.View, { style: [styles.previewIcon, { backgroundColor: primaryColor }] },
                                        React.createElement(reactNative.Text, { style: styles.previewIconText }, "\uD83D\uDCC4")),
                                    React.createElement(reactNative.View, { style: styles.previewHeaderInfo },
                                        React.createElement(reactNative.Text, { style: [styles.previewReportTitle, darkMode && styles.previewReportTitleDark] }, customTitle || `${selectedReportType} ${labels.reportTitle || 'Report'}`),
                                        React.createElement(reactNative.Text, { style: [styles.previewReportSubtitle, darkMode && styles.previewReportSubtitleDark] },
                                            data.length,
                                            " ",
                                            labels.itemLabelPlural || 'Items',
                                            " \u2022 ",
                                            sessions.length,
                                            " ",
                                            labels.sessionLabelPlural || 'Sessions'))),
                                React.createElement(reactNative.View, { style: styles.previewContent },
                                    includeCharts && (React.createElement(reactNative.View, { style: styles.previewItem },
                                        React.createElement(reactNative.View, { style: [styles.previewBullet, { backgroundColor: primaryColor }] }),
                                        React.createElement(reactNative.Text, { style: [styles.previewItemText, darkMode && styles.previewItemTextDark] }, "Charts & Graphs"))),
                                    includeItemDetails && (React.createElement(reactNative.View, { style: styles.previewItem },
                                        React.createElement(reactNative.View, { style: [styles.previewBullet, { backgroundColor: primaryColor }] }),
                                        React.createElement(reactNative.Text, { style: [styles.previewItemText, darkMode && styles.previewItemTextDark] },
                                            labels.itemLabelPlural || 'Items',
                                            " Details"))),
                                    includeSessionDetails && (React.createElement(reactNative.View, { style: styles.previewItem },
                                        React.createElement(reactNative.View, { style: [styles.previewBullet, { backgroundColor: primaryColor }] }),
                                        React.createElement(reactNative.Text, { style: [styles.previewItemText, darkMode && styles.previewItemTextDark] },
                                            labels.sessionLabelPlural || 'Sessions',
                                            " Details"))),
                                    includeAchievements && (React.createElement(reactNative.View, { style: styles.previewItem },
                                        React.createElement(reactNative.View, { style: [styles.previewBullet, { backgroundColor: primaryColor }] }),
                                        React.createElement(reactNative.Text, { style: [styles.previewItemText, darkMode && styles.previewItemTextDark] }, "Achievements & Milestones"))))))),
                    React.createElement(ModalFooter, { onCancel: onClose, onGenerate: handleGenerate, generating: generating, darkMode: darkMode, primaryColor: primaryColor })))),
        React.createElement(SuccessModal, { visible: showSuccessModal, onClose: () => setShowSuccessModal(false), onShare: handleShare, onDownload: handleDownload, darkMode: darkMode, primaryColor: primaryColor, reportTitle: reportTitle })));
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
exports.SuccessModal = SuccessModal;
exports.downloadPDFReport = downloadPDFReport;
exports.formatCurrency = formatCurrency;
exports.formatDate = formatDate;
exports.formatDuration = formatDuration;
exports.formatPercentage = formatPercentage;
exports.generatePDFHTML = generatePDFHTML;
exports.sharePDFReport = sharePDFReport;
exports.useReportForm = useReportForm;
exports.useReportTypes = useReportTypes;
exports.validateDateRange = validateDateRange;
exports.validateItemSelection = validateItemSelection;
//# sourceMappingURL=index.js.map
