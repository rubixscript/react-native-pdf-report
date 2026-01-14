# React Native PDF Report Library

[![npm version](https://badge.fury.io/js/%40rubixscript%2Freact-native-pdf-report.svg)](https://badge.fury.io/js/%40rubixscript%2Freact-native-pdf-report)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A versatile and customizable React Native PDF report generation library for **any tracking app** - pomodoro, expenses, skills, reading, habits, fitness, and more!

## Features

- 📊 **Universal Tracking**: Works with any type of tracking app
- 🎨 **Fully Customizable**: Custom labels, colors, and terminology
- 📱 **Beautiful UI**: Modern, responsive modal with smooth animations
- 🌓 **Dark Mode**: Full dark mode support
- 📈 **Multiple Report Types**: Summary, monthly, yearly, custom range, and item-specific reports
- ⚡ **Type-Safe**: Written in TypeScript with comprehensive type definitions
- 🎯 **Flexible Data Model**: Generic data structures that adapt to your app's needs
- 🧩 **Modular Architecture**: Clean, maintainable code with reusable components
- 🎣 **Custom Hooks**: Powerful hooks for form management and logic
- 🛠️ **Utility Functions**: Built-in formatters, validators, and helpers
- 💪 **Production Ready**: Battle-tested and optimized for performance

## Installation

```bash
npm install @rubixscript/react-native-pdf-report
```

### Peer Dependencies

```bash
npm install expo-linear-gradient @expo/vector-icons @react-native-community/datetimepicker
```

## Quick Start

```tsx
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { PDFReportModal, DataItem, ActivitySession, ReportLabels } from '@rubixscript/react-native-pdf-report';

export default function App() {
  const [showModal, setShowModal] = useState(false);

  // Your tracking data
  const data: DataItem[] = [
    {
      id: '1',
      title: 'My Item',
      subtitle: 'Category or Author',
      progress: 75,
      total: 100,
      current: 75,
      startDate: new Date(),
    },
  ];

  const sessions: ActivitySession[] = [
    {
      id: 's1',
      itemId: '1',
      date: new Date(),
      duration: 60,
      value: 10,
    },
  ];

  // Customize labels for your app
  const labels: ReportLabels = {
    itemLabel: 'Task',
    itemLabelPlural: 'Tasks',
    sessionLabel: 'Session',
    sessionLabelPlural: 'Sessions',
    reportTitle: 'Activity Report',
  };

  const handleGenerateReport = (options) => {
    console.log('Generate PDF with options:', options);
    // Implement your PDF generation logic here
  };

  return (
    <View>
      <Button title="Generate Report" onPress={() => setShowModal(true)} />

      <PDFReportModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        darkMode={false}
        data={data}
        sessions={sessions}
        onGenerateReport={handleGenerateReport}
        labels={labels}
        primaryColor="#007AFF"
      />
    </View>
  );
}
```

## Use Cases

This library is perfect for:

- 📚 **Reading Trackers** - Track books, pages read, reading sessions
- 🍅 **Pomodoro Apps** - Track work sessions, focus time, productivity
- 💰 **Expense Trackers** - Track spending, budgets, transactions
- 🎯 **Skill Trackers** - Track learning progress, practice sessions
- 🏃 **Fitness Apps** - Track workouts, exercises, progress
- ✅ **Habit Trackers** - Track daily habits, streaks, consistency
- ⏰ **Time Trackers** - Track time spent on projects, tasks
- 📝 **Journal Apps** - Track entries, moods, reflections
- And many more!

## Examples

### Pomodoro / Productivity Tracker

```tsx
const pomodoroLabels: ReportLabels = {
  itemLabel: 'Task',
  itemLabelPlural: 'Tasks',
  sessionLabel: 'Pomodoro Session',
  sessionLabelPlural: 'Pomodoro Sessions',
  reportTitle: 'Productivity Report',
  summaryLabel: 'Productivity Summary',
  progressLabel: 'Pomodoros Completed',
  durationLabel: 'Focus Time',
  totalLabel: 'Total Tasks',
};

const tasks: DataItem[] = [
  {
    id: '1',
    title: 'Complete Project Proposal',
    subtitle: 'Work Project',
    progress: 60,
    total: 10, // total pomodoros
    current: 6, // completed pomodoros
    category: 'Work',
    color: '#E74C3C',
  },
];

<PDFReportModal
  labels={pomodoroLabels}
  data={tasks}
  sessions={pomodoroSessions}
  primaryColor="#E74C3C"
  {...otherProps}
/>
```

### Expense Tracker

```tsx
const expenseLabels: ReportLabels = {
  itemLabel: 'Category',
  itemLabelPlural: 'Categories',
  sessionLabel: 'Transaction',
  sessionLabelPlural: 'Transactions',
  reportTitle: 'Expense Report',
  summaryLabel: 'Financial Summary',
  progressLabel: 'Amount Spent',
};

const categories: DataItem[] = [
  {
    id: '1',
    title: 'Groceries',
    subtitle: 'Food & Beverages',
    progress: 75, // % of budget used
    total: 500, // budget
    current: 375, // spent
    category: 'Food',
    color: '#2ECC71',
  },
];

const expenses: ActivitySession[] = [
  {
    id: 'e1',
    itemId: '1',
    date: new Date(),
    value: 85.50, // expense amount
    notes: 'Weekly grocery shopping',
  },
];

<PDFReportModal
  labels={expenseLabels}
  data={categories}
  sessions={expenses}
  primaryColor="#2ECC71"
  {...otherProps}
/>
```

### Skill Tracker

```tsx
const skillLabels: ReportLabels = {
  itemLabel: 'Skill',
  itemLabelPlural: 'Skills',
  sessionLabel: 'Practice Session',
  sessionLabelPlural: 'Practice Sessions',
  reportTitle: 'Skill Development Report',
  progressLabel: 'Skill Points Earned',
  durationLabel: 'Practice Time',
};

const skills: DataItem[] = [
  {
    id: '1',
    title: 'JavaScript',
    subtitle: 'Programming Language',
    progress: 75,
    total: 100,
    current: 75,
    category: 'Programming',
    metadata: {
      level: 'Advanced',
      hoursInvested: 250,
    },
  },
];

<PDFReportModal
  labels={skillLabels}
  data={skills}
  sessions={practiceSessions}
  primaryColor="#8B5CF6"
  {...otherProps}
/>
```

### Reading Tracker (Legacy Support)

```tsx
const readingLabels: ReportLabels = {
  itemLabel: 'Book',
  itemLabelPlural: 'Books',
  sessionLabel: 'Reading Session',
  sessionLabelPlural: 'Reading Sessions',
  reportTitle: 'Reading Report',
  progressLabel: 'Pages Read',
  durationLabel: 'Reading Time',
};

// You can also use the legacy Book and ReadingSession types
// They are aliases for DataItem and ActivitySession
```

## 🎯 Integration with Companion Libraries

This PDF Report library is designed to work seamlessly with other RubixScript productivity libraries:

### With Flip Clock Library

Combine PDF Report with the Flip Clock for a complete Pomodoro/productivity timer solution:

```tsx
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { FlipClockModal } from '@rubixscript/react-native-flip-clock';
import { PDFReportModal } from '@rubixscript/react-native-pdf-report';

const ProductivityApp = () => {
  const [showFlipClock, setShowFlipClock] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Your Pomodoro tasks data
  const tasks = [
    {
      id: '1',
      title: 'Complete Project',
      subtitle: 'Work',
      progress: 60, // pomodoros completed
      total: 10,    // total estimated pomodoros
      current: 6,   // completed pomodoros
      category: 'Work',
      color: '#FF6347',
    },
  ];

  // Pomodoro sessions from Flip Clock
  const pomodoroSessions = [
    {
      id: 's1',
      itemId: '1',
      date: new Date(),
      duration: 25, // minutes from Flip Clock
      value: 1,    // 1 pomodoro completed
      notes: 'Focused work session',
    },
  ];

  const pomodoroLabels: ReportLabels = {
    itemLabel: 'Task',
    itemLabelPlural: 'Tasks',
    sessionLabel: 'Pomodoro Session',
    sessionLabelPlural: 'Pomodoro Sessions',
    reportTitle: 'Pomodoro Report',
    progressLabel: 'Pomodoros Completed',
    durationLabel: 'Focus Time',
  };

  return (
    <View>
      <Button
        title="Start Pomodoro Timer"
        onPress={() => setShowFlipClock(true)}
      />
      <Button
        title="Generate Report"
        onPress={() => setShowReport(true)}
      />

      {/* Flip Clock for timing */}
      <FlipClockModal
        visible={showFlipClock}
        onClose={() => setShowFlipClock(false)}
        phase="work"
        theme="dark"
        // ... timer props
      />

      {/* PDF Report for analytics */}
      <PDFReportModal
        visible={showReport}
        onClose={() => setShowReport(false)}
        darkMode={false}
        data={tasks}
        sessions={pomodoroSessions}
        labels={pomodoroLabels}
        primaryColor="#FF6347"
        onGenerateReport={(options) => {
          console.log('Generate Pomodoro PDF:', options);
        }}
      />
    </View>
  );
};
```

### With Productivity Charts Library

Combine PDF Report with Productivity Charts for visual analytics before generating reports:

```tsx
import React, { useState } from 'react';
import { View, ScrollView, Button } from 'react-native';
import {
  HeatmapChart,
  ActivityBarChart,
  ProgressCard,
  generateHeatmapData,
  useProductivityData,
} from '@rubixscript/react-native-productivity-charts';
import { PDFReportModal } from '@rubixscript/react-native-pdf-report';

const DashboardWithReport = () => {
  const [showReport, setShowReport] = useState(false);

  // Your tracking data
  const sessions = [
    { date: new Date('2025-01-01'), value: 5 },
    { date: new Date('2025-01-02'), value: 8 },
    // ... more sessions
  ];

  // Generate data for Productivity Charts
  const heatmapDays = generateHeatmapData(sessions, 150, 8);
  const { stats, dailyData } = useProductivityData({ days: heatmapDays });

  // Map sessions to PDF Report format
  const reportSessions = sessions.map((session, index) => ({
    id: `s${index}`,
    itemId: '1',
    date: session.date,
    value: session.value,
    duration: session.value * 25, // Assuming 25 min per session
  }));

  const reportData = [
    {
      id: '1',
      title: 'All Activities',
      progress: stats.currentStreak * 10,
      total: 100,
      current: stats.totalSessions,
    },
  ];

  return (
    <ScrollView>
      {/* Visual Analytics with Productivity Charts */}
      <ProgressCard
        icon="fire"
        value={stats.currentStreak}
        label="Day Streak"
      />

      <HeatmapChart days={heatmapDays} />

      <ActivityBarChart data={dailyData.slice(0, 7)} />

      <Button
        title="Generate PDF Report"
        onPress={() => setShowReport(true)}
      />

      {/* PDF Report Generation */}
      <PDFReportModal
        visible={showReport}
        onClose={() => setShowReport(false)}
        darkMode={false}
        data={reportData}
        sessions={reportSessions}
        onGenerateReport={(options) => {
          console.log('Generate PDF with stats:', options);
        }}
      />
    </ScrollView>
  );
};
```

### Complete Integration Example

A complete productivity app combining all three libraries:

```tsx
import React, { useState } from 'react';
import { View, ScrollView, Button } from 'react-native';
import { FlipClockModal } from '@rubixscript/react-native-flip-clock';
import {
  HeatmapChart,
  ProgressCard,
  generateHeatmapData,
  useProductivityData,
} from '@rubixscript/react-native-productivity-charts';
import { PDFReportModal } from '@rubixscript/react-native-pdf-report';

const CompleteProductivityApp = () => {
  const [showTimer, setShowTimer] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Session data from your app
  const sessions = [
    { date: new Date(), value: 4, duration: 100 },
    // ... more sessions
  ];

  const heatmapDays = generateHeatmapData(sessions, 90, 5);
  const { stats } = useProductivityData({ days: heatmapDays });

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {/* Visual Stats */}
      <ProgressCard
        icon="clock-outline"
        value={stats.totalTime}
        label="Focus Minutes"
      />

      <HeatmapChart days={heatmapDays} title="Activity Heatmap" />

      {/* Timer Button */}
      <Button
        title="Start Focus Session"
        onPress={() => setShowTimer(true)}
      />

      {/* Report Button */}
      <Button
        title="Generate PDF Report"
        onPress={() => setShowReport(true)}
      />

      {/* Flip Clock Modal */}
      <FlipClockModal
        visible={showTimer}
        onClose={() => setShowTimer(false)}
        phase="work"
        theme="dark"
        time={1500}
        isRunning={false}
        onStart={() => console.log('Timer started')}
        onPause={() => console.log('Timer paused')}
      />

      {/* PDF Report Modal */}
      <PDFReportModal
        visible={showReport}
        onClose={() => setShowReport(false)}
        darkMode={false}
        data={[{
          id: '1',
          title: 'Focus Sessions',
          progress: stats.totalSessions,
          total: 100,
          current: stats.totalSessions,
        }]}
        sessions={sessions.map((s, i) => ({
          id: `s${i}`,
          itemId: '1',
          date: s.date,
          value: s.value,
          duration: s.duration,
        }))}
        labels={{
          itemLabel: 'Goal',
          itemLabelPlural: 'Goals',
          sessionLabel: 'Focus Session',
          sessionLabelPlural: 'Focus Sessions',
          reportTitle: 'Productivity Report',
        }}
        primaryColor="#8B5CF6"
        onGenerateReport={(options) => {
          // Generate PDF with charts and statistics
          console.log('Report options:', options);
        }}
      />
    </ScrollView>
  );
};
```

## API Reference

### PDFReportModal Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `visible` | `boolean` | Yes | - | Controls modal visibility |
| `onClose` | `() => void` | Yes | - | Callback when modal is closed |
| `darkMode` | `boolean` | Yes | - | Enable dark mode |
| `data` | `DataItem[]` | Yes | - | Array of items to track |
| `sessions` | `ActivitySession[]` | Yes | - | Array of activity sessions |
| `onGenerateReport` | `(options: ReportOptions) => void` | Yes | - | Callback with report configuration |
| `labels` | `ReportLabels` | No | Default labels | Custom text labels |
| `reportTypes` | `ReportTypeConfig[]` | No | Default types | Custom report type configs |
| `userName` | `string` | No | - | User name for personalization |
| `primaryColor` | `string` | No | `#007AFF` | Primary theme color |
| `accentColor` | `string` | No | - | Accent theme color |

### DataItem Type

```typescript
interface DataItem {
  id: string;                    // Unique identifier
  title: string;                 // Main title (book title, task name, etc.)
  subtitle?: string;             // Subtitle (author, category, etc.)
  imageUri?: string;             // Optional image URL
  progress?: number;             // Progress percentage (0-100)
  total?: number;                // Total units (pages, hours, etc.)
  current?: number;              // Current units completed
  startDate?: Date | string;     // Start date
  completedDate?: Date | string; // Completion date
  notes?: string[];              // Notes array
  category?: string;             // Category
  color?: string;                // Color for UI
  metadata?: Record<string, any>; // Custom metadata
  isPinned?: boolean;            // Pinned status
  [key: string]: any;            // Additional custom fields
}
```

### ActivitySession Type

```typescript
interface ActivitySession {
  id: string;                    // Unique identifier
  itemId: string;                // Reference to DataItem
  date: Date | string;           // Session date
  startValue?: number;           // Start value (page, time, etc.)
  endValue?: number;             // End value
  duration?: number;             // Duration in minutes
  value?: number;                // Numeric value (amount, points, etc.)
  notes?: string;                // Session notes
  imageUrl?: string;             // Optional image
  metadata?: Record<string, any>; // Custom metadata
  [key: string]: any;            // Additional custom fields
}
```

### ReportLabels Type

```typescript
interface ReportLabels {
  itemLabel?: string;            // e.g., "Book", "Task", "Expense"
  itemLabelPlural?: string;      // e.g., "Books", "Tasks"
  sessionLabel?: string;         // e.g., "Session", "Transaction"
  sessionLabelPlural?: string;   // e.g., "Sessions", "Transactions"
  reportTitle?: string;          // e.g., "Reading Report"
  summaryLabel?: string;         // e.g., "Summary"
  progressLabel?: string;        // e.g., "Pages Read"
  durationLabel?: string;        // e.g., "Reading Time"
  totalLabel?: string;           // e.g., "Total Books"
}
```

### ReportOptions Type

```typescript
interface ReportOptions {
  type: ReportType;              // 'summary' | 'monthly' | 'yearly' | 'custom' | 'item-details'
  startDate?: Date;              // For custom reports
  endDate?: Date;                // For custom reports
  includeCharts?: boolean;       // Include charts in report
  includeSessionDetails?: boolean; // Include session details
  includeItemDetails?: boolean;  // Include item details
  includeAchievements?: boolean; // Include achievements
  itemId?: string;               // For item-specific reports
  customTitle?: string;          // Custom report title
  labels?: ReportLabels;         // Labels for the report
}
```

## Customization

### Custom Report Types

You can define custom report types with your own icons and descriptions:

```tsx
const customReportTypes: ReportTypeConfig[] = [
  {
    type: 'summary',
    title: '🎯 My Custom Summary',
    description: 'All-time statistics',
    icon: '🎯',
  },
  {
    type: 'monthly',
    title: '📅 Monthly Review',
    description: 'This month\'s progress',
    icon: '📅',
  },
  // ... more custom types
];

<PDFReportModal
  reportTypes={customReportTypes}
  {...otherProps}
/>
```

### Custom Colors

```tsx
<PDFReportModal
  primaryColor="#FF6B6B"
  accentColor="#4ECDC4"
  {...otherProps}
/>
```

### Flexible Data Model

The library uses a flexible data model that can store any custom fields:

```tsx
const customData: DataItem[] = [
  {
    id: '1',
    title: 'My Item',
    subtitle: 'Subtitle',
    // Add any custom fields
    customField: 'custom value',
    rating: 5,
    tags: ['tag1', 'tag2'],
    metadata: {
      // Store complex custom data
      anyData: 'you need',
    },
  },
];
```

## UI Features

- ✨ **Modern Design**: Beautiful card-based UI with smooth animations
- 🎨 **Customizable Colors**: Change primary and accent colors to match your brand
- 🌓 **Dark Mode**: Full dark mode support throughout
- 📱 **Responsive**: Works perfectly on all screen sizes
- ⌨️ **Accessibility**: Touch-friendly with proper accessibility labels
- 🔄 **Smooth Transitions**: Animated modal with slide transitions
- 📅 **Date Pickers**: Native date pickers for custom date ranges
- ✅ **Smart Validation**: Form validation with helpful error messages

## Fixed Issues (v2.0.0)

- ✅ **Modal Overlay Issue**: Fixed modal not opening properly due to overlay blocking interaction
- ✅ **Generic Library**: Transformed from reading-specific to universal tracking library
- ✅ **Improved Aesthetics**: Enhanced UI with better spacing, colors, and typography
- ✅ **Better Accessibility**: Improved touch targets and visual feedback
- ✅ **Type Safety**: Comprehensive TypeScript types for better DX

## Migrating from v1.x

If you're upgrading from v1.x (reading-specific version):

```tsx
// OLD (v1.x)
import { Book, ReadingSession } from '@rubixscript/react-native-pdf-report';

const books: Book[] = [...];
const sessions: ReadingSession[] = [...];

<PDFReportModal books={books} readingSessions={sessions} />

// NEW (v2.x) - Backward compatible
import { Book, ReadingSession } from '@rubixscript/react-native-pdf-report';

const books: Book[] = [...]; // Still works!
const sessions: ReadingSession[] = [...]; // Still works!

<PDFReportModal data={books} sessions={sessions} />

// OR use new generic types
import { DataItem, ActivitySession } from '@rubixscript/react-native-pdf-report';

const data: DataItem[] = [...];
const sessions: ActivitySession[] = [...];

<PDFReportModal data={data} sessions={sessions} labels={customLabels} />
```

The `Book` and `ReadingSession` types are still available as aliases for backward compatibility.

## Examples Directory

Check out the `examples/` directory for complete working examples:

- `reading-tracker.tsx` - Reading tracking app
- `pomodoro-tracker.tsx` - Productivity/pomodoro app
- `expense-tracker.tsx` - Expense tracking app
- `skill-tracker.tsx` - Skill development app

## Architecture

This library follows a modular architecture for maintainability and extensibility:

- **8 Modular Components**: Each with a single responsibility
- **2 Custom Hooks**: `useReportForm` and `useReportTypes`
- **Utility Functions**: Formatters, validators, and constants
- **Type-Safe**: Comprehensive TypeScript definitions

The main `PDFReportModal` component has been reduced from 795 lines to just 272 lines through modularization!

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

### Component Structure

```
PDFReportModal (Main Orchestrator)
├── ModalHeader
├── ScrollView
│   ├── ReportTypeSelector
│   ├── DateRangeSelector (conditional)
│   ├── ItemSelector (conditional)
│   ├── CustomTitleInput
│   └── ReportOptionsToggles
└── ModalFooter
```

### Using Individual Components

All components are exported and can be used independently:

```typescript
import {
  ReportTypeSelector,
  DateRangeSelector,
  ItemSelector,
  CustomTitleInput,
  ReportOptionsToggles,
  ModalHeader,
  ModalFooter,
} from '@rubixscript/react-native-pdf-report';
```

### Using Custom Hooks

```typescript
import { useReportForm, useReportTypes } from '@rubixscript/react-native-pdf-report';

// In your component
const { selectedReportType, handleGenerateReport, ... } = useReportForm({
  visible,
  labels,
  onGenerateReport,
  onClose,
});
```

### Using Utilities

```typescript
import {
  formatDate,
  formatDuration,
  formatCurrency,
  validateDateRange,
  DEFAULT_LABELS,
} from '@rubixscript/react-native-pdf-report';
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

When contributing, please:
- Follow the modular architecture patterns
- Keep components small and focused (< 150 lines)
- Add TypeScript types for all props
- Write tests for new functionality
- Update documentation

## License

MIT © RubixScript Team

## Links

- [GitHub Repository](https://github.com/rubixscript/react-native-pdf-report)
- [Report Issues](https://github.com/rubixscript/react-native-pdf-report/issues)
- [RubixScript Website](https://www.rubixscript.com)

## Support

If you find this library helpful, please give it a ⭐ on GitHub!

For questions and support, please open an issue on GitHub.
