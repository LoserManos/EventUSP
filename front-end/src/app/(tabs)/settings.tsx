// src/app/settings/index.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { colors, globalStyles } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { signOut } = useAuth(); // Extrai a função de logout do AuthContext[cite: 7]

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Configurações</Text>

      <View style={styles.section}>
        {/* Opção de Sair da Conta */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={signOut} 
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 12,
    overflow: 'hidden',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
});