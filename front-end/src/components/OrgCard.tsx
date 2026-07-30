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
  const isMember = userMembership?.status === true;
  const isPending = userMembership && !userMembership.status;

  const avatarSource = organization.picture_profile 
    ? { uri: getImageUrl(organization.picture_profile)! } 
    : orgPlaceholder;

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.coverBlock}>
        <Image source={avatarSource} style={styles.coverImage} blurRadius={10} />
        <View style={styles.coverOverlay} />
      </View>

      <View style={styles.contentBlock}>
        <View style={styles.avatarRow}>
          <View style={styles.avatarWrapper}>
            <Image source={avatarSource} style={styles.avatarImage} />
          </View>
          
          {!isOwner && (
            <TouchableOpacity 
              style={[
                styles.followBtn, 
                userMembership && styles.followingBtn
              ]} 
              onPress={(e) => {
                e.stopPropagation();
                onMembershipAction();
              }}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.followBtnText, 
                userMembership && styles.followingBtnText
              ]}>
                {isMember ? 'Sair' : isPending ? 'Pendente' : 'Participar'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.nameText} numberOfLines={1}>{organization.name}</Text>
        </View>
        <Text style={styles.handleText} numberOfLines={1}>@org_{organization.id}</Text>



        <View style={styles.statsRow}>
          <Text style={styles.statText}>
            <Text style={styles.statBold}>--</Text> seguidores
          </Text>
          <Text style={styles.statText}>
            <Text style={styles.statBold}>--</Text> eventos
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 4, 
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  coverBlock: {
    height: 70,
    position: 'relative',
    backgroundColor: '#0a3540',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.6,
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  contentBlock: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    marginTop: -24, 
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  avatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16, 
    borderWidth: 2,
    borderColor: colors.backgroundDarkSecondary, 
    overflow: 'hidden',
    backgroundColor: colors.backgroundDark,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  followBtn: {
    backgroundColor: colors.orangePrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  followingBtn: {
    backgroundColor: 'rgba(252, 185, 40, 0.15)',
  },
  followBtnText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 11,
    color: colors.backgroundDark,
  },
  followingBtnText: {
    color: colors.orangePrimary,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nameText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    color: colors.textPrimaryDark,
  },
  handleText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  categoryRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  categoryPill: {
    backgroundColor: 'rgba(252, 185, 40, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    maxWidth: '100%',
  },
  categoryText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 11,
    color: colors.orangePrimary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  statText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: colors.textSecondary,
  },
  statBold: {
    fontFamily: 'Montserrat_700Bold',
    color: colors.textPrimaryDark,
  },
});