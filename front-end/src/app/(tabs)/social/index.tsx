// src/app/(tabs)/index.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { globalStyles } from '@/styles/global';
import SearchBar from '@/components/SearchBar';
import { UserFeed } from '@/components/UserFeed';
import { OrgFeed } from '@/components/OrgFeed';

export default function SocialPage() {
  const [type, setType] = useState<'user' | 'org'>('user');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Explorar</Text>
      <View style={globalStyles.header}>
        <SearchBar 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
          placeholder={`Buscar ${type === 'user' ? 'usuários' : 'organizações'}...`} 
        />
      </View>

      {/* Botões de Seleção de Abas */}
      <View style={styles.tabsContainer}>
        <View style={styles.segmentedControl}>
          <TouchableOpacity 
            style={[styles.tabButton, type === 'user' && styles.tabButtonActive]}
            onPress={() => { setType('user'); setSearchQuery(''); }}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, type === 'user' && styles.tabTextActive]}>Pessoas</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, type === 'org' && styles.tabButtonActive]}
            onPress={() => { setType('org'); setSearchQuery(''); }}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, type === 'org' && styles.tabTextActive]}>Organizadores</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Renderização Condicional dos Feeds */}
      {type === 'user' ? (
        <UserFeed searchQuery={searchQuery} />
      ) : (
        <OrgFeed searchQuery={searchQuery} />
      )}
    </View>
  );
}

import { StyleSheet } from 'react-native';
import { colors } from '@/styles/global';

const styles = StyleSheet.create({
  tabsContainer: {
    marginVertical: 12,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 16,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: colors.backgroundDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.orangePrimary,
  },
});