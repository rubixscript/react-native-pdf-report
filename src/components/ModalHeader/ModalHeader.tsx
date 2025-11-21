/**
 * @component ModalHeader
 * @description Modal header with title and close button
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  darkMode: boolean;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  onClose,
  darkMode,
}) => {
  return (
    <View style={[styles.header, darkMode && styles.headerDark]}>
      <Text style={[styles.title, darkMode && styles.darkText]}>
        📄 {title}
      </Text>
      <TouchableOpacity style={[styles.closeButton, darkMode && styles.closeButtonDark]} onPress={onClose}>
        <Ionicons
          name="close"
          size={22}
          color={darkMode ? '#ffffff' : '#000000'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerDark: {
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.3,
  },
  darkText: {
    color: '#ffffff',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
