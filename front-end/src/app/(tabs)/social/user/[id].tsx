// src/app/social/user/[id].tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, globalStyles } from '@/styles/global';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/user';
import { userService } from '@/services/userService';
import { UserOverlayModal } from '@/components/UserOverlayModal';
import { OrgCard } from '@/components/OrgCard';
import { UserListModal } from '@/components/UserListModal'; // Novo componente isolado
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getImageUrl } from '@/utils/image';

const userPlaceholder = require('@/assets/images/LA.png');

export default function UserProfilePage() {
  const { id } = useLocalSearchParams();
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

            <TouchableOpacity style={styles.memberOfButton} onPress={() => setModalType('orgs')}>
              <Text style={styles.memberOfTitle}>Membro de</Text>
              <View style={styles.memberOfPreviewContainer}>
                <Image source={userPlaceholder} style={styles.orgMiniAvatar} />
                <Text style={styles.memberOfSub}>Ver organizações</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>Publicações</Text>
          <View style={styles.postCardPlaceholder}>
            <Text style={{ color: colors.textSecondary }}>Feed de posts em breve...</Text>
          </View>
        </View>

      </ScrollView>

      {/* Modal de Organizações */}
      <UserOverlayModal visible={modalType === 'orgs'} onClose={() => setModalType(null)} title="Organizações">
        <ScrollView>
          {userOrgs.length === 0 ? <Text style={styles.emptyModalText}>Nenhuma organização vinculada.</Text> : userOrgs.map((org) => <OrgCard key={org.id} org={org} />)}
        </ScrollView>
      </UserOverlayModal>

      {/* Modal de Seguidores (Usando componente separado) */}
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

      {/* Modal de Seguindo (Usando componente separado) */}
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
  memberOfButton: { borderWidth: 1, borderColor: colors.orangePrimary, borderRadius: 8, padding: 8, backgroundColor: colors.backgroundDarkSecondary },
  memberOfTitle: { color: colors.orangePrimary, fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
  memberOfPreviewContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  orgMiniAvatar: { width: 20, height: 20, borderRadius: 4 },
  memberOfSub: { color: colors.textSecondary, fontSize: 11 },
  postsSection: { marginTop: 10 },
  sectionTitle: { color: colors.textPrimaryDark, fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  postCardPlaceholder: { padding: 20, backgroundColor: colors.backgroundDark, borderRadius: 12, alignItems: 'center' },
  emptyModalText: { color: colors.textSecondary, textAlign: 'center', padding: 20 },
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