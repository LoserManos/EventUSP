// src/components/OrgCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/styles/global';
import { getImageUrl } from '@/utils/image';
import { Organization } from '@/types/org';

const orgPlaceholder = require('@/assets/images/LA.png');

interface OrgCardProps {
  organization: Organization;
  currentUserId?: number;
  userMembership?: { status: boolean; role: string } | null;
  onPress: () => void;
  onMembershipAction: () => void;
}

export function OrgCard({
  organization,
  currentUserId,
  userMembership,
  onPress,
  onMembershipAction,
}: OrgCardProps) {
  const isOwner = currentUserId === organization.creator_id;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image 
        source={organization.picture_profile ? { uri: getImageUrl(organization.picture_profile)! } : orgPlaceholder} 
        style={styles.avatar} 
      />

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {organization.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {organization.description}
        </Text>
      </View>

      {/* Se for o dono, não mostra nada à direita */}
      {!isOwner && (
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            userMembership ? styles.activeActionButton : styles.primaryActionButton
          ]} 
          onPress={(e) => {
            e.stopPropagation();
            onMembershipAction();
          }}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.actionButtonText, 
            userMembership ? styles.activeActionText : styles.primaryActionText
          ]}>
            {userMembership ? (userMembership.status ? 'Sair' : 'Pendente') : 'Participar'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDarkSecondary,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.backgroundDarkSecondary,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 10,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    color: colors.textPrimaryDark,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 85,
  },
  primaryActionButton: {
    backgroundColor: colors.orangePrimary,
    borderColor: colors.orangePrimary,
  },
  activeActionButton: {
    backgroundColor: 'transparent',
    borderColor: colors.textSecondary,
  },
  actionButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  primaryActionText: {
    color: '#FFF',
  },
  activeActionText: {
    color: colors.textPrimaryDark,
  },
});