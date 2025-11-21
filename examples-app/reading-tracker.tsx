/**
 * Example: Reading Tracker App
 * How to use the PDF Report library for a reading tracking application
 */

import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { PDFReportModal, DataItem, ActivitySession, ReportLabels } from '@rubixscript/react-native-pdf-report';

// Sample data for a reading tracker
const readingData: DataItem[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    subtitle: 'F. Scott Fitzgerald',
    progress: 75,
    total: 180,
    current: 135,
    startDate: new Date('2024-01-01'),
    category: 'Fiction',
    color: '#FF6B6B',
  },
  {
    id: '2',
    title: '1984',
    subtitle: 'George Orwell',
    progress: 100,
    total: 328,
    current: 328,
    startDate: new Date('2024-01-15'),
    completedDate: new Date('2024-02-20'),
    category: 'Dystopian',
    color: '#4ECDC4',
  },
];

const readingSessions: ActivitySession[] = [
  {
    id: 's1',
    itemId: '1',
    date: new Date('2024-03-01'),
    startValue: 1,
    endValue: 45,
    duration: 60,
    notes: 'Great start to the book!',
  },
  {
    id: 's2',
    itemId: '1',
    date: new Date('2024-03-02'),
    startValue: 45,
    endValue: 90,
    duration: 75,
  },
];

// Custom labels for reading tracker
const readingLabels: ReportLabels = {
  itemLabel: 'Book',
  itemLabelPlural: 'Books',
  sessionLabel: 'Reading Session',
  sessionLabelPlural: 'Reading Sessions',
  reportTitle: 'Reading Report',
  summaryLabel: 'Reading Summary',
  progressLabel: 'Pages Read',
  durationLabel: 'Reading Time',
  totalLabel: 'Total Books',
};

export default function ReadingTrackerExample() {
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleGenerateReport = (options: any) => {
    console.log('Generating reading report with options:', options);
    // Here you would implement actual PDF generation logic
  };

  return (
    <View>
      <Button title="Generate Reading Report" onPress={() => setShowModal(true)} />

      <PDFReportModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        darkMode={darkMode}
        data={readingData}
        sessions={readingSessions}
        userName="John Doe"
        onGenerateReport={handleGenerateReport}
        labels={readingLabels}
        primaryColor="#FF6B6B"
      />
    </View>
  );
}
