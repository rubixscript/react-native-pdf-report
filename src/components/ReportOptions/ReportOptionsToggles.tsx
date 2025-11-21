/**
 * @component ReportOptionsToggles
 * @description Component for toggling report content options
 */

import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { ReportLabels } from '../../types';

interface ReportOptionsTogglesProps {
  includeCharts: boolean;
  includeSessionDetails: boolean;
  includeItemDetails: boolean;
  includeAchievements: boolean;
  onToggleCharts: (value: boolean) => void;
  onToggleSessionDetails: (value: boolean) => void;
  onToggleItemDetails: (value: boolean) => void;
  onToggleAchievements: (value: boolean) => void;
  labels: ReportLabels;
  darkMode: boolean;
  primaryColor: string;
}

export const ReportOptionsToggles: React.FC<ReportOptionsTogglesProps> = ({
  includeCharts,
  includeSessionDetails,
  includeItemDetails,
  includeAchievements,
  onToggleCharts,
  onToggleSessionDetails,
  onToggleItemDetails,
  onToggleAchievements,
  labels,
  darkMode,
  primaryColor,
}) => {
  const trackColor = {
    false: darkMode ? '#3a3a3a' : '#ddd',
    true: primaryColor,
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
        Include in Report
      </Text>

      {/* Charts & Graphs */}
      <View style={[styles.optionRow, darkMode && styles.optionRowDark]}>
        <View style={styles.optionContent}>
          <Text style={[styles.optionLabel, darkMode && styles.darkText]}>
            📊 Charts & Graphs
          </Text>
          <Text style={[styles.optionDescription, darkMode && styles.darkDescriptionText]}>
            Visual representations of progress and trends
          </Text>
        </View>
        <Switch
          value={includeCharts}
          onValueChange={onToggleCharts}
          trackColor={trackColor}
          thumbColor="#fff"
          ios_backgroundColor={trackColor.false}
        />
      </View>

      {/* Session Details */}
      <View style={[styles.optionRow, darkMode && styles.optionRowDark]}>
        <View style={styles.optionContent}>
          <Text style={[styles.optionLabel, darkMode && styles.darkText]}>
            📝 {labels.sessionLabel} Details
          </Text>
          <Text style={[styles.optionDescription, darkMode && styles.darkDescriptionText]}>
            Individual {labels.sessionLabel?.toLowerCase()} information
          </Text>
        </View>
        <Switch
          value={includeSessionDetails}
          onValueChange={onToggleSessionDetails}
          trackColor={trackColor}
          thumbColor="#fff"
          ios_backgroundColor={trackColor.false}
        />
      </View>

      {/* Item Details */}
      <View style={[styles.optionRow, darkMode && styles.optionRowDark]}>
        <View style={styles.optionContent}>
          <Text style={[styles.optionLabel, darkMode && styles.darkText]}>
            📚 {labels.itemLabel} Details
          </Text>
          <Text style={[styles.optionDescription, darkMode && styles.darkDescriptionText]}>
            Information about {labels.itemLabelPlural?.toLowerCase()}
          </Text>
        </View>
        <Switch
          value={includeItemDetails}
          onValueChange={onToggleItemDetails}
          trackColor={trackColor}
          thumbColor="#fff"
          ios_backgroundColor={trackColor.false}
        />
      </View>

      {/* Achievements */}
      <View style={[styles.optionRow, darkMode && styles.optionRowDark]}>
        <View style={styles.optionContent}>
          <Text style={[styles.optionLabel, darkMode && styles.darkText]}>
            🏆 Achievements
          </Text>
          <Text style={[styles.optionDescription, darkMode && styles.darkDescriptionText]}>
            Milestones and accomplishments
          </Text>
        </View>
        <Switch
          value={includeAchievements}
          onValueChange={onToggleAchievements}
          trackColor={trackColor}
          thumbColor="#fff"
          ios_backgroundColor={trackColor.false}
        />
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
  darkDescriptionText: {
    color: '#aaa',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  optionRowDark: {
    backgroundColor: '#2a2a2a',
  },
  optionContent: {
    flex: 1,
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});
