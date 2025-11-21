/**
 * @component DateRangeSelector
 * @description Component for selecting custom date range
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../../utils/formatters';

interface DateRangeSelectorProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (event: any, date?: Date) => void;
  onEndDateChange: (event: any, date?: Date) => void;
  showStartPicker: boolean;
  showEndPicker: boolean;
  setShowStartPicker: (show: boolean) => void;
  setShowEndPicker: (show: boolean) => void;
  darkMode: boolean;
  primaryColor: string;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  showStartPicker,
  showEndPicker,
  setShowStartPicker,
  setShowEndPicker,
  darkMode,
  primaryColor,
}) => {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
        Date Range
      </Text>

      {/* Start Date */}
      <View style={styles.dateInputContainer}>
        <Text style={[styles.dateLabel, darkMode && styles.darkText]}>
          Start Date
        </Text>
        <TouchableOpacity
          style={[
            styles.dateInput,
            darkMode ? styles.dateInputDark : styles.dateInputLight,
          ]}
          onPress={() => setShowStartPicker(true)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.dateText,
              darkMode && styles.darkText,
              !startDate && styles.dateTextPlaceholder,
            ]}
          >
            {startDate ? formatDate(startDate) : 'Select start date'}
          </Text>
          <Ionicons name="calendar-outline" size={22} color={primaryColor} />
        </TouchableOpacity>
      </View>

      {/* End Date */}
      <View style={styles.dateInputContainer}>
        <Text style={[styles.dateLabel, darkMode && styles.darkText]}>
          End Date
        </Text>
        <TouchableOpacity
          style={[
            styles.dateInput,
            darkMode ? styles.dateInputDark : styles.dateInputLight,
          ]}
          onPress={() => setShowEndPicker(true)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.dateText,
              darkMode && styles.darkText,
              !endDate && styles.dateTextPlaceholder,
            ]}
          >
            {endDate ? formatDate(endDate) : 'Select end date'}
          </Text>
          <Ionicons name="calendar-outline" size={22} color={primaryColor} />
        </TouchableOpacity>
      </View>

      {/* Date Pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={onStartDateChange}
          maximumDate={endDate || new Date()}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={onEndDateChange}
          minimumDate={startDate}
          maximumDate={new Date()}
        />
      )}
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
  dateInputContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 10,
    color: '#000000',
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  dateInputDark: {
    borderColor: '#3a3a3a',
    backgroundColor: '#2a2a2a',
  },
  dateInputLight: {
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  dateText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  dateTextPlaceholder: {
    color: '#999',
    opacity: 0.6,
  },
});
