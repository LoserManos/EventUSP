// src/components/UserOverlayModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';

interface UserOverlayModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function UserOverlayModal({ visible, onClose, title, children }: UserOverlayModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textPrimaryDark} />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    maxHeight: height * 0.7,
    backgroundColor: colors.backgroundDark,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.backgroundDarkSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundDarkSecondary,
    paddingBottom: 8,
  },
  title: {
    color: colors.textPrimaryDark,
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 1,
  },
});