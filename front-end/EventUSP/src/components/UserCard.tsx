// src/components/UserCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { SocialUser } from '@/types/social';
import { colors } from '@/styles/global';

const userImage = require('@/assets/images/LA.png')

export function UserCard({ user, onPress }: { user: SocialUser; onPress?: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={userImage} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>{user.username}</Text>
      </View>
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
    marginLeft: 12 
  },
  name: { 
    color: colors.textPrimaryDark, 
    fontWeight: 'bold' 
  },
  username: { 
    color: colors.textSecondary, 
  },
});