// src/components/UserCard.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, TouchableOpacity } from 'react-native';
import { User } from '@/types/user';
import { colors, globalStyles } from '@/styles/global';
import { userService } from '@/services/userService';
import { getImageUrl } from '@/utils/image';

const userPlaceholder = require('@/assets/images/LA.png');

interface UserCardProps {
  user: User;
  onPress?: () => void;
  initialIsFollowing?: boolean;
  isCurrentUser?: boolean; 
}

export function UserCard({ user, onPress, initialIsFollowing = false, isCurrentUser = false }: UserCardProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollowToggle = async () => {
    if (loading || isCurrentUser) return;
    setLoading(true);
    try {
      if (isFollowing) {
        await userService.unfollowUser(user.id);
        setIsFollowing(false);
      } else {
        await userService.followUser(user.id);
        setIsFollowing(true);
      }
    } catch (error: any) {
      if (isFollowing && error.response && error.response.status === 404) {
        // Se tentou deixar de seguir e deu 404, significa que já não seguia (estado desatualizado)
        setIsFollowing(false);
      } else {
        console.error("Erro ao alterar status de seguir:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const avatarSource = user.picture_profile 
    ? { uri: getImageUrl(user.picture_profile)! } 
    : userPlaceholder;

  return (
    <Pressable style={styles.cardContainer} onPress={onPress}>
      <Image source={avatarSource} style={styles.avatar} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.nameText} numberOfLines={1}>{user.name}</Text>
        <Text style={styles.bioText} numberOfLines={1}>
          @{user.nickname} {user.bio ? `· ${user.bio}` : ''}
        </Text>
      </View>

      {!isCurrentUser && (
        <TouchableOpacity 
          style={[styles.followBtn, isFollowing && styles.followingBtn]} 
          onPress={handleFollowToggle}
          disabled={loading}
        >
          <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
            {isFollowing ? 'Seguindo' : 'Seguir'}
          </Text>
        </TouchableOpacity>
      )}
    </Pressable>
  );
}

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundDark,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  nameText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: colors.textPrimaryDark,
    marginBottom: 2,
  },
  bioText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  followBtn: {
    backgroundColor: colors.orangePrimary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followBtnText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,
    color: colors.backgroundDark,
  },
  followingBtn: {
    backgroundColor: 'rgba(252, 185, 40, 0.15)', // colors.orangePrimary with opacity
  },
  followingBtnText: {
    color: colors.orangePrimary,
  }
});