'use client';

import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import imgFotoPerfil from "@/imports/Home/f55472821ab9320c8f6774ee1ec65c7e9ba72e9c.png";
import imgCapa from "@/imports/Home/c595608c2b9f266bc558b554aa638beb4fbf0766.png";
import imgImage22 from "@/imports/Home/b7cd6e85df756aa7794f591a5aa76b5d8d0459bc.png";
import imgImage23 from "@/imports/Home/7a45f258ae9fa972b4d55336fd43edb5ed12fcd2.png";

const ACCENT_DARK = "#5bbdd0";

interface SocialPostProps {
  username?: string;
  handle?: string;
  timeAgo?: string;
  avatar?: any;
  eventName?: string;
  photos?: [any, any, any];
  likes?: number | string;
  comments?: number | string;
}

export function SocialPost({
  username = "Lucas Aura",
  handle = "@TheMostAura",
  timeAgo = "2h",
  avatar = imgFotoPerfil,
  eventName = "Sexta do Rock",
  photos = [imgCapa, imgImage22, imgImage23],
  likes = 12,
  comments = 12,
}: SocialPostProps) {
  const normalizedLikes = Number(likes) || 0;
  const normalizedComments = Number(comments) || 0;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(normalizedLikes);

  useEffect(() => {
    if (!liked) {
      setLikeCount(normalizedLikes);
    }
  }, [normalizedLikes, liked]);

  function handleLike() {
    setLiked((value) => !value);
    setLikeCount((count) => (liked ? count - 1 : count + 1));
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={avatar} style={styles.avatar} resizeMode="cover" />
          <View style={styles.userText}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.handle}>{handle} · {timeAgo}</Text>
          </View>
        </View>
        <Text style={styles.more}>···</Text>
      </View>

      <Text style={styles.caption}>
        Esteve em: <Text style={{ color: "#fcb827", fontWeight: "700" }}>{eventName}</Text>
      </Text>

    <View style={styles.photoGrid}>
    <Image source={photos[0]} style={styles.mainPhoto} resizeMode="cover" />

    <View style={styles.sidePhotos}>
        <Image source={photos[1]} style={styles.sidePhoto} resizeMode="cover"/>
        <Image source={photos[2]} style={styles.sidePhoto} resizeMode="cover"/>
    </View>
    </View>

      <View style={styles.footer}>
        <Pressable onPress={handleLike} style={styles.footerAction}>
          <MaterialCommunityIcons
            name={liked ? "heart" : "heart-outline"}
            size={18}
            color={liked ? "#ef4444" : "#6b7280"}
          />
          <Text style={[styles.footerText, liked && styles.footerTextActive]}>{likeCount}</Text>
        </Pressable>

        <View style={styles.footerAction}>
          <MaterialCommunityIcons name="comment-outline" size={18} color="#6b7280" />
          <Text style={styles.footerText}>{comments}</Text>
        </View>

        <View style={{ flex: 1 }} />

        <Pressable style={styles.footerAction}>
          <MaterialCommunityIcons name="share-outline" size={18} color="#9ca3af" />
        </Pressable>
      </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  userText: {
    gap: 2,
  },
  username: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: "Montserrat_700Bold",
  },
  handle: {
    fontSize: 12,
    color: "#9ca3af",
    fontFamily: "Montserrat_400Regular",
  },
  more: {
    fontSize: 20,
    color: "#d1d5db",
    lineHeight: 20,
  },
  caption: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    fontSize: 13,
    color: "#ffffff",
    lineHeight: 18,
    fontFamily: "Montserrat_400Regular",
  },
  photoGrid: {
    paddingHorizontal: 12,
    flexDirection: "row",
    height: 280,
    overflow: "hidden",
  },

  mainPhoto: {
    flex: 3,        
    height: "100%",
  },

  sidePhotos: {
    flex: 2,
    flexDirection: "column",
  },

  sidePhoto: {
    flex: 1,         
    height: "50%",
    width: "100%",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  footerAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    fontFamily: "Montserrat_400Regular",
  },
  footerTextActive: {
    color: "#ef4444",
  },
});