/**
 * @component SuccessModal
 * @description A beautiful success modal shown after report generation with share and download options
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onShare: () => void;
  onDownload: () => void;
  darkMode: boolean;
  primaryColor: string;
  reportTitle?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  onShare,
  onDownload,
  darkMode,
  primaryColor,
  reportTitle = 'Report',
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, darkMode && styles.containerDark]}>
          {/* Success Icon */}
          <View style={[styles.iconContainer, { backgroundColor: `${primaryColor}15` }]}>
            <View style={[styles.iconCircle, { backgroundColor: primaryColor }]}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={[styles.title, darkMode && styles.titleDark]}>
            Report Generated!
          </Text>

          {/* Subtitle */}
          <Text style={[styles.subtitle, darkMode && styles.subtitleDark]}>
            Your {reportTitle} has been generated successfully.
          </Text>

          {/* Report Details Card */}
          <View style={[styles.detailsCard, darkMode && styles.detailsCardDark]}>
            <View style={styles.detailRow}>
              <View style={[styles.detailDot, { backgroundColor: primaryColor }]} />
              <Text style={[styles.detailText, darkMode && styles.detailTextDark]}>
                High-quality PDF format
              </Text>
            </View>
            <View style={styles.detailRow}>
              <View style={[styles.detailDot, { backgroundColor: primaryColor }]} />
              <Text style={[styles.detailText, darkMode && styles.detailTextDark]}>
                Ready to share or download
              </Text>
            </View>
            <View style={styles.detailRow}>
              <View style={[styles.detailDot, { backgroundColor: primaryColor }]} />
              <Text style={[styles.detailText, darkMode && styles.detailTextDark]}>
                Includes all selected data
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, darkMode && styles.actionButtonDark]}
              onPress={onDownload}
              activeOpacity={0.8}
            >
              <View style={[styles.buttonIcon, { backgroundColor: `${primaryColor}20` }]}>
                <Text style={styles.buttonIconText}>↓</Text>
              </View>
              <Text style={[styles.actionButtonText, darkMode && styles.actionButtonTextDark]}>
                Download
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton, { backgroundColor: primaryColor }]}
              onPress={onShare}
              activeOpacity={0.8}
            >
              <View style={[styles.buttonIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Text style={[styles.buttonIconText, styles.buttonIconTextWhite]}>↑</Text>
              </View>
              <Text style={[styles.actionButtonText, styles.primaryButtonText]}>
                Share
              </Text>
            </TouchableOpacity>
          </View>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.closeButtonText, darkMode && styles.closeButtonTextDark]}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  titleDark: {
    color: '#fff',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
    lineHeight: 22,
  },
  subtitleDark: {
    color: '#999',
  },
  detailsCard: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  detailsCardDark: {
    backgroundColor: '#2a2a2a',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  detailTextDark: {
    color: '#aaa',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    marginRight: 12,
  },
  actionButtonDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#3a3a3a',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderColor: 'transparent',
    marginRight: 0,
    marginLeft: 12,
  },
  buttonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonIconText: {
    fontSize: 20,
    color: '#007AFF',
  },
  buttonIconTextWhite: {
    color: '#ffffff',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  actionButtonTextDark: {
    color: '#fff',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  closeButton: {
    padding: 12,
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#999',
  },
  closeButtonTextDark: {
    color: '#666',
  },
});
