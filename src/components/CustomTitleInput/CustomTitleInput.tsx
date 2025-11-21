/**
 * @component CustomTitleInput
 * @description Component for entering custom report title
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface CustomTitleInputProps {
  value: string;
  onChangeText: (text: string) => void;
  darkMode: boolean;
}

export const CustomTitleInput: React.FC<CustomTitleInputProps> = ({
  value,
  onChangeText,
  darkMode,
}) => {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
        Custom Title (Optional)
      </Text>
      <Text
        style={[
          styles.optionDescription,
          darkMode && styles.darkDescriptionText,
          styles.descriptionSpacing,
        ]}
      >
        Add a personalized title to your report
      </Text>
      <TextInput
        style={[
          styles.customInput,
          darkMode ? styles.customInputDark : styles.customInputLight,
        ]}
        placeholder="Enter custom report title..."
        placeholderTextColor={darkMode ? '#666' : '#999'}
        value={value}
        onChangeText={onChangeText}
      />
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
  optionDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  descriptionSpacing: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  customInput: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 16,
    fontWeight: '500',
  },
  customInputDark: {
    borderColor: '#3a3a3a',
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
  },
  customInputLight: {
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    color: '#000000',
  },
});
