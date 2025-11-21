/**
 * Example: Skill Tracker App
 * How to use the PDF Report library for a skill tracking/learning application
 */

import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { PDFReportModal, DataItem, ActivitySession, ReportLabels, ReportTypeConfig } from '@rubixscript/react-native-pdf-report';

// Sample data for skill tracker
const skills: DataItem[] = [
  {
    id: '1',
    title: 'JavaScript',
    subtitle: 'Programming Language',
    progress: 75,
    total: 100, // skill level out of 100
    current: 75,
    startDate: new Date('2023-06-01'),
    category: 'Programming',
    color: '#F7DF1E',
    metadata: {
      level: 'Advanced',
      hoursInvested: 250,
    },
  },
  {
    id: '2',
    title: 'React Native',
    subtitle: 'Mobile Development',
    progress: 60,
    total: 100,
    current: 60,
    startDate: new Date('2023-09-01'),
    category: 'Mobile Development',
    color: '#61DAFB',
    metadata: {
      level: 'Intermediate',
      hoursInvested: 150,
    },
  },
  {
    id: '3',
    title: 'UI/UX Design',
    subtitle: 'Design Skills',
    progress: 45,
    total: 100,
    current: 45,
    startDate: new Date('2024-01-01'),
    category: 'Design',
    color: '#FF6B6B',
    metadata: {
      level: 'Beginner',
      hoursInvested: 80,
    },
  },
];

const practiceSessionsData: ActivitySession[] = [
  {
    id: 'p1',
    itemId: '1',
    date: new Date('2024-03-01'),
    duration: 120, // 2 hours
    value: 5, // skill points gained
    notes: 'Completed advanced async/await patterns course',
  },
  {
    id: 'p2',
    itemId: '2',
    date: new Date('2024-03-02'),
    duration: 90,
    value: 3,
    notes: 'Built a navigation system with React Navigation',
  },
  {
    id: 'p3',
    itemId: '3',
    date: new Date('2024-03-03'),
    duration: 60,
    value: 2,
    notes: 'Learned color theory and typography basics',
  },
];

// Custom labels for skill tracker
const skillLabels: ReportLabels = {
  itemLabel: 'Skill',
  itemLabelPlural: 'Skills',
  sessionLabel: 'Practice Session',
  sessionLabelPlural: 'Practice Sessions',
  reportTitle: 'Skill Development Report',
  summaryLabel: 'Learning Summary',
  progressLabel: 'Skill Points Earned',
  durationLabel: 'Practice Time',
  totalLabel: 'Total Skills',
};

// Custom report types for skill tracking
const skillReportTypes: ReportTypeConfig[] = [
  {
    type: 'summary',
    title: '🎯 Overall Progress',
    description: 'All-time learning statistics and milestones',
    icon: '🎯',
  },
  {
    type: 'monthly',
    title: '📅 Monthly Review',
    description: 'This month\'s practice sessions and improvements',
    icon: '📅',
  },
  {
    type: 'yearly',
    title: '📆 Annual Report',
    description: 'Year-long skill development journey',
    icon: '📆',
  },
  {
    type: 'custom',
    title: '📊 Custom Period',
    description: 'Select specific date range for analysis',
    icon: '📊',
  },
  {
    type: 'item-details',
    title: '🎓 Skill Deep-Dive',
    description: 'Detailed analysis of a specific skill',
    icon: '🎓',
  },
];

export default function SkillTrackerExample() {
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleGenerateReport = (options: any) => {
    console.log('Generating skill development report with options:', options);
    // Here you would implement actual PDF generation logic
    // Could include:
    // - Skill progression charts
    // - Practice time graphs
    // - Achievement badges
    // - Learning path recommendations
  };

  return (
    <View>
      <Button title="Generate Skill Report" onPress={() => setShowModal(true)} />

      <PDFReportModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        darkMode={darkMode}
        data={skills}
        sessions={practiceSessionsData}
        userName="Sarah Williams"
        onGenerateReport={handleGenerateReport}
        labels={skillLabels}
        reportTypes={skillReportTypes}
        primaryColor="#8B5CF6"
        accentColor="#EC4899"
      />
    </View>
  );
}
