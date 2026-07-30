import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, globalStyles } from '@/styles/global';

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
  const [liked, setLiked] = useState(false);
  const router = useRouter();
  const { user: currentUser } = useFetchUser();

  useEffect(() => {
    if (id && currentUser) {
      eventsService.getEventInterests(Number(id))
        .then(users => {
          setSaved(users.some(u => u.id === currentUser.id));
        })
        .catch(console.error);
      eventsService.getEventLikes(Number(id))
        .then(users => {
          setLiked(users.some(u => u.id === currentUser.id));
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

    const handleToggleLiked = async () => {
    if (!id) return;
    setLiked((s) => !s);
    try {
      await eventsService.toggleLike(Number(id));
    } catch (e) {
      setLiked((s) => !s); // rollback
    }
  };

  const handlePress = () => {
    if (id) {
      router.push(`/event/${id}`);
    }
  };

  return (
    <TouchableOpacity style={[globalStyles.socialItemContainer]} activeOpacity={0.8} onPress={handlePress}>
        <View style={[{flexDirection:"column", gap: 8, marginRight: 16}, globalStyles.centered]}>
          <Image source={image} style={globalStyles.profilePicture} resizeMode="cover" />
          {free ? (
            <View style={globalStyles.badge}>
              <Text style={globalStyles.badgeText}>Gratuito</Text>
            </View>
          ) : null}
        </View>

        <View style={[globalStyles.itemInfoContainer, {gap:4}]}>
          <View style={globalStyles.header}>
            <Text style={[globalStyles.primaryText]} numberOfLines={2}>
              {title}
            </Text>
          </View>

          <MetaRow icon="account-multiple" label={organizer} />
          <MetaRow icon="map-marker" label={location} />
          <MetaRow icon="calendar" label={dates} />
          <MetaRow icon="clock-outline" label={time} />
        </View>

        <View style={[{flexDirection: "column", gap: 60}, globalStyles.centered]}>
          <TouchableOpacity onPress={handleToggleSaved} style={[globalStyles.iconButton, {borderWidth: 0}]}>
            <MaterialCommunityIcons 
              name={saved ? "bookmark" : "bookmark-outline"} 
              size={20} 
              color={colors.bluePrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleLiked} style={[globalStyles.iconButton, {borderWidth: 0}]}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"} 
              size={20} 
              color={colors.bluePrimary}
            />
          </TouchableOpacity>
        </View>
    </TouchableOpacity>
  );
}

function MetaRow({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={{flexDirection: 'row', gap: 8}}>
      <MaterialCommunityIcons name={icon as any} size={14} color={colors.textSecondary} />
      <Text style={globalStyles.label}>{label}</Text>
    </View>
  );
}