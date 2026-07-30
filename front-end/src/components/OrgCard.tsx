// src/components/OrgCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { colors, globalStyles } from '@/styles/global';
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
    <TouchableOpacity style={globalStyles.socialItemContainer} onPress={onPress} activeOpacity={0.85}>
      <Image 
        source={organization.picture_profile ? { uri: getImageUrl(organization.picture_profile)! } : orgPlaceholder} 
        style={globalStyles.itemPicture} 
      />

      <View style={globalStyles.itemInfoContainer}>
        <Text style={globalStyles.itemName} numberOfLines={1}>
          {organization.name}
        </Text>
        <Text style={globalStyles.itemDescription} numberOfLines={2}>
          {organization.description}
        </Text>
      </View>

      {/* Se for o dono, não mostra nada à direita */}
      {!isOwner && (
        <TouchableOpacity 
          style={[
            globalStyles.interactionButton, 
            userMembership ?
            globalStyles.pressedInteractionButton :
            globalStyles.blueInteractionButton
          ]} 
          onPress={(e) => {
            e.stopPropagation();
            onMembershipAction();
          }}
          activeOpacity={0.8}
        >
          <Text style={[
            globalStyles.interactionButtonText, 
            userMembership ?
            globalStyles.pressedInteractionText :
            globalStyles.primaryInteractionText
          ]}>
            {userMembership ?
            (userMembership.status ? 'Sair' : 'Pendente') :
            'Participar'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}