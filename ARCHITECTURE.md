# Library Architecture

This document describes the modular architecture of the React Native PDF Report Library.

## Overview

The library follows a modular, component-based architecture that emphasizes:
- **Separation of concerns**: Each component has a single, well-defined responsibility
- **Reusability**: Components can be used independently or together
- **Maintainability**: Small, focused modules are easier to understand and modify
- **Testability**: Isolated components are easier to test
- **Customizability**: Users can customize or replace individual components

## Directory Structure

```
src/
├── components/           # UI Components
│   ├── Modals/
│   │   └── PDFReportModal.tsx        # Main modal component (272 lines)
│   ├── ReportTypeSelector/
│   │   └── ReportTypeSelector.tsx    # Report type selection
│   ├── DateRangeSelector/
│   │   └── DateRangeSelector.tsx     # Date range picker
│   ├── ItemSelector/
│   │   └── ItemSelector.tsx          # Item selection
│   ├── CustomTitleInput/
│   │   └── CustomTitleInput.tsx      # Custom title input
│   ├── ReportOptions/
│   │   └── ReportOptionsToggles.tsx  # Report options toggles
│   ├── ModalHeader/
│   │   └── ModalHeader.tsx           # Modal header
│   ├── ModalFooter/
│   │   └── ModalFooter.tsx           # Modal footer
│   └── index.ts                      # Component exports
├── hooks/                # Custom React Hooks
│   ├── useReportForm.ts              # Form state management
│   ├── useReportTypes.ts             # Report types logic
│   └── index.ts                      # Hook exports
├── utils/                # Utility Functions
│   ├── constants.ts                  # Shared constants
│   ├── formatters.ts                 # Data formatting utilities
│   ├── validators.ts                 # Validation functions
│   └── index.ts                      # Utility exports
├── types/                # TypeScript Types
│   └── index.ts                      # Type definitions
└── index.ts              # Main library export
```

## Component Architecture

### PDFReportModal (Main Component)
**Lines of code**: 272 (reduced from 795)
**Purpose**: Orchestrates all sub-components and manages the modal lifecycle
**Key features**:
- Uses composition to combine smaller components
- Minimal local logic, delegates to hooks and child components
- Easy to understand and modify

### Sub-Components

#### 1. ReportTypeSelector
**Purpose**: Display and select report types
**Props**:
- `reportTypes`: Array of available report type configurations
- `selectedType`: Currently selected report type
- `onSelectType`: Callback when type is selected
- `darkMode`, `primaryColor`: Theming props

#### 2. DateRangeSelector
**Purpose**: Select custom date range for reports
**Props**:
- `startDate`, `endDate`: Selected dates
- `onStartDateChange`, `onEndDateChange`: Date change handlers
- `showStartPicker`, `showEndPicker`: Picker visibility state
- Date picker management props

#### 3. ItemSelector
**Purpose**: Select specific item for detailed report
**Props**:
- `items`: Array of selectable items
- `selectedItemId`: Currently selected item ID
- `onSelectItem`: Selection callback
- `itemLabel`, `itemLabelPlural`: Customizable labels

#### 4. CustomTitleInput
**Purpose**: Input field for custom report title
**Props**:
- `value`: Input value
- `onChangeText`: Text change handler
- `darkMode`: Theme prop

#### 5. ReportOptionsToggles
**Purpose**: Toggle switches for report content options
**Props**:
- `includeCharts`, `includeSessionDetails`, etc.: Toggle states
- `onToggleCharts`, `onToggleSessionDetails`, etc.: Toggle handlers
- `labels`: Customizable option labels

#### 6. ModalHeader
**Purpose**: Modal header with title and close button
**Props**:
- `title`: Header title
- `onClose`: Close handler
- `darkMode`: Theme prop

#### 7. ModalFooter
**Purpose**: Modal footer with action buttons
**Props**:
- `onCancel`, `onGenerate`: Action handlers
- `generating`: Loading state
- `darkMode`, `primaryColor`: Theme props

## Custom Hooks

### useReportForm
**Purpose**: Manage all form state and logic
**Returns**:
- All form state values
- State setters
- `handleGenerateReport`: Form submission handler

