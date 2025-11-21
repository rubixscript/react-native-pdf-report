/**
 * @component ModalFooter
 * @description Modal footer with action buttons
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ModalFooterProps {
  onCancel: () => void;
  onGenerate: () => void;
  generating: boolean;
  darkMode: boolean;
  primaryColor: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  onCancel,
  onGenerate,
  generating,
  darkMode,
  primaryColor,
}) => {
  return (
    <View style={[styles.footer, darkMode && styles.footerDark]}>
      <TouchableOpacity
        style={[
          styles.button,
          styles.cancelButton,
          darkMode ? styles.cancelButtonDark : styles.cancelButtonLight,
        ]}
        onPress={onCancel}
        disabled={generating}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.buttonText,
            darkMode ? styles.cancelButtonTextDark : styles.cancelButtonTextLight,
          ]}
        >
          Cancel
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: primaryColor },
          generating && styles.disabledButton,
        ]}
        onPress={onGenerate}
        disabled={generating}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, styles.generateButtonText]}>
          {generating ? 'Generating...' : 'Generate Report'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  footerDark: {
    borderTopColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  cancelButton: {
    borderWidth: 1.5,
  },
  cancelButtonLight: {
    backgroundColor: '#f0f0f0',
    borderColor: '#e0e0e0',
  },
  cancelButtonDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#3a3a3a',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  cancelButtonTextLight: {
    color: '#000000',
  },
  cancelButtonTextDark: {
    color: '#ffffff',
  },
  generateButtonText: {
    color: '#ffffff',
  },
});
