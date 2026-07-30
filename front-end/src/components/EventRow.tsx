import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/global';
import { useRouter } from 'expo-router';

const eventPlaceholder = require("../../assets/images/Card.png");

interface EventRowProps {
  id?: number | string;
  title?: string;
  location?: string;
  dates?: string;
  free?: boolean;
  image?: any;
}

export function EventRow({
  id,
  title = "Evento",
  location = "Local",
  dates = "Data",
  free = true,
  image = eventPlaceholder,
}: EventRowProps) {
  const router = useRouter();

  const handlePress = () => {
    if (id) {
      router.push(`/event/${id}`);
    }
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="cover" />
      </View>
      
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {free && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Gratuito</Text>
            </View>
          )}
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="location" size={12} color={colors.textSecondary} />
          <Text style={styles.metaText} numberOfLines={1}>{location}</Text>
        </View>
        
        <View style={styles.metaRow}>
          <Ionicons name="calendar" size={12} color={colors.textSecondary} />
          <Text style={styles.metaText}>{dates}</Text>
        </View>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color={colors.backgroundLightSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  imageContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.backgroundDark,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: colors.textPrimaryDark,
    flexShrink: 1,
  },
  badge: {
    backgroundColor: 'rgba(252, 185, 40, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 9,
    color: colors.orangePrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  metaText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: colors.textSecondary,
    flexShrink: 1,
  },
});
