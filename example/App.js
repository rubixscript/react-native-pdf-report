import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Share } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PDFReportModal } from '../src';

// Sample data for demonstration
const sampleBooks = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    totalPages: 180,
    currentPage: 180,
    startDate: '2024-01-01',
    completedDate: '2024-01-15',
    notes: ['Beautiful writing style', 'Great character development'],
    category: 'Fiction',
    color: '#007AFF',
    lastReadText: 'So we beat on, boats against the current...',
    isPinned: true,
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    totalPages: 328,
    currentPage: 156,
    startDate: '2024-02-01',
    notes: ['Thought-provoking', 'Relevant today'],
    category: 'Dystopian Fiction',
    color: '#FF3B30',
  },
  {
    id: '3',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    totalPages: 281,
    currentPage: 281,
    startDate: '2024-01-20',
    completedDate: '2024-02-10',
    notes: ['Powerful themes', 'Great for discussion'],
    category: 'Classic Literature',
    color: '#34C759',
  },
];

const sampleReadingSessions = [
  {
    id: '1',
    itemId: '1',
    date: '2024-01-14',
    startPage: 170,
    endPage: 180,
    duration: 45,
    notes: 'Finished the book! Great ending.',
    imageUrl: null,
  },
  {
    id: '2',
    itemId: '2',
    date: '2024-02-05',
    startPage: 140,
    endPage: 156,
    duration: 30,
    notes: 'The plot is getting intense',
    ocrText: 'The Ministry of Truth...',
  },
  {
    id: '3',
    itemId: '3',
    date: '2024-02-09',
    startPage: 270,
    endPage: 281,
    duration: 25,
    notes: 'Emotional ending to a beautiful story',
  },
];

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleGenerateReport = async (options) => {
    try {
      const reportInfo = {
        type: options.type,
        title: options.customTitle || `${options.type} Reading Report`,
        includeCharts: options.includeCharts,
        includeBookDetails: options.includeBookDetails,
        includeSessionDetails: options.includeSessionDetails,
        includeAchievements: options.includeAchievements,
        generatedAt: new Date().toISOString(),
        booksCount: sampleBooks.length,
        sessionsCount: sampleReadingSessions.length,
      };

      // Simulate PDF generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Report Generated Successfully!',
        `Report Type: ${reportInfo.type}\nBooks: ${reportInfo.booksCount}\nReading Sessions: ${reportInfo.sessionsCount}`,
        [
          {
            text: 'OK',
            onPress: () => console.log('Report info:', reportInfo),
          },
          {
            text: 'Share Report Info',
            onPress: async () => {
              try {
                await Share.share({
                  title: reportInfo.title,
                  message: `Reading Report: ${reportInfo.title}\nType: ${reportInfo.type}\nGenerated: ${new Date(reportInfo.generatedAt).toLocaleDateString()}`,
                });
              } catch (error) {
                console.error('Error sharing report info:', error);
                Alert.alert('Error', 'Failed to share report info');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'Failed to generate reading report');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>RubixScript PDF Report</Text>
        <Text style={styles.subtitle}>Reading Report Generation Demo</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Sample Data:</Text>
          <Text style={styles.infoItem}>• {sampleBooks.length} books</Text>
          <Text style={styles.infoItem}>• {sampleReadingSessions.length} reading sessions</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.buttonText}>Generate PDF Report</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => setDarkMode(!darkMode)}
        >
          <Text style={styles.secondaryButtonText}>
            Toggle Theme ({darkMode ? 'Dark' : 'Light'})
          </Text>
        </TouchableOpacity>
      </View>

      <PDFReportModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        darkMode={darkMode}
        data={sampleBooks}
        sessions={sampleReadingSessions}
        userName="Demo User"
        onGenerateReport={handleGenerateReport}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  infoItem: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    marginVertical: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
    maxWidth: 400,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
