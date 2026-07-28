// src/app/create/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/global';
import { useRouter } from 'expo-router';

export default function CreateHubScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titulo}>O que você deseja criar?</Text>
          <Text style={styles.subtitulo}>
            Escolha uma das opções abaixo para começar a publicar na plataforma.
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {/* Botão para Criar Evento */}
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => router.push('/create/create-event')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.backgroundDarkSecondary, colors.backgroundDark]}
              style={styles.cardGradient}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name="calendar-outline" size={28} color={colors.orangePrimary} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Criar Evento</Text>
                <Text style={styles.cardDescription}>Divulgue festas, encontros e atividades acadêmicas.</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Botão para Criar Organização */}
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => router.push('/create/create-org')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.backgroundDarkSecondary, colors.backgroundDark]}
              style={styles.cardGradient}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name="people-outline" size={28} color={colors.orangePrimary} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Criar Organização</Text>
                <Text style={styles.cardDescription}>Estruture ligas, atléticas ou grupos acadêmicos.</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 32,
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.orangePrimary,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  optionsContainer: {
    gap: 16,
  },
  cardButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.backgroundDarkSecondary,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.backgroundDarkSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimaryDark,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});