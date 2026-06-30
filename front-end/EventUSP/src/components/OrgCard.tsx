// src/components/OrgCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Organization } from '@/types/social';
import { colors } from '@/styles/global';

const OrgImage = require('@/assets/images/EcaJr.png')

export function OrgCard({ org, onPress }: { org: Organization; onPress?: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={OrgImage} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{org.name}</Text>
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
    borderRadius: 8,
  },
  info: { 
    marginLeft: 12 
  },
  name: { 
    color: colors.textPrimaryDark, 
    fontWeight: 'bold' 
  },
});