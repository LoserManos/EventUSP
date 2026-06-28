import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, globalStyles } from '@/styles/global';

import SearchBar from '@/components/SearchBar';
import FilterButton from '@/components/FilterButton';
import FilterPanel from '@/components/FilterPanel';
import EventFeed from '@/components/EventFeed';
import { EventFilters } from '@/storage/eventAPI';

export default function SearchPage() {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  // O Estado Central que guarda TODOS os filtros ativos
  const [activeFilters, setActiveFilters] = useState<EventFilters>({busca: ''});

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <SearchBar 
          value={activeFilters.busca || ''} 
          onChangeText={(texto) => setActiveFilters({ ...activeFilters, busca: texto })}
          placeholder="Buscar eventos..." 
        />
        <FilterButton 
          isActive={isFilterExpanded} 
          onPress={() => setIsFilterExpanded(!isFilterExpanded)} 
        />
      </View>

      {/* O Painel recebe a função que permite a ele atualizar os filtros centrais */}
      <View style={{ display: isFilterExpanded ? 'flex' : 'none' }}>
        <FilterPanel 
          currentFilters={activeFilters}
          onApplyFilters={(novosFiltros) => {
            setActiveFilters(novosFiltros);
            setIsFilterExpanded(false);
          }} 
        />
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
    marginTop: 24,
  }
});