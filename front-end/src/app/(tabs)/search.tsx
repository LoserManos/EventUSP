import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { colors, globalStyles } from '@/styles/global';

import SearchBar from '@/components/SearchBar';
import EventFeed from '@/components/EventFeed';
import { EventFilters } from '@/services/eventService';

const CATEGORIES = [
  { label: 'Tudo', value: null },
  { label: 'Festa', value: 'party' },
  { label: 'Esporte', value: 'sport' },
  { label: 'Workshop', value: 'workshop' },
  { label: 'Palestra', value: 'lecture' },
  { label: 'Congresso', value: 'congress' },
  { label: 'Social', value: 'social' },
  { label: 'Religião', value: 'religion' },
  { label: 'Acadêmico', value: 'academic' },
];

export default function SearchPage() {
  // O Estado Central que guarda TODOS os filtros ativos
  const [activeFilters, setActiveFilters] = useState<EventFilters>({busca: ''});

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Buscar</Text>
      <View style={globalStyles.header}>
        <SearchBar 
          value={activeFilters.busca || ''} 
          onChangeText={(texto) => setActiveFilters({ ...activeFilters, busca: texto })}
          placeholder="Buscar eventos..." 
        />
      </View>

      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
          {CATEGORIES.map((cat, index) => {
            const isActive = activeFilters.categoria === cat.value || (cat.value === null && !activeFilters.categoria);
            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                onPress={() => setActiveFilters({ ...activeFilters, categoria: cat.value })}
              >
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.content}>
        <EventFeed filtrosAtivos={activeFilters} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: 8,
  },
  categoriesWrapper: {
    marginTop: 8,
  },
  categoriesContent: {
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundDarkSecondary, // subtle dark background
  },
  categoryPillActive: {
    backgroundColor: `${colors.orangePrimary}25`, // orange tint
  },
  categoryText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.orangePrimary,
    fontFamily: 'Montserrat_700Bold',
  },
});