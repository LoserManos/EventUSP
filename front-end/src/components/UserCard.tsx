// src/components/UserCard.tsx
import React, { useState } from 'react';
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
    <Pressable style={globalStyles.socialItemContainer} onPress={onPress}>
      <Image source={avatarSource} style={globalStyles.itemPicture} />
      
      <View style={globalStyles.itemInfoContainer}>
        <Text style={globalStyles.itemName}>{user.name}</Text>
        <Text style={globalStyles.itemSecondaryName}>@{user.nickname}</Text>
      </View>

      {!isCurrentUser && (
        <TouchableOpacity 
          style={[globalStyles.interactionButton, 
                  isFollowing ? 
                  globalStyles.pressedInteractionButton :
                  globalStyles.blueInteractionButton]} 
          onPress={handleFollowToggle}
          disabled={loading}
        >
          <Text style={[globalStyles.interactionButtonText, 
                        isFollowing ? 
                        globalStyles.pressedInteractionText :
                        globalStyles.primaryInteractionText]}>
            {isFollowing ? 'Seguindo' : 'Seguir'}
          </Text>
        </TouchableOpacity>
      )}
    </Pressable>
  );
}