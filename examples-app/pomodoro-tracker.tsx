/**
 * Example: Pomodoro Tracker App
 * How to use the PDF Report library for a pomodoro/productivity tracking application
 */

import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { PDFReportModal, DataItem, ActivitySession, ReportLabels } from '@rubixscript/react-native-pdf-report';

// Sample data for a pomodoro tracker
const pomodoroData: DataItem[] = [
  {
    id: '1',
    title: 'Complete Project Proposal',
    subtitle: 'Work Project',
    progress: 60,
    total: 10, // total pomodoros planned
    current: 6, // completed pomodoros
    startDate: new Date('2024-03-01'),
    category: 'Work',
    color: '#E74C3C',
  },
  {
    id: '2',
    title: 'Learn React Native',
    subtitle: 'Personal Development',
    progress: 40,
    total: 20,
    current: 8,
    startDate: new Date('2024-02-15'),
    category: 'Learning',
    color: '#3498DB',
  },
];

const pomodoroSessions: ActivitySession[] = [
  {
    id: 's1',
    itemId: '1',
    date: new Date('2024-03-01'),
    duration: 25, // 25 minute pomodoro
    value: 1, // 1 pomodoro completed
    notes: 'Drafted introduction section',
  },
  {
    id: 's2',
    itemId: '1',
    date: new Date('2024-03-01'),
    duration: 25,
    value: 1,
    notes: 'Outlined main points',
  },
  {
    id: 's3',
    itemId: '2',
    date: new Date('2024-03-02'),
    duration: 25,
    value: 1,
    notes: 'Completed navigation tutorial',
  },
];

// Custom labels for pomodoro tracker
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

export default function PomodoroTrackerExample() {
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleGenerateReport = (options: any) => {
    console.log('Generating pomodoro report with options:', options);
    // Here you would implement actual PDF generation logic
  };

  return (
    <View>
      <Button title="Generate Productivity Report" onPress={() => setShowModal(true)} />

      <PDFReportModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        darkMode={darkMode}
        data={pomodoroData}
        sessions={pomodoroSessions}
        userName="Jane Smith"
        onGenerateReport={handleGenerateReport}
        labels={pomodoroLabels}
        primaryColor="#E74C3C"
      />
    </View>
  );
}
