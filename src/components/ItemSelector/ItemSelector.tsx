/**
 * @component ItemSelector
 * @description Component for selecting an item for detailed report
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DataItem } from '../../types';

interface ItemSelectorProps {
  items: DataItem[];
  selectedItemId?: string;
  onSelectItem: (itemId: string) => void;
  itemLabel: string;
  itemLabelPlural: string;
  darkMode: boolean;
  primaryColor: string;
}

export const ItemSelector: React.FC<ItemSelectorProps> = ({
  items,
  selectedItemId,
  onSelectItem,
  itemLabel,
  itemLabelPlural,
  darkMode,
  primaryColor,
}) => {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
        Select {itemLabel}
      </Text>
      <View style={styles.itemSelection}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.itemOption,
              darkMode ? styles.itemOptionDark : styles.itemOptionLight,
              selectedItemId === item.id && {
                ...styles.selectedItem,
                borderColor: primaryColor,
                backgroundColor: `${primaryColor}15`,
              },
            ]}
            onPress={() => onSelectItem(item.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.itemTitle, darkMode && styles.darkText]}>
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={[styles.itemSubtitle, darkMode && styles.darkSubtitleText]}>
                {item.subtitle}
              </Text>
            )}
          </TouchableOpacity>
        ))}
        {items.length === 0 && (
          <Text
            style={[
              styles.itemSubtitle,
              darkMode && styles.darkSubtitleText,
              styles.emptyText,
            ]}
          >
            No {itemLabelPlural.toLowerCase()} with sessions found
          </Text>
        )}
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
  darkSubtitleText: {
    color: '#aaa',
  },
  itemSelection: {
    gap: 10,
  },
  itemOption: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  itemOptionDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#3a3a3a',
  },
  itemOptionLight: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e0e0e0',
  },
  selectedItem: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF15',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
  },
});
