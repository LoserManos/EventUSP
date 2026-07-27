import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from '@/styles/global';

import { useRouter } from "expo-router";
import { eventsService } from "@/services/eventService";
import { useFetchUser } from "@/hooks/useFetchUser";

const ACCENT = colors.orangePrimary;
const ACCENT_DARK = '#d9971c';
const eventImage = require("../../assets/images/Card.png");

interface EventCardProps {
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
  const { user: currentUser } = useFetchUser();

  useEffect(() => {
    if (id && currentUser) {
      eventsService.getEventInterests(Number(id))
        .then(users => {
          setSaved(users.some(u => u.id === currentUser.id));
        })
        .catch(console.error);
    }
  }, [id, currentUser]);

  const handleToggleSaved = async () => {
    if (!id) return;
    setSaved((s) => !s);
    try {
      await eventsService.toggleInterest(Number(id));
    } catch (e) {
      setSaved((s) => !s); // rollback
    }
  };

  const handlePress = () => {
    if (id) {
      router.push(`/event/${id}`);
    }
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={handlePress}>
      <View style={styles.content}>
        <Image source={image} style={styles.image} resizeMode="cover" />

        <View style={styles.info}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <View style={styles.topRight}>
              {free ? (
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
          <MetaRow icon="map-marker" label={location} />
          <MetaRow icon="calendar" label={dates} />
          <MetaRow icon="clock-outline" label={time} />
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
    alignItems: "flex-start",
    gap: 20,
  },
  image: {
    width: 92,
    height: 92,
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