import { colors, globalStyles } from '@/styles/global';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from 'react-native';
import { EventFilters } from '@/services/eventService';

const CATEGORY_TYPES = [
  "todos", "party", "sport", "workshop", "lecture", 
  "congress", "social", "religion", "academic"
];

interface FilterPanelProps {
  onApplyFilters: (filtros: EventFilters) => void;
  currentFilters: EventFilters;
}

export default function FilterPanel({ onApplyFilters, currentFilters }: FilterPanelProps) {
  // Estados para capturar os inputs do usuário
  const [selectedCategory, setSelectedCategory] = useState(currentFilters.categoria || "todos");

  // Estado para Ordenação
  const [sortBy, setSortBy] = useState<'date_asc' | 'date_desc' | 'likes'>('date_asc');

  return (
    <ScrollView style={styles.panelContainer} nestedScrollEnabled={true}>
      {/* --- CATEGORIA --- */}
      <View style={styles.section}>
        <Text style={globalStyles.primaryText}>Categoria</Text>
        <ScrollView horizontal 
                    showsHorizontalScrollIndicator={false} 
                    style={{flexDirection: 'row', gap: 16}}>
          {CATEGORY_TYPES.map((cat) => (
            <Pressable
              key={cat}
              style={[globalStyles.badge, 
                      {marginRight: 8},
                      selectedCategory === cat ?
                      globalStyles.orangeInteractionButton :
                      {backgroundColor: colors.backgroundDark}
                    ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[globalStyles.interactionButtonText, 
                            selectedCategory === cat ? 
                            {color: colors.backgroundDark} :
                            {color: colors.textSecondary}]}>
                {cat.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* --- ORDENAÇÃO --- */}
      <View style={styles.section}>
        <Text style={globalStyles.primaryText}>Ordenar resultados por:</Text>
        <View style={[globalStyles.buttonsTab, {marginVertical:0 , justifyContent: 'space-between'}]}>
          {([
              { key: 'date_asc', label: 'Próximos' },
              { key: 'date_desc', label: 'Recentes' },
              { key: 'likes', label: '+ Likes' },
            ] as const ).map((item) => (
            <Pressable 
              key={item.key}
              style={[globalStyles.interactionButton, 
                      sortBy === item.key ?
                      globalStyles.orangeInteractionButton :
                      {backgroundColor: colors.backgroundDark}]}
              onPress={() => setSortBy(item.key)}
            >
              <Text style={[globalStyles.interactionButtonText, 
                      sortBy === item.key ?
                      globalStyles.primaryInteractionText :
                      globalStyles.pressedInteractionText]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable 
        style={styles.applyButton}
        onPress={() => {
          onApplyFilters({
            categoria: selectedCategory === "todos" ? null : selectedCategory,
            sortBy
          });
        }}
      >
        <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  panelContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 8,
    elevation: 20,
  },
  section: {
    gap: 8,
    marginBottom: 20,
  },

  applyButton: {
    backgroundColor: colors.bluePrimary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  applyButtonText: {
    color: colors.backgroundDarkSecondary,
    fontWeight: 'bold',
    fontSize: 16,
  }
});