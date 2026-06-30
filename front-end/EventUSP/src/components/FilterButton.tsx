import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/styles/global';

interface FilterButtonProps {
  onPress: () => void;
  isActive: boolean;
}

export default function FilterButton({ onPress, isActive }: FilterButtonProps) {
  return (
    <Pressable 
      style={[styles.filterButton, isActive && styles.filterButtonActive]}
      onPress={onPress}
    >
      <Feather 
        name="sliders" 
        size={20} 
        color={isActive ? colors.orangePrimary : colors.orangeSecondary} 
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.backgroundDark,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.orangeSecondary,
  }
});