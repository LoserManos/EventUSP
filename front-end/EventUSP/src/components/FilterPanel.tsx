import { colors, globalStyles } from '@/styles/global';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from 'react-native';

// Espelho do enum CategoryType do models.py
const CATEGORY_TYPES = [
  "party", "sport", "workshop", "lecture", 
  "congress", "social", "religion", "academic"
];

export default function FilterPanel() {
  // Estados para capturar os inputs do usuário
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [orgName, setOrgName] = useState('');
  const [creatorName, setCreatorName] = useState('');

 // Estados para intervalos de Data
  const [dateAfter, setDateAfter] = useState('');
  const [dateBefore, setDateBefore] = useState('');
  
  // Estados para intervalos de Horário
  const [timeAfter, setTimeAfter] = useState('');
  const [timeBefore, setTimeBefore] = useState('');

  // Estado para Ordenação
  const [sortBy, setSortBy] = useState<'date_asc' | 'date_desc' | 'likes'>('date_asc');

  return (
    <ScrollView style={styles.panelContainer} nestedScrollEnabled={true}>
      <Text style={globalStyles.sectionTitle}>Filtros Avançados</Text>

      {/* --- CATEGORIA --- */}
      <View style={styles.section}>
        <Text style={styles.label}>Categoria</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {CATEGORY_TYPES.map((cat) => (
            <Pressable
              key={cat}
              style={[styles.pill, selectedCategory === cat && styles.pillActive]}
              onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            >
              <Text style={[styles.pillText, selectedCategory === cat && styles.pillTextActive]}>
                {cat.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* --- ORGANIZAÇÃO E USUÁRIO --- */}
      <View style={styles.section}>
        <Text style={styles.label}>Organização (Nome)</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textSecondary}
          placeholder="Ex: ECA Jr. ..."
          value={orgName}
          onChangeText={setOrgName}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Criador do Evento</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textSecondary}
          placeholder="Ex: Lucas Antonio..."
          value={creatorName}
          onChangeText={setCreatorName}
        />
      </View>

      {/* --- DATA --- */}
      <View style={styles.section}>
        <Text style={styles.label}>Data do Evento</Text>
        <View style={styles.rowInputGroup}>
          <Text style={styles.sideLabel}>Depois de:</Text>
          <TextInput
            style={styles.sideInput}
            placeholderTextColor={colors.textSecondary}
            placeholder="DD/MM/AA"
            value={dateAfter}
            onChangeText={setDateAfter}
            keyboardType="numeric"
            maxLength={8}
          />
        </View>
        <View style={styles.rowInputGroup}>
          <Text style={styles.sideLabel}>Antes de:</Text>
          <TextInput
            style={styles.sideInput}
            placeholderTextColor={colors.textSecondary}
            placeholder="DD/MM/AA"
            value={dateBefore}
            onChangeText={setDateBefore}
            keyboardType="numeric"
            maxLength={8}
          />
        </View>
      </View>

      {/* --- HORÁRIO --- */}
      <View style={styles.section}>
        <Text style={styles.label}>Horário</Text>
        <View style={styles.rowInputGroup}>
          <Text style={styles.sideLabel}>Depois das:</Text>
          <TextInput
            style={styles.sideInput}
            placeholderTextColor={colors.textSecondary}
            placeholder="HH:MM"
            value={timeAfter}
            onChangeText={setTimeAfter}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
        <View style={styles.rowInputGroup}>
          <Text style={styles.sideLabel}>Antes das:</Text>
          <TextInput
            style={styles.sideInput}
            placeholderTextColor={colors.textSecondary}
            placeholder="HH:MM"
            value={timeBefore}
            onChangeText={setTimeBefore}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
      </View>

      {/* --- ORDENAÇÃO --- */}
      <View style={styles.section}>
        <Text style={styles.label}>Ordenar resultados por:</Text>
        <View style={styles.sortRow}>
          <Pressable 
            style={[styles.sortBtnSmall, sortBy === 'date_asc' && styles.sortBtnActive]}
            onPress={() => setSortBy('date_asc')}
          >
            <Text style={[styles.sortTextSmall, sortBy === 'date_asc' && styles.sortTextActive]}>Próximos</Text>
          </Pressable>
          <Pressable 
            style={[styles.sortBtnSmall, sortBy === 'date_desc' && styles.sortBtnActive]}
            onPress={() => setSortBy('date_desc')}
          >
            <Text style={[styles.sortTextSmall, sortBy === 'date_desc' && styles.sortTextActive]}>Recentes</Text>
          </Pressable>
          <Pressable 
            style={[styles.sortBtnSmall, sortBy === 'likes' && styles.sortBtnActive]}
            onPress={() => setSortBy('likes')}
          >
            <Text style={[styles.sortTextSmall, sortBy === 'likes' && styles.sortTextActive]}>+ Likes</Text>
          </Pressable>
        </View>
      </View>

      {/* Botão de Aplicar (simulação) */}
      <Pressable style={styles.applyButton}>
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
    boxShadow: `0px 4px 4px 0px ${colors.shadow}`,
    maxHeight: 400, 
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimaryDark,
    marginBottom: 8,
  },
  input: {
    color: colors.textPrimaryDark,
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.backgroundDark,
  },
  horizontalScroll: {
    flexDirection: 'row',
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundDark,
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: colors.orangeSecondary,
  },
  pillText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  pillTextActive: {
    color: colors.orangePrimary,
    fontWeight: 'bold',
  },

  // Estilos para Data e Hora (Inputs na mesma linha das labels)
  rowInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sideLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1, // Faz a label ocupar o espaço à esquerda
  },
  sideInput: {
    color: colors.textPrimaryDark,
    height: 40,
    width: '60%',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.backgroundDark,
  },

  // Estilos para Ordenação (Lado a lado e menores)
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8, // Espaçamento entre os botões
  },
  sortBtnSmall: {
    flex: 1, // Faz com que os 3 botões dividam a largura igualmente
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortBtnActive: {
    backgroundColor: colors.orangeSecondary,
  },
  sortTextSmall: {
    fontSize: 12, // Texto menor
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sortTextActive: {
    color: colors.orangePrimary,
    fontWeight: 'bold',
  },

  // Botão Final
  applyButton: {
    backgroundColor: colors.blueSecondary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  applyButtonText: {
    color: colors.bluePrimary,
    fontWeight: 'bold',
    fontSize: 16,
  }
});