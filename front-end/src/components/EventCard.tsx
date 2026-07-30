import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from '@/styles/global';

import { useRouter } from "expo-router";
import { eventsService } from "@/services/eventService";
import { useFetchUser } from "@/hooks/useFetchUser";
import { getImageUrl } from '@/utils/image';

const ACCENT = colors.orangePrimary;
const ACCENT_DARK = '#d9971c';
const eventImage = require("../../assets/images/Card.png");

interface EventCardProps {
  event?: any;
  currentUserId?: number;
  id?: number | string;
  title?: string;
  organizer?: string;
  location?: string;
  dates?: string;
  time?: string;
  free?: boolean;
  image?: any;
}

export function EventCard({
  event,
  currentUserId,
  id,
  title = "matraca x",
  organizer = "ECA Jr.",
  location = "Vala da FAUD-USP",
  dates = "07/08 - 09/08",
  time = "13:00 - 18:00",
  free = true,
  image = eventImage,
}: EventCardProps) {
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const { user: currentUserHook } = useFetchUser();
  const currentUser = currentUserId ? { id: currentUserId } : currentUserHook;

  const actualId = event?.id || id;
  const actualTitle = event?.title || title;
  const actualLocation = event?.local || location;
  const actualFree = event?.free !== undefined ? event.free : free;
  const actualImage = event?.banner ? { uri: getImageUrl(event.banner) } : image;
  
  let actualDates = dates;
  let actualTime = time;
  if (event?.start_date) {
    const d = new Date(event.start_date);
    actualDates = d.toLocaleDateString('pt-BR');
    actualTime = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  useEffect(() => {
    if (actualId && currentUser) {
      eventsService.getEventInterests(Number(actualId))
        .then(users => {
          setSaved(users.some(u => u.id === currentUser.id));
        })
        .catch(console.error);
    }
  }, [actualId, currentUser]);

  const handleToggleSaved = async () => {
    if (!actualId) return;
    setSaved((s) => !s);
    try {
      await eventsService.toggleInterest(Number(actualId));
    } catch (e) {
      setSaved((s) => !s); // rollback
    }
  };

  const handlePress = () => {
    if (actualId) {
      router.push(`/event/${actualId}`);
    }
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={handlePress}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={actualImage} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.info}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={2}>
              {actualTitle}
            </Text>
            <View style={styles.topRight}>
              {actualFree ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Gratuito</Text>
                </View>
              ) : null}
              <TouchableOpacity onPress={handleToggleSaved} style={styles.saveButton}>
                <MaterialCommunityIcons 
                  name={saved ? "bookmark" : "bookmark-outline"} 
                  size={20} 
                  color={saved ? ACCENT_DARK : "#9ca3af"} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <MetaRow icon="account-multiple" label={organizer} />
          <MetaRow icon="map-marker" label={actualLocation} />
          <MetaRow icon="calendar" label={actualDates} />
          <MetaRow icon="clock-outline" label={actualTime} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function MetaRow({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.metaRow}>
      <MaterialCommunityIcons name={icon as any} size={14} color="#6b7280" />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#292929",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  imageContainer: {
    width: 120,
    height: 120,
    flexShrink: 0,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.backgroundDarkSecondary,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
    marginTop: 5,
    fontFamily: "Montserrat_700Bold",
  },
  badge: {
    backgroundColor: `${ACCENT}25`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: ACCENT_DARK,
    fontSize: 11,
    fontFamily: "Montserrat_400Regular",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: "#6b7280",
    fontFamily: "Montserrat_400Regular",
  },
  saveButton: {
    padding: 8,
  },
});