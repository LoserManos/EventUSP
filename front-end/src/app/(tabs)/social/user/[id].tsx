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
import { EventCard } from '@/components/EventCard';
import { UserOrgsModal } from '@/components/UserOrgList';
import { EditProfileModal } from '@/components/EditProfileModal';
import { Ionicons } from '@expo/vector-icons';
import { getImageUrl } from '@/utils/image';

const userPlaceholder = require('@/assets/images/LA.png');
const orgPlaceholder = require('@/assets/images/LA.png');

export default function UserProfilePage() {
  const { id } = useLocalSearchParams();
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
      <ScrollView contentContainerStyle={globalStyles.container} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho do Perfil */}
        <View style={globalStyles.profileHeader}>
          <Image source={avatarUri} style={globalStyles.profilePicture} />
          
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={globalStyles.primaryText}>{user.name}</Text>
                <Text style={globalStyles.secondaryText}>@{user.nickname}</Text>
              </View>

              {isMe ? (
                <TouchableOpacity style={[globalStyles.iconButton, {borderColor: colors.bluePrimary}]} onPress={() => setModalType('edit')}>
                  <Ionicons name="pencil" size={18} color={colors.bluePrimary} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[
                    globalStyles.interactionButton,
                    relations.isFollowing ? 
                    globalStyles.pressedInteractionButton :
                    globalStyles.blueInteractionButton]} 
                  onPress={relations.handleFollowToggle}
                >
                  <Text style={[
                    globalStyles.interactionButtonText,
                    relations.isFollowing ? 
                    globalStyles.pressedInteractionText :
                    globalStyles.primaryInteractionText]} >
                    {relations.isFollowing ? 'Seguindo' : 'Seguir'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 8 }}>
              <TouchableOpacity onPress={() => setModalType('followers')}>
                <Text style={globalStyles.secondaryText}>
                  <Text style={globalStyles.counterText}>{relations.followersCount}</Text> seguidores
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalType('following')}>
                <Text style={globalStyles.secondaryText}>
                  <Text style={globalStyles.counterText}>{relations.followingCount}</Text> seguindo
                </Text>
              </TouchableOpacity>
            </View>

            {user.bio && <Text style={globalStyles.profileDescription}>{user.bio}</Text>}

          </View>
        </View>
          


        <View style={globalStyles.listPreviewContainer}>
          <Text style={globalStyles.primaryText}>
            Organizações: <Text style={globalStyles.counterText}>{relations.userOrgs.length}</Text>
          </Text>

          <TouchableOpacity style={globalStyles.listPreviewCard} 
                            onPress={() => setModalType('orgs')} 
                            activeOpacity={0.85}
                            >
            <View style={globalStyles.listPreviewPictureList}>
              {relations.userOrgs.slice(0, 3).map((org, idx) => {
                const orgUri = org.picture_profile ? getImageUrl(org.picture_profile) : null;
                return (
                  <Image 
                    key={org.id || idx} 
                    source={orgUri ? { uri: orgUri } : orgPlaceholder} 
                    style={globalStyles.listPreviewPicture}
                  />
                );
              })}
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={globalStyles.primaryText}>Eventos</Text>

          <View style={globalStyles.buttonsTab}>
            {(['criados', 'interesses', 'curtidos'] as const).map((tab) => (
              <TouchableOpacity 
                key={tab} 
                style={[
                  globalStyles.interactionButton, 
                  globalStyles.pressedInteractionButton,
                  events.eventTab === tab && globalStyles.orangeInteractionButton
                ]} 
                onPress={() => events.setEventTab(tab)}
              >
                <Text style={[
                  globalStyles.interactionButtonText, 
                  globalStyles.pressedInteractionText,
                  events.eventTab === tab && globalStyles.primaryInteractionText
                ]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {events.eventsLoading ? (
            <ActivityIndicator size="small" color={colors.orangePrimary} style={{ marginVertical: 20 }} />
          ) : events.eventsList.length === 0 ? (
            <Text style={{ color: colors.textSecondary, textAlign: 'center', padding: 20 }}>Nenhum evento encontrado.</Text>
          ) : (
            events.eventsList.map((item) => {
              const dateObj = new Date(item.start_date);
              return (
                <EventCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  organizer={item.organizer_name || "Organização"}
                  location={item.local}
                  dates={dateObj.toLocaleDateString('pt-BR')}
                  time={dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
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