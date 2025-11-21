/**
 * @component ReportTypeSelector
 * @description Component for selecting report type
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ReportType, ReportTypeConfig } from '../../types';

interface ReportTypeSelectorProps {
  reportTypes: ReportTypeConfig[];
  selectedType: ReportType;
  onSelectType: (type: ReportType) => void;
  darkMode: boolean;
  primaryColor: string;
}

export const ReportTypeSelector: React.FC<ReportTypeSelectorProps> = ({
  reportTypes,
  selectedType,
  onSelectType,
  darkMode,
  primaryColor,
}) => {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
        Report Type
      </Text>
      <View style={styles.reportTypeGrid}>
        {reportTypes.map(({ type, title, description, icon }) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.reportTypeCard,
              selectedType === type
                ? { ...styles.selectedReportType, borderColor: primaryColor, backgroundColor: `${primaryColor}20` }
                : darkMode
                ? styles.unselectedReportTypeDark
                : styles.unselectedReportTypeLight
            ]}
            onPress={() => onSelectType(type)}
            activeOpacity={0.7}
          >
            <View style={styles.reportTypeContent}>
              {icon && <Text style={styles.reportTypeIcon}>{icon}</Text>}
              <View style={styles.reportTypeTextContainer}>
                <Text
                  style={[
                    styles.reportTypeTitle,
                    {
                      color:
                        selectedType === type
                          ? primaryColor
                          : darkMode
                          ? '#ffffff'
                          : '#000000',
                    },
                  ]}
                >
                  {title}
                </Text>
                <Text
                  style={[
                    styles.reportTypeDescription,
                    {
                      color:
                        selectedType === type
                          ? darkMode
                            ? '#ddd'
                            : '#333'
                          : darkMode
                          ? '#aaa'
                          : '#666',
                    },
                  ]}
                >
                  {description}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
