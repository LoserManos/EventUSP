import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, globalStyles } from '@/styles/global';
import { useAuth } from '@/contexts/AuthContext';

// Hooks 
import { useFetchUser } from '@/hooks/useFetchUser';
import { useUserProfileData } from '@/hooks/useUserProfileData';
import { useUserEvents } from '@/hooks/useUserEvents';
import { useUserEdit } from '@/hooks/useUserEdit';

// Componentes e Modais
import { UserListModal } from '@/components/UserListModal';
import { EventRow } from '@/components/EventRow';
import { UserOrgsModal } from '@/components/UserOrgList';
import { EditProfileModal } from '@/components/EditProfileModal';
import { Ionicons } from '@expo/vector-icons';
import { getImageUrl } from '@/utils/image';

const userPlaceholder = require('@/assets/images/LA.png');
const orgPlaceholder = require('@/assets/images/LA.png');

export default function UserProfilePage({ userId }: { userId?: string | number }) {
  const { id: routeId } = useLocalSearchParams();
  const id = userId ?? routeId;
  const router = useRouter();
  const { userProfile: authUser } = useAuth();
  
  const [modalType, setModalType] = useState<'orgs' | 'followers' | 'following' | 'edit' | null>(null);
  const { user, loading, error, refetch } = useFetchUser(id as string | number);
  const isMe = Boolean(user?.id && authUser?.id && user.id === authUser.id);
  const relations = useUserProfileData(user?.id ?? 0, authUser?.id, isMe);
  const events = useUserEvents(user?.id ?? 0);
  const edit = useUserEdit(user, () => {
    refetch();
    setModalType(null);
  });

  if (loading) {
    return (
      <View style={[globalStyles.container, globalStyles.centered]}>
        <ActivityIndicator size="large" color={colors.orangePrimary} />
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={[globalStyles.container, globalStyles.centered]}>
        <Text style={{ color: colors.textSecondary }}>{error || 'Usuário não encontrado.'}</Text>
      </View>
    );
  }

  const avatarUri = user.picture_profile ? { uri: getImageUrl(user.picture_profile)! } : userPlaceholder;

  return (
    <View style={globalStyles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho do Perfil (Novo Top Bar Opcional) */}
        <View style={localStyles.topBar}>
          <Text style={[globalStyles.title, { marginBottom: 0 }]}>{isMe ? 'Perfil' : user.name}</Text>
          {isMe && (
            <TouchableOpacity onPress={() => router.push('/settings')} style={localStyles.iconButton}>
              <Ionicons name="settings-outline" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Identity */}
        <View style={localStyles.identityContainer}>
          <View style={localStyles.avatarRing}>
            <Image source={avatarUri} style={localStyles.avatarImage} />
          </View>
          <Text style={localStyles.identityName}>{user.name}</Text>
          <Text style={localStyles.identityHandle}>@{user.nickname}</Text>
          {user.bio && (
            <Text style={localStyles.identityBio}>{user.bio}</Text>
          )}
        </View>

        {/* Stats Card */}
        <View style={localStyles.statsCard}>
          <TouchableOpacity style={localStyles.statItem} onPress={() => setModalType('orgs')}>
            <Text style={localStyles.statValue}>{relations.userOrgs.length}</Text>
            <Text style={localStyles.statLabel}>Organizações</Text>
          </TouchableOpacity>
          
          <View style={localStyles.statDivider} />
          
          <TouchableOpacity style={localStyles.statItem} onPress={() => setModalType('followers')}>
            <Text style={localStyles.statValue}>{relations.followersCount}</Text>
            <Text style={localStyles.statLabel}>Seguidores</Text>
          </TouchableOpacity>
          
          <View style={localStyles.statDivider} />
          
          <TouchableOpacity style={localStyles.statItem} onPress={() => setModalType('following')}>
            <Text style={localStyles.statValue}>{relations.followingCount}</Text>
            <Text style={localStyles.statLabel}>Seguindo</Text>
          </TouchableOpacity>
        </View>

        {/* Actions Row */}
        <View style={localStyles.actionsRow}>
          {isMe ? (
            <TouchableOpacity style={localStyles.actionBtnPrimary} onPress={() => setModalType('edit')} activeOpacity={0.8}>
              <Text style={localStyles.actionBtnTextPrimary}>Editar perfil</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[localStyles.actionBtnPrimary, relations.isFollowing && localStyles.actionBtnFollowing]} 
              onPress={relations.handleFollowToggle}
              activeOpacity={0.8}
            >
              <Text style={[localStyles.actionBtnTextPrimary, relations.isFollowing && localStyles.actionBtnTextFollowing]}>
                {relations.isFollowing ? 'Seguindo' : 'Seguir'}
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={localStyles.actionBtnSecondary} activeOpacity={0.8}>
            <Text style={localStyles.actionBtnTextSecondary}>Compartilhar</Text>
          </TouchableOpacity>
        </View>

        {/* Eventos */}
        <View style={{ marginTop: 24 }}>
          


          {/* Tabs Segmented Control */}
          <View style={localStyles.tabsContainer}>
            <View style={localStyles.segmentedControl}>
              {(['criados', 'interesses', 'curtidos'] as const).map((tab) => (
                <TouchableOpacity 
                  key={tab} 
                  style={[localStyles.tabButton, events.eventTab === tab && localStyles.tabButtonActive]}
                  onPress={() => events.setEventTab(tab)}
                  activeOpacity={0.8}
                >
                  <Text style={[localStyles.tabText, events.eventTab === tab && localStyles.tabTextActive]}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {events.eventsLoading ? (
            <ActivityIndicator size="small" color={colors.orangePrimary} style={{ marginVertical: 20 }} />
          ) : events.eventsList.length === 0 ? (
            <Text style={{ color: colors.textSecondary, textAlign: 'center', padding: 20 }}>Nenhum evento encontrado.</Text>
          ) : (
            events.eventsList.map((item) => {
              const dateObj = new Date(item.start_date);
              return (
                <EventRow
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  location={item.local}
                  dates={dateObj.toLocaleDateString('pt-BR')}
                  free={true}
                />
              );
            })
          )}
        </View>
      </ScrollView>

      <UserOrgsModal visible={modalType === 'orgs'} onClose={() => setModalType(null)} orgs={relations.userOrgs} router={router} />
      
      <UserListModal
        visible={modalType === 'followers'}
        onClose={() => setModalType(null)}
        title="Seguidores"
        users={relations.followersList}
        currentLoggedUserId={authUser?.id}
        followingIds={relations.followingIds}
        onSelectUser={(selectedId) => { setModalType(null); router.push(`/social/user/${selectedId}`); }}
        emptyMessage="Nenhum seguidor encontrado."
      />

      <UserListModal
        visible={modalType === 'following'}
        onClose={() => setModalType(null)}
        title="Seguindo"
        users={relations.followingList}
        currentLoggedUserId={authUser?.id}
        followingIds={relations.followingIds}
        onSelectUser={(selectedId) => { setModalType(null); router.push(`/social/user/${selectedId}`); }}
        emptyMessage="Não está seguindo ninguém."
      />

      <EditProfileModal
        visible={modalType === 'edit'}
        onClose={() => setModalType(null)}
        user={user}
        editName={edit.editName} setEditName={edit.setEditName}
        editNickname={edit.editNickname} setEditNickname={edit.setEditNickname}
        editBio={edit.editBio} setEditBio={edit.setEditBio}
        selectedImageUri={edit.selectedImageUri}
        handlePickImage={edit.handlePickImage}
        handleSaveProfile={edit.handleSaveProfile}
      />
    </View>
  );
}

import { StyleSheet } from 'react-native';

const localStyles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundDarkSecondary,
  },
  identityContainer: {
    alignItems: 'center',
    paddingTop: 12,
  },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: colors.orangePrimary,
    padding: 3,
    backgroundColor: colors.backgroundDark, // Simulate the white inner ring with background
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.backgroundDark,
  },
  identityName: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 19,
    color: colors.textPrimaryDark,
    marginTop: 12,
  },
  identityHandle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  identityBio: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: colors.textSecondary, // Tailwind text-gray-600 logic
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 260,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 16,
    marginTop: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: colors.textPrimaryDark,
  },
  statLabel: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  actionBtnPrimary: {
    flex: 1,
    backgroundColor: colors.orangePrimary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnFollowing: {
    backgroundColor: 'rgba(252, 185, 40, 0.15)',
  },
  actionBtnTextPrimary: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: colors.backgroundDark,
  },
  actionBtnTextFollowing: {
    color: colors.orangePrimary,
  },
  actionBtnSecondary: {
    flex: 1,
    backgroundColor: colors.backgroundDarkSecondary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnTextSecondary: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: colors.textPrimaryDark,
  },
  tabsContainer: {
    marginBottom: 16,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 16,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: colors.backgroundDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.orangePrimary,
  },
});