**Benefits**:
- Centralizes form logic
- Easy to test independently
- Can be reused in different contexts

### useReportTypes
**Purpose**: Generate report type configurations
**Returns**: Array of report type configurations

**Benefits**:
- Memoizes computed values
- Handles custom vs default report types
- Separates logic from UI

## Utility Functions

### constants.ts
- `DEFAULT_LABELS`: Default UI labels
- `DEFAULT_PRIMARY_COLOR`: Default theme color
- `DEFAULT_FORM_STATE`: Default form values

### formatters.ts
- `formatDate()`: Format dates for display
- `formatDuration()`: Format time durations
- `formatCurrency()`: Format currency values
- `formatPercentage()`: Format percentages

### validators.ts
- `validateDateRange()`: Validate date range selection
- `validateItemSelection()`: Validate item selection

## Data Flow

```
User Interaction
       ↓
  Component Props
       ↓
  Custom Hook (useReportForm)
       ↓
  State Updates
       ↓
  Re-render with new state
       ↓
  onGenerateReport callback
```

## Benefits of Modular Architecture

### 1. Maintainability
- **Before**: 795-line monolithic component
- **After**: 272-line orchestrator + 8 focused sub-components
- Each component < 150 lines, easy to understand

### 2. Testability
- Test each component in isolation
- Mock dependencies easily
- Focused unit tests

### 3. Reusability
- Components can be used outside the modal
- Example: Use `ReportTypeSelector` in a different UI

### 4. Customization
- Replace individual components
- Override specific behaviors
- Extend functionality without touching core code

### 5. Performance
- Smaller components re-render less
- Better memoization opportunities
- Code splitting possibilities

## Extending the Library

### Adding a New Component

1. Create component directory:
```
src/components/NewComponent/
└── NewComponent.tsx
```

2. Define clear props interface:
```typescript
interface NewComponentProps {
  // Props definition
}
```

3. Export from component index:
```typescript
// src/components/index.ts
export { NewComponent } from './NewComponent/NewComponent';
```

### Adding a New Hook

1. Create hook file:
```
src/hooks/useNewHook.ts
```

2. Follow hook naming convention: `use[Name]`

3. Export from hooks index:
```typescript
// src/hooks/index.ts
export * from './useNewHook';
```

### Adding Utility Functions

1. Determine category (constants, formatters, validators, or new)

2. Add function to appropriate file

3. Export from utils index

## Best Practices

1. **Single Responsibility**: Each component does one thing well
2. **Props Interface**: Always define TypeScript interfaces for props
3. **Composition over Inheritance**: Compose components rather than extend
4. **Memoization**: Use `useMemo` and `useCallback` for expensive operations
5. **Prop Drilling**: Avoid excessive prop drilling; use context if needed
6. **Naming**: Use clear, descriptive names
7. **Documentation**: Document component purpose and props

## Performance Considerations

- Components use `React.memo` where appropriate
- Expensive computations are memoized
- Event handlers use `useCallback`
- Minimal re-renders through proper dependency arrays

## Future Enhancements

Potential areas for future modularization:
1. **PDF Generation Module**: Separate PDF generation logic
2. **Theme System**: Dedicated theming module
3. **Chart Components**: Modular chart components
4. **Analytics Module**: Tracking and analytics
5. **Export Formats**: Support for multiple export formats

## Migration Guide

### From v1.x to v2.x (Modular)

The API remains the same for end users. Internally:
- Monolithic component → Modular components
- Inline logic → Custom hooks
- Magic strings → Constants
- Ad-hoc validation → Validator functions

No breaking changes for library consumers!

## Testing Strategy

1. **Unit Tests**: Test each component independently
2. **Integration Tests**: Test component interactions
3. **Hook Tests**: Use `@testing-library/react-hooks`
4. **Visual Tests**: Snapshot testing for UI components
5. **E2E Tests**: Full user flow testing

## Contributing

When contributing:
1. Follow the modular architecture
2. Keep components small and focused
3. Add TypeScript types for all props
4. Document new components
5. Write tests for new functionality
6. Update this architecture document if needed
