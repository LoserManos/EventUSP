// src/app/social/user/[id].tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, globalStyles } from '@/styles/global';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/user';
import { userService } from '@/services/userService';
import { orgService } from '@/services/orgService';
import { UserOverlayModal } from '@/components/UserOverlayModal';
import { UserListModal } from '@/components/UserListModal';
import { EventCard } from '@/components/EventCard';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getImageUrl } from '@/utils/image';

const userPlaceholder = require('@/assets/images/LA.png');
const orgPlaceholder = require('@/assets/images/LA.png');

export default function UserProfilePage() {
  const { id } = useLocalSearchParams();
  const userId = Array.isArray(id) ? Number(id[0]) : Number(id);
  const router = useRouter();
  
  const { userProfile: authUser } = useAuth(); 

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const currentLoggedUserId = authUser?.id; 
  const isMe = user?.id && currentLoggedUserId ? user.id === currentLoggedUserId : false;

  const [isFollowing, setIsFollowing] = useState(false);
  const [modalType, setModalType] = useState<'orgs' | 'followers' | 'following' | 'edit' | null>(null);
  
  const [userOrgs, setUserOrgs] = useState<any[]>([]);
  const [followersList, setFollowersList] = useState<User[]>([]);
  const [followingList, setFollowingList] = useState<User[]>([]);
  const [followingIds, setFollowingIds] = useState<number[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Estados para o Feed de Eventos do Perfil
  const [eventTab, setEventTab] = useState<'criados' | 'interesses' | 'curtidos'>('criados');
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Estados para edição de perfil
  const [editName, setEditName] = useState('');
  const [editNickname, setEditNickname] = useState('');
  const [editBio, setEditBio] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userId = Number(id);
        const data = await userService.getUser(userId);
        setUser(data);
        setEditName(data.name);
        setEditNickname(data.nickname);
        setEditBio(data.bio || '');

        const followers = await userService.getFollowers(userId);
        const following = await userService.getFollowing(userId);
        
        setFollowersList(followers);
        setFollowersCount(followers.length);
        
        setFollowingList(following);
        setFollowingCount(following.length);
        setFollowingIds(following.map(f => f.id));

        // Busca organizações que o usuário é membro
        try {
          const orgsData = await userService.getOrgs(userId);
          setUserOrgs(orgsData);
        } catch (err) {
          console.error("Erro ao carregar organizações do usuário:", err);
        }

        if (currentLoggedUserId && !isMe) {
          const isUserFollowing = followers.some(f => f.id === currentLoggedUserId);
          setIsFollowing(isUserFollowing);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil do usuário:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchUserData();
  }, [id, currentLoggedUserId]);

  // Carregar eventos com base na sub-aba ativa
  useEffect(() => {
    async function fetchUserEvents() {
      if (!id) return;
      const userId = Number(Array.isArray(id) ? id[0] : id);
      setEventsLoading(true);
      try {
        let data = [];
        if (eventTab === 'criados') {
          data = await userService.getUserCreatedEvents(userId);
        } else if (eventTab === 'interesses') {
          data = await userService.getUserInterestedEvents(userId);
        } else if (eventTab === 'curtidos') {
          data = await userService.getUserLikedEvents(userId);
        }
        setEventsList(data);
      } catch (error) {
        console.error("Erro ao carregar eventos do usuário:", error);
        setEventsList([]);
      } finally {
        setEventsLoading(false);
      }
    }

    fetchUserEvents();
  }, [id, eventTab]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await userService.unfollowUser(Number(id));
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        await userService.followUser(Number(id));
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Erro ao alterar follow:", error);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setSelectedImageUri(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updated = await userService.updateMyProfile({
        name: editName,
        nickname: editNickname,
        bio: editBio,
      });

      let newPictureProfile = user?.picture_profile;

      if (selectedImageUri) {
        const photoResponse = await userService.uploadMyPhoto({
          uri: selectedImageUri,
          name: selectedImageUri.split('/').pop() || 'profile.jpg',
          type: 'image/jpeg',
        } as any);
        
        newPictureProfile = photoResponse.picture_profile;
      }

      setUser((prev) => prev ? { 
        ...prev, 
        ...updated, 
        picture_profile: newPictureProfile !== undefined ? newPictureProfile : prev.picture_profile 
      } : prev);

      setModalType(null);
      setSelectedImageUri(null);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  if (loading) {
    return (
      <View style={[globalStyles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.orangePrimary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[globalStyles.container, styles.centered]}>
        <Text style={{ color: colors.textSecondary }}>Usuário não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.profileHeader}>
          <Image 
            source={user.picture_profile ? { uri: getImageUrl(user.picture_profile)! } : userPlaceholder} 
            style={styles.avatar} 
          />
          
          <View style={styles.userInfo}>
            <View style={styles.topHeaderRow}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.nickname}>@{user.nickname}</Text>
              </View>

              {isMe ? (
                <TouchableOpacity style={styles.iconButton} onPress={() => setModalType('edit')}>
                  <Ionicons name="pencil" size={18} color={colors.textPrimaryDark} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[styles.followButton, isFollowing ? styles.followingButton : styles.followButtonPrimary]} 
                  onPress={handleFollowToggle}
                >
                  <Text style={[styles.followButtonText, isFollowing ? styles.followingButtonText : styles.followButtonTextPrimary]}>
                    {isFollowing ? 'Seguindo' : 'Seguir'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.statsRow}>
              <TouchableOpacity onPress={() => setModalType('followers')}>
                <Text style={styles.statText}><Text style={styles.statBold}>{followersCount}</Text> seguidores</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalType('following')}>
                <Text style={styles.statText}><Text style={styles.statBold}>{followingCount}</Text> seguindo</Text>
              </TouchableOpacity>
            </View>

            {user.bio && <Text style={styles.bio}>{user.bio}</Text>}

            {/* Seção de Organizações (Estilo idêntico ao OrgProfilePage) */}
            <TouchableOpacity style={styles.membersPreviewCard} onPress={() => setModalType('orgs')} activeOpacity={0.85}>
              <View style={styles.membersPreviewLeft}>
                <Text style={styles.membersPreviewTitle}>Membro de</Text>
                <Text style={styles.membersPreviewSub}>{userOrgs.length} {userOrgs.length === 1 ? 'organização' : 'organizações'}</Text>
              </View>

              <View style={styles.membersPreviewRight}>
                <View style={styles.avatarStack}>
                  {userOrgs.slice(0, 3).map((orgItem, index) => {
                    const orgAvatarUri = orgItem.picture_profile ? getImageUrl(orgItem.picture_profile) : null;
                    return (
                      <Image 
                        key={orgItem.id?.toString() || index.toString()} 
                        source={orgAvatarUri ? { uri: orgAvatarUri } : orgPlaceholder} 
                        style={[styles.stackedAvatar, { right: index * 14 }]} 
                      />
                    );
                  })}
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Feed de Eventos com Alternância */}
        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>Eventos</Text>

          {/* Sub-abas de Eventos (Criados / Interesses / Curtidos) */}
          <View style={styles.subTabContainer}>
            <TouchableOpacity 
              style={[styles.subTabButton, eventTab === 'criados' && styles.activeSubTabButton]} 
              onPress={() => setEventTab('criados')}
            >
              <Text style={[styles.subTabText, eventTab === 'criados' && styles.activeSubTabText]}>Criados</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.subTabButton, eventTab === 'interesses' && styles.activeSubTabButton]} 
              onPress={() => setEventTab('interesses')}
            >
              <Text style={[styles.subTabText, eventTab === 'interesses' && styles.activeSubTabText]}>Interesses</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.subTabButton, eventTab === 'curtidos' && styles.activeSubTabButton]} 
              onPress={() => setEventTab('curtidos')}
            >
              <Text style={[styles.subTabText, eventTab === 'curtidos' && styles.activeSubTabText]}>Curtidos</Text>
            </TouchableOpacity>
          </View>

          {eventsLoading ? (
            <ActivityIndicator size="small" color={colors.orangePrimary} style={{ marginVertical: 20 }} />
          ) : eventsList.length === 0 ? (
            <Text style={styles.emptyModalText}>Nenhum evento encontrado.</Text>
          ) : (
            eventsList.map((item) => {
              const dateObj = new Date(item.start_date);
              const formattedDate = dateObj.toLocaleDateString('pt-BR');
              const formattedTime = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

              return (
                <EventCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  organizer={item.organizer_name || "Organização"}
                  location={item.local}
                  dates={formattedDate}
                  time={formattedTime}
                  free={true}
                />
              );
            })
          )}
        </View>

      </ScrollView>

      {/* Modal de Organizações (Estilo idêntico ao da página de Org) */}
      <UserOverlayModal visible={modalType === 'orgs'} onClose={() => setModalType(null)} title="Organizações">
        <FlatList
          data={userOrgs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item: orgItem }) => {
            const orgAvatarUri = orgItem.picture_profile ? getImageUrl(orgItem.picture_profile) : null;
            return (
              <TouchableOpacity 
                style={styles.orgCardContainer}
                onPress={() => {
                  setModalType(null);
                  router.push(`/social/org/${orgItem.id}`);
                }}
              >
                <Image 
                  source={orgAvatarUri ? { uri: orgAvatarUri } : orgPlaceholder} 
                  style={styles.orgAvatar} 
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.orgName} numberOfLines={1}>{orgItem.name}</Text>
                  <Text style={styles.orgSub} numberOfLines={2}>{orgItem.description || "Sem descrição"}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={<Text style={styles.emptyModalText}>Nenhuma organização vinculada.</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </UserOverlayModal>

      {/* Modal de Seguidores */}
      <UserListModal
        visible={modalType === 'followers'}
        onClose={() => setModalType(null)}
        title="Seguidores"
        users={followersList}
        currentLoggedUserId={currentLoggedUserId}
        followingIds={followingIds}
        onSelectUser={(userId) => {
          setModalType(null);
          router.push(`/social/user/${userId}`);
        }}
        emptyMessage="Nenhum seguidor encontrado."
      />

      {/* Modal de Seguindo */}
      <UserListModal
        visible={modalType === 'following'}
        onClose={() => setModalType(null)}
        title="Seguindo"
        users={followingList}
        currentLoggedUserId={currentLoggedUserId}
        followingIds={followingIds}
        onSelectUser={(userId) => {
          setModalType(null);
          router.push(`/social/user/${userId}`);
        }}
        emptyMessage="Não está seguindo ninguém."
      />

      {/* Modal de Edição de Perfil */}
      <UserOverlayModal visible={modalType === 'edit'} onClose={() => setModalType(null)} title="Editar Perfil">
        <ScrollView contentContainerStyle={styles.editForm}>
          
          <View style={styles.editPhotoContainer}>
            <Image 
              source={selectedImageUri ? { uri: selectedImageUri } : (user.picture_profile ? { uri: getImageUrl(user.picture_profile)! } : userPlaceholder)} 
              style={styles.editAvatarPreview} 
            />
            <TouchableOpacity style={styles.changePhotoButton} onPress={handlePickImage}>
              <Text style={styles.changePhotoText}>Alterar foto de perfil</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} value={editName} onChangeText={setEditName} placeholderTextColor={colors.textSecondary} />

          <Text style={styles.label}>Nickname</Text>
          <TextInput style={styles.input} value={editNickname} onChangeText={setEditNickname} placeholderTextColor={colors.textSecondary} />

          <Text style={styles.label}>Bio</Text>
          <TextInput style={[styles.input, styles.textArea]} value={editBio} onChangeText={setEditBio} multiline placeholderTextColor={colors.textSecondary} />

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </ScrollView>
      </UserOverlayModal>

    </View>
  );
}

