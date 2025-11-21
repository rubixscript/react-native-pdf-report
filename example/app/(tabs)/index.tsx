import { Image } from 'expo-image';
import { Platform, StyleSheet, Alert, Share } from 'react-native';
import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { PDFReportModal, Book, ReadingSession, ReportOptions } from '@rubixscript/react-native-pdf-report';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

// Sample data for demonstration
const sampleBooks: Book[] = [
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

const sampleReadingSessions: ReadingSession[] = [
  {
    id: '1',
    bookId: '1',
    date: '2024-01-14',
    startPage: 170,
    endPage: 180,
    duration: 45,
    notes: 'Finished the book! Great ending.',
    imageUrl: null,
  },
  {
    id: '2',
    bookId: '2',
    date: '2024-02-05',
    startPage: 140,
    endPage: 156,
    duration: 30,
    notes: 'The plot is getting intense',
    ocrText: 'The Ministry of Truth...',
  },
  {
    id: '3',
    bookId: '3',
    date: '2024-02-09',
    startPage: 270,
    endPage: 281,
    duration: 25,
    notes: 'Emotional ending to a beautiful story',
  },
];

export default function HomeScreen() {
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleGenerateReport = async (options: ReportOptions) => {
    try {
      // Here you would typically integrate with a PDF generation service
      // For now, we'll simulate the process and create a simple report info
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
    <ThemedView style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Reading Report Demo</ThemedText>
          <HelloWave />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Reading Report Generation</ThemedText>
          <ThemedText>
            This demo showcases reading report generation using{' '}
            <ThemedText type="defaultSemiBold">@rubixscript/react-native-pdf-report</ThemedText> library.
          </ThemedText>
          <Link href="#" onPress={() => setShowModal(true)}>
            <ThemedText type="defaultSemiBold" style={styles.linkText}>
              📄 Create Reading Report
            </ThemedText>
          </Link>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Sample Reading Data</ThemedText>
          <ThemedText>
            This demo includes sample reading data:
          </ThemedText>
          <ThemedText style={styles.featureList}>
            • {sampleBooks.length} books in library
          </ThemedText>
          <ThemedText style={styles.featureList}>
            • {sampleReadingSessions.length} reading sessions
          </ThemedText>
          <ThemedText style={styles.featureList}>
            • Multiple report types (summary, monthly, yearly, custom, book details)
          </ThemedText>
          <ThemedText style={styles.featureList}>
            • Customizable report content options
          </ThemedText>
          <ThemedText style={styles.featureList}>
            • Date range selection for custom reports
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">How to Use</ThemedText>
          <ThemedText>
            1. Tap "Create Reading Report" to open the modal
          </ThemedText>
          <ThemedText>
            2. Select your desired report type
          </ThemedText>
          <ThemedText>
            3. Customize the report content options
          </ThemedText>
          <ThemedText>
            4. Generate and share your reading report
          </ThemedText>
        </ThemedView>
      </ParallaxScrollView>

      {/* PDF Report Modal */}
      <PDFReportModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        darkMode={darkMode}
        books={sampleBooks}
        readingSessions={sampleReadingSessions}
        userName="Demo User"
        onGenerateReport={handleGenerateReport}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  linkText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  featureList: {
    marginLeft: 16,
    marginVertical: 2,
  },
});
