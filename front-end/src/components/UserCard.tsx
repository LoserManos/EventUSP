// src/components/UserCard.tsx
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { User } from '@/types/user';
import { colors } from '@/styles/global';
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
    } catch (error) {
      console.error("Erro ao alterar status de seguir:", error);
    } finally {
      setLoading(false);
    }
  };

  const avatarSource = user.picture_profile 
    ? { uri: getImageUrl(user.picture_profile)! } 
    : userPlaceholder;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={avatarSource} style={styles.avatar} />
      
      <View style={styles.info}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>@{user.nickname}</Text>
      </View>

      {!isCurrentUser && (
        <TouchableOpacity 
          style={[styles.followButton, isFollowing ? styles.followingButton : styles.followButtonPrimary]} 
          onPress={handleFollowToggle}
          disabled={loading}
        >
          <Text style={[styles.followButtonText, isFollowing ? styles.followingButtonText : styles.followButtonTextPrimary]}>
            {isFollowing ? 'Seguindo' : 'Seguir'}
          </Text>
        </TouchableOpacity>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    backgroundColor: colors.backgroundDark, 
    borderRadius: 12, 
    marginBottom: 8,
  },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 8 
  },
  info: { 
    flex: 1,
    marginLeft: 12 
  },
  name: { 
    color: colors.textPrimaryDark, 
    fontWeight: 'bold' 
  },
  username: { 
    color: colors.textSecondary, 
  },
  followButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  followButtonPrimary: {
    backgroundColor: colors.orangePrimary,
    borderColor: colors.orangePrimary,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderColor: colors.textSecondary,
  },
  followButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  followButtonTextPrimary: {
    color: '#FFF',
  },
  followingButtonText: {
    color: colors.textPrimaryDark,
  },
});