/**
 * Example: Expense Tracker App
 * How to use the PDF Report library for an expense tracking application
 */

import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { PDFReportModal, DataItem, ActivitySession, ReportLabels } from '@rubixscript/react-native-pdf-report';

// Sample data for expense tracker
const expenseCategories: DataItem[] = [
  {
    id: '1',
    title: 'Groceries',
    subtitle: 'Food & Beverages',
    progress: 75, // 75% of budget used
    total: 500, // budget
    current: 375, // spent so far
    startDate: new Date('2024-03-01'),
    category: 'Food',
    color: '#2ECC71',
  },
  {
    id: '2',
    title: 'Transportation',
    subtitle: 'Gas & Public Transit',
    progress: 60,
    total: 200,
    current: 120,
    startDate: new Date('2024-03-01'),
    category: 'Transport',
    color: '#F39C12',
  },
  {
    id: '3',
    title: 'Entertainment',
    subtitle: 'Movies, Games, etc.',
    progress: 30,
    total: 150,
    current: 45,
    startDate: new Date('2024-03-01'),
    category: 'Fun',
    color: '#9B59B6',
  },
];

const expenses: ActivitySession[] = [
  {
    id: 'e1',
    itemId: '1',
    date: new Date('2024-03-05'),
    value: 85.50, // expense amount
    notes: 'Weekly grocery shopping at Walmart',
  },
  {
    id: 'e2',
    itemId: '1',
    date: new Date('2024-03-08'),
    value: 45.00,
    notes: 'Fresh produce from farmers market',
  },
  {
    id: 'e3',
    itemId: '2',
    date: new Date('2024-03-06'),
    value: 50.00,
    notes: 'Gas fill-up',
  },
  {
    id: 'e4',
    itemId: '3',
    date: new Date('2024-03-10'),
    value: 25.00,
    notes: 'Movie tickets',
  },
];

// Custom labels for expense tracker
const expenseLabels: ReportLabels = {
  itemLabel: 'Category',
  itemLabelPlural: 'Categories',
  sessionLabel: 'Transaction',
  sessionLabelPlural: 'Transactions',
  reportTitle: 'Expense Report',
  summaryLabel: 'Financial Summary',
  progressLabel: 'Amount Spent',
  durationLabel: 'Time Period',
  totalLabel: 'Total Categories',
};

export default function ExpenseTrackerExample() {
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // expense apps often use dark mode

  const handleGenerateReport = (options: any) => {
    console.log('Generating expense report with options:', options);
    // Here you would implement actual PDF generation logic
    // Could include charts showing spending by category, trends over time, etc.
  };

  return (
    <View>
      <Button title="Generate Expense Report" onPress={() => setShowModal(true)} />

      <PDFReportModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        darkMode={darkMode}
        data={expenseCategories}
        sessions={expenses}
        userName="Alex Johnson"
        onGenerateReport={handleGenerateReport}
        labels={expenseLabels}
        primaryColor="#2ECC71"
      />
    </View>
  );
}
