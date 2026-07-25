// src/app/(tabs)/index.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors, globalStyles } from '@/styles/global';
import SearchBar from '@/components/SearchBar';
import { UserFeed } from '@/components/UserFeed';
import { OrgFeed } from '@/components/OrgFeed';

export default function SocialPage() {
  const [type, setType] = useState<'user' | 'org'>('user');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <SearchBar 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
          placeholder={`Buscar ${type === 'user' ? 'usuários' : 'organizações'}...`} 
        />
      </View>

      {/* Botões de Seleção de Abas */}
      <View style={styles.tabButtons}>
        <TouchableOpacity 
          style={[styles.button, type === 'user' && styles.activeButton]} 
          onPress={() => { setType('user'); setSearchQuery(''); }}
        >
          <Text style={[styles.buttonText, type === 'user' && styles.activeButtonText]}>Usuários</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, type === 'org' && styles.activeButton]} 
          onPress={() => { setType('org'); setSearchQuery(''); }}
        >
          <Text style={[styles.buttonText, type === 'org' && styles.activeButtonText]}>Organizações</Text>
        </TouchableOpacity>
      </View>

      {/* Renderização Condicional Limpa dos Feeds Desvinculados */}
      {type === 'user' ? (
        <UserFeed searchQuery={searchQuery} />
      ) : (
        <OrgFeed searchQuery={searchQuery} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
    gap: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.backgroundDarkSecondary,
  },
  activeButton: {
    backgroundColor: colors.orangePrimary,
  },
  buttonText: {
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  activeButtonText: {
    color: '#FFF',
  }
});