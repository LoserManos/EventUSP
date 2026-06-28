import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/global';

// Definindo as propriedades que o componente aceita
interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string; // Opcional, caso queira mudar o texto padrão em outras páginas
}

export default function SearchBar({ value, onChangeText, placeholder = "Buscar..." }: SearchBarProps) {
  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color={colors.orangePrimary} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 8,
    borderWidth: 0,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    color: colors.textPrimaryDark,
    flex: 1,
    height: 48,
    fontSize: 16,
  },
});