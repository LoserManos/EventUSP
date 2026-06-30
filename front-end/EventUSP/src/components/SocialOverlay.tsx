import React from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Text, FlatList } from 'react-native';
import { colors, globalStyles } from '@/styles/global';
import { SocialFeed } from './SocialFeed';

export function SocialOverlay({ visible, onClose, title, data, renderItem, onEndReached, loading }: any) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlayBackground} />
      </TouchableWithoutFeedback>
      
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={globalStyles.sectionTitle}>{title}</Text>
          
          <SocialFeed
            data={data}
            renderItem={renderItem}
            onEndReached={onEndReached}
            loading={loading}
          />
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlayBackground: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.3)' 
  },
  // Faz o container ocupar a tela toda para alinhar o conteúdo no centro
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // O container menor, centralizado
  modalContent: {
    width: '90%',        // Define a largura menor que a tela
    maxHeight: '70%',    // Define a altura máxima
    backgroundColor: colors.backgroundDark,
    borderRadius: 20,
    padding: 20,
  },
  innerContent: { 
    flexGrow: 1 
  }
});