const styles = StyleSheet.create({
  centered: { justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { padding: 16, paddingBottom: 40 },
  profileHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 24 },
  avatar: { width: 90, height: 90, borderRadius: 12 },
  userInfo: { flex: 1 },
  topHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  nameContainer: { flex: 1, marginRight: 8 },
  name: { color: colors.textPrimaryDark, fontSize: 18, fontWeight: 'bold' },
  nickname: { color: colors.textSecondary, fontSize: 13 },
  iconButton: { padding: 8, backgroundColor: colors.backgroundDarkSecondary, borderRadius: 8, borderWidth: 1, borderColor: colors.backgroundDarkSecondary },
  followButton: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center', minWidth: 90 },
  followButtonPrimary: { backgroundColor: colors.orangePrimary, borderColor: colors.orangePrimary },
  followingButton: { backgroundColor: 'transparent', borderColor: colors.textSecondary },
  followButtonText: { fontWeight: 'bold', fontSize: 12 },
  followButtonTextPrimary: { color: '#FFF' },
  followingButtonText: { color: colors.textPrimaryDark },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  statText: { color: colors.textSecondary, fontSize: 12 },
  statBold: { color: colors.textPrimaryDark, fontWeight: 'bold' },
  bio: { color: colors.textPrimaryDark, fontSize: 13, marginBottom: 10 },
  membersPreviewCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.backgroundDarkSecondary, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: colors.backgroundDarkSecondary },
  membersPreviewLeft: { flex: 1 },
  membersPreviewTitle: { color: colors.orangePrimary, fontSize: 11, fontWeight: 'bold', marginBottom: 2 },
  membersPreviewSub: { color: colors.textSecondary, fontSize: 11 },
  membersPreviewRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatarStack: { flexDirection: 'row', height: 26, width: 55, alignItems: 'center', position: 'relative' },
  stackedAvatar: { width: 26, height: 26, borderRadius: 13, position: 'absolute', borderWidth: 2, borderColor: colors.backgroundDarkSecondary },
  subTabContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, gap: 6 },
  subTabButton: { flex: 1, paddingVertical: 6, paddingHorizontal: 6, borderRadius: 6, backgroundColor: colors.backgroundDarkSecondary, alignItems: 'center', borderWidth: 1, borderColor: colors.backgroundDarkSecondary },
  activeSubTabButton: { borderColor: colors.orangePrimary, backgroundColor: 'transparent' },
  subTabText: { color: colors.textSecondary, fontSize: 11, fontWeight: 'bold' },
  activeSubTabText: { color: colors.orangePrimary },
  postsSection: { marginTop: 10 },
  sectionTitle: { color: colors.textPrimaryDark, fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  emptyModalText: { color: colors.textSecondary, textAlign: 'center', padding: 20 },
  orgCardContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroundDarkSecondary, padding: 10, borderRadius: 8, marginBottom: 8, gap: 12 },
  orgAvatar: { width: 40, height: 40, borderRadius: 8 },
  orgName: { color: colors.textPrimaryDark, fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  orgSub: { color: colors.textSecondary, fontSize: 12 },
  editForm: { gap: 12, paddingBottom: 10 },
  editPhotoContainer: { alignItems: 'center', marginBottom: 10 },
  editAvatarPreview: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  changePhotoButton: { paddingVertical: 4, paddingHorizontal: 10 },
  changePhotoText: { color: colors.orangePrimary, fontSize: 12, fontWeight: 'bold' },
  label: { color: colors.textSecondary, fontSize: 12, fontWeight: 'bold' },
  input: { backgroundColor: colors.backgroundDarkSecondary, borderWidth: 1, borderColor: colors.backgroundDarkSecondary, borderRadius: 8, padding: 10, color: colors.textPrimaryDark, fontSize: 14 },
  textArea: { height: 80, textAlignVertical: 'top' },
  saveButton: { backgroundColor: colors.orangePrimary, padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  saveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 }
});