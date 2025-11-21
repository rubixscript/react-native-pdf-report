# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2024-03-XX

### 🎉 Major Release - Complete Transformation

This release transforms the library from a reading-specific tool into a universal tracking library with a modular architecture.

### ✨ New Features

#### Universal Tracking Support
- **Generic Data Model**: `DataItem` and `ActivitySession` types work for any tracking app
- **Customizable Labels**: Full control over UI text through `ReportLabels` interface
- **Custom Report Types**: Define your own report types with icons and descriptions
- **Theme Customization**: `primaryColor` and `accentColor` props for branding
- **Flexible Metadata**: Store any custom data in items and sessions

#### Modular Architecture
- **8 Reusable Components**:
  - `ReportTypeSelector` - Report type selection
  - `DateRangeSelector` - Date range picker
  - `ItemSelector` - Item selection for detailed reports
  - `CustomTitleInput` - Custom title input field
  - `ReportOptionsToggles` - Report content options
  - `ModalHeader` - Modal header with close button
  - `ModalFooter` - Action buttons
  - `PDFReportModal` - Main orchestrator (reduced from 795 to 272 lines!)

- **2 Custom Hooks**:
  - `useReportForm` - Form state management
  - `useReportTypes` - Report type configuration logic

- **Utility Functions**:
  - **Formatters**: `formatDate`, `formatDuration`, `formatCurrency`, `formatPercentage`
  - **Validators**: `validateDateRange`, `validateItemSelection`
  - **Constants**: `DEFAULT_LABELS`, `DEFAULT_PRIMARY_COLOR`, `DEFAULT_FORM_STATE`

### 🎨 UI Improvements

#### Enhanced Aesthetics
- **Larger Border Radius**: 24px (up from 20px) for modern look
- **Better Spacing**: Improved padding and margins throughout
- **Enhanced Typography**: Better font weights and letter spacing
- **Improved Colors**: Better contrast in both light and dark modes
- **Smoother Animations**: Enhanced modal transitions
- **Better Visual Hierarchy**: Clear information structure
- **Larger Touch Targets**: 36px close button, 52px action buttons

#### Dark Mode Enhancements
- Improved color contrast
- Better background colors
- Enhanced border colors
- Optimized text colors

### 🐛 Bug Fixes

#### Modal Issues
- **Fixed**: Modal overlay blocking interaction
- **Fixed**: Modal not opening properly in some cases
- **Solution**: Changed to proper transparent modal structure

### 📦 Package Updates

- **Version**: Bumped to 2.0.0
- **Description**: Updated to highlight versatility
- **Keywords**: Added pomodoro, expense-tracker, skill-tracker, habit-tracker, and more

### 📚 Documentation

- **README.md**: Complete rewrite with multiple use case examples
- **ARCHITECTURE.md**: New comprehensive architecture documentation
- **Examples**: 4 complete working examples for different app types:
  - `reading-tracker.tsx`
  - `pomodoro-tracker.tsx`
  - `expense-tracker.tsx`
  - `skill-tracker.tsx`

### 🔄 Migration & Backward Compatibility

- **Legacy Types**: `Book` and `ReadingSession` still available as aliases
- **Backward Compatible**: Existing v1.x code works with minimal changes
- **Migration Guide**: Included in README.md

### 📊 Code Quality Improvements

#### Metrics
- **Main Component**: 795 lines → 272 lines (66% reduction)
- **Components**: 1 monolithic → 8 modular components
- **Hooks**: 0 → 2 custom hooks
- **Utilities**: Scattered → Organized in 3 files
- **Maintainability**: Significantly improved
- **Testability**: Each component can be tested in isolation

#### Benefits
- **Separation of Concerns**: Each component has a single responsibility
- **Reusability**: Components can be used independently
- **Maintainability**: Small, focused modules are easier to understand
- **Testability**: Isolated components are easier to test
- **Customizability**: Users can customize or replace individual components

### 🎯 Use Cases Now Supported

The library now works perfectly for:
- 📚 Reading Trackers
- 🍅 Pomodoro/Productivity Apps
- 💰 Expense Trackers
- 🎯 Skill Development Apps
- 🏃 Fitness Trackers
- ✅ Habit Trackers
- ⏰ Time Trackers
- 📝 Journal Apps
- And many more!

### 🛠️ Developer Experience

#### Improved Imports
```typescript
// Components
import {
  PDFReportModal,
  ReportTypeSelector,
  DateRangeSelector,
  // ... more components
} from '@rubixscript/react-native-pdf-report';

// Hooks
import { useReportForm, useReportTypes } from '@rubixscript/react-native-pdf-report';

// Utilities
import {
  formatDate,
  validateDateRange,
  DEFAULT_LABELS,
} from '@rubixscript/react-native-pdf-report';
```

#### Better TypeScript Support
- All components have proper type definitions
- Comprehensive JSDoc comments
- Type-safe utility functions
- No `any` types in public API

### 📈 Performance

- Better memoization with `useMemo` and `useCallback`
- Smaller components re-render less
- Optimized dependency arrays
- Reduced bundle size through tree-shaking potential

### ⚠️ Breaking Changes

None! The API remains backward compatible. Internal refactoring doesn't affect library consumers.

### 🙏 Credits

Thanks to all contributors who made this major release possible!

---

## [1.0.0] - 2024-XX-XX

### Initial Release
- Basic PDF report modal for reading tracking
- Monthly, yearly, and custom reports
- Dark mode support
- Basic customization options

---

## Version History

- **v2.0.0** - Universal tracking library with modular architecture
- **v1.0.0** - Initial reading tracker library
