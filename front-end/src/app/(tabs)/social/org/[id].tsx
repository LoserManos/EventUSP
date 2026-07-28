// src/app/social/org/[id].tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, globalStyles } from '@/styles/global';
import { useAuth } from '@/contexts/AuthContext';
import { Organization } from '@/types/org';
import { User } from '@/types/user';
import { orgService } from '@/services/orgService';
import { UserOverlayModal } from '@/components/UserOverlayModal';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getImageUrl } from '@/utils/image';

const orgPlaceholder = require('@/assets/images/LA.png');
const userPlaceholder = require('@/assets/images/LA.png');

export default function OrgProfilePage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { userProfile: authUser } = useAuth(); 

  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  
  const currentLoggedUserId = authUser?.id; 
  const isOwner = org?.creator_id && currentLoggedUserId ? org.creator_id === currentLoggedUserId : false;

  const [membershipStatus, setMembershipStatus] = useState<'none' | 'pending' | 'member'>('none');
  const [modalType, setModalType] = useState<'members' | 'pending' | 'edit' | null>(null);
  
  const [membersList, setMembersList] = useState<User[]>([]);
  const [membersCount, setMembersCount] = useState(0);

  const [pendingList, setPendingList] = useState<User[]>([]);
  const [pendingCount, setPendingCount] = useState(0);

  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  // Verifica se o usuário logado é Administrador ou Dono
  const [isAdminOrOwner, setIsAdminOrOwner] = useState(false);

  useEffect(() => {
    async function fetchOrgData() {
      try {
        const orgId = Number(id);
        const data = await orgService.getOrg(orgId);
        setOrg(data);
        setEditName(data.name);
        setEditDescription(data.description);

        const members = await orgService.getOrgMembers(orgId);
        setMembersList(members);
        setMembersCount(members.length);

        if (currentLoggedUserId) {
          try {
            const membershipInfo = await orgService.getMemberStatus(orgId, currentLoggedUserId);
            
            if (!membershipInfo) {
              setMembershipStatus('none');
              setIsAdminOrOwner(data.creator_id === currentLoggedUserId);
            } else {
              if (membershipInfo.status === true) {
                setMembershipStatus('member');
              } else {
                setMembershipStatus('pending');
              }
              const adminOrOwner = (data.creator_id === currentLoggedUserId) || (membershipInfo.role === 'ADMIN');
              setIsAdminOrOwner(adminOrOwner);

              if (adminOrOwner) {
                const pendings = await orgService.getPendingOrgMembers(orgId);
                setPendingList(pendings);
                setPendingCount(pendings.length);
              }
            }
          } catch {
            setMembershipStatus('none');
            setIsAdminOrOwner(data.creator_id === currentLoggedUserId);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados da organização:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchOrgData();
  }, [id, currentLoggedUserId]);

  const handleMembershipAction = () => {
    if (membershipStatus === 'member') {
      Alert.alert(
        "Sair da Organização",
        "Tem certeza que deseja sair desta organização?",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Sair", 
            style: "destructive", 
            onPress: async () => {
              try {
                await orgService.leaveOrg(Number(id));
                setMembershipStatus('none');
              } catch (error) {
                console.error("Erro ao sair:", error);
              }
            } 
          }
        ]
      );
    } else if (membershipStatus === 'none') {
      orgService.joinOrg(Number(id)).then(() => {
        setMembershipStatus('pending');
      }).catch(err => console.error("Erro ao solicitar entrada:", err));
    }
  };

  const handleAcceptMember = async (userId: number) => {
    try {
      await orgService.approveMember(Number(id), userId);
      // Move o usuário da lista de pendentes para a lista de membros
      const acceptedUser = pendingList.find(u => u.id === userId);
      if (acceptedUser) {
        setPendingList(prev => prev.filter(u => u.id !== userId));
        setPendingCount(prev => prev - 1);
        setMembersList(prev => [...prev, acceptedUser]);
        setMembersCount(prev => prev + 1);
      }
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.detail || "Não foi possível aceitar o membro.");
    }
  };

  const handleDeleteOrg = () => {
    Alert.alert(
      "Excluir Organização",
      "Tem certeza absoluta que deseja excluir esta organização?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            try {
              await orgService.deleteOrg(Number(id));
              router.replace('/(tabs)');
            } catch (error) {
              console.error("Erro ao excluir:", error);
            }
          }
        }
      ]
    );
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

  const handleSaveOrg = async () => {
    try {
      const updated = await orgService.updateOrg(Number(id), {
        name: editName,
        description: editDescription,
      });

      let newPictureProfile = org?.picture_profile;

      if (selectedImageUri) {
        const photoResponse = await orgService.uploadOrgPhoto(Number(id), {
          uri: selectedImageUri,
          name: selectedImageUri.split('/').pop() || 'org.jpg',
          type: 'image/jpeg',
        });
        newPictureProfile = photoResponse.picture_profile;
      }

      setOrg((prev) => prev ? { 
        ...prev, 
        ...updated, 
        picture_profile: newPictureProfile !== undefined ? newPictureProfile : prev.picture_profile 
      } : prev);

      setModalType(null);
      setSelectedImageUri(null);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  if (loading) {
    return (
      <View style={[globalStyles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.orangePrimary} />
      </View>
    );
  }

  if (!org) {
    return (
      <View style={[globalStyles.container, styles.centered]}>
        <Text style={{ color: colors.textSecondary }}>Organização não encontrada.</Text>
      </View>
    );
  }

// Componente Genérico de Lista de Usuários Atualizado com Ações de Cargo
  const renderUserListModalContent = (
    users: any[], // Usamos any ou um tipo estendido caso traga dados da tabela intermédia
    type: 'members' | 'pending'
  ) => (
    <FlatList
      data={users}
      keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
      renderItem={({ item: userItem }) => {
        const isItemOwner = userItem.id === org.creator_id;
        const avatarUri = userItem.picture_profile ? getImageUrl(userItem.picture_profile) : null;
        
        // O cargo na organização pode vir direto no objeto se a API fizer o join, ex: userItem.role (da org) ou userItem.org_role
        const currentOrgRole = userItem.role; 
        const isCurrentlyAdmin = currentOrgRole === 'admin';

        return (
          <View style={styles.memberCardContainer}>
            <TouchableOpacity 
              style={styles.memberInfoWrapper} 
              onPress={() => {
                setModalType(null);
                router.push(`/social/user/${userItem.id}`);
              }}
            >
              <Image 
                source={avatarUri ? { uri: avatarUri } : userPlaceholder} 
                style={styles.memberAvatar} 
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.memberName} numberOfLines={1}>{userItem.name}</Text>
                <Text style={styles.memberRoleTag}>
                  {type === 'members' ? (isItemOwner ? 'Dono' : (isCurrentlyAdmin ? 'Administrador' : 'Membro')) : 'Solicitante'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Ações específicas para cada tipo de lista */}
            {type === 'pending' && (
              <TouchableOpacity 
                style={styles.actionButtonPrimary}
                onPress={() => userItem.id && handleAcceptMember(userItem.id)}
              >
                <Text style={styles.actionButtonText}>Aceitar</Text>
              </TouchableOpacity>
            )}

            {/* Botão de Transferir Posse (Apenas para o Dono atual para outros membros) */}
            {type === 'members' && isOwner && !isItemOwner && (
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => {
                  Alert.alert(
                    "Transferir Posse",
                    `Deseja transferir a propriedade da organização para ${userItem.name}? Você se tornará um administrador.`,
                    [
                      { text: "Cancelar", style: "cancel" },
                      { 
                        text: "Confirmar", 
                        style: "destructive",
                        onPress: async () => {
                          try {
                            await orgService.transferOwnership(Number(id), userItem.id!);
                            
                            // Atualiza o criador localmente ou recarrega a org
                            setOrg(prev => prev ? { ...prev, creator_id: userItem.id! } : prev);
                            setModalType(null);
                            
                            Alert.alert("Sucesso", "A posse da organização foi transferida com sucesso!");
                          } catch (error: any) {
                            Alert.alert("Erro", error.response?.data?.detail || "Não foi possível transferir a posse.");
                          }
                        } 
                      }
                    ]
                  );
                }}
              >
                <FontAwesome6 name="crown" size={18} color="#F59E0B" />
              </TouchableOpacity>
            )}

            {/* Botão de Promover / Rebaixar Alternante */}
            {type === 'members' && isAdminOrOwner && !isItemOwner && (
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <TouchableOpacity 
                  style={[
                    styles.actionButtonSecondary, 
                    isCurrentlyAdmin && styles.actionButtonDemote
                  ]}
                  onPress={async () => {
                    const actionName = isCurrentlyAdmin ? 'rebaixar para membro' : 'promover a administrador';

                    Alert.alert(
                      "Alterar Cargo",
                      `Deseja ${actionName} o usuário ${userItem.name}?`,
                      [
                        { text: "Cancelar", style: "cancel" },
                        { 
                          text: "Confirmar", 
                          onPress: async () => {
                            try {
                              if (isCurrentlyAdmin) {
                                await orgService.DemoteMember(Number(id), userItem.id!);
                              } else {
                                await orgService.PromoteMember(Number(id), userItem.id!);
                              }
                              
                              const newOrgRole = isCurrentlyAdmin ? 'member' : 'admin';
                              
                              // Atualiza o estado local da lista refletindo a mudança na hora com segurança de tipos
                              setMembersList(prev => prev.map(u => 
                                u.id === userItem.id ? { ...u, role: newOrgRole } : u
                              ) as any);
                              
                              Alert.alert("Sucesso", "Cargo atualizado com sucesso!");
                            } catch (error: any) {
                              Alert.alert("Erro", error.response?.data?.detail || "Não foi possível alterar o cargo.");
                            }
                          } 
                        }
                      ]
                    );
                  }}
                >
                  <Text style={[
                    styles.actionButtonSecondaryText,
                    isCurrentlyAdmin && styles.actionButtonDemoteText
                  ]}>
                    {isCurrentlyAdmin ? 'Rebaixar' : 'Promover'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      }}
      ListEmptyComponent={<Text style={styles.emptyModalText}>Nenhum registro encontrado.</Text>}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    />
  );

  return (
    <View style={globalStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.profileHeader}>
          <Image 
            source={org.picture_profile ? { uri: getImageUrl(org.picture_profile)! } : orgPlaceholder} 
            style={styles.avatar} 
          />
          
          <View style={styles.userInfo}>
            <View style={styles.topHeaderRow}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{org.name}</Text>
              </View>

              {isOwner ? (
                <View style={styles.ownerActions}>
                  <TouchableOpacity style={styles.iconButton} onPress={() => setModalType('edit')}>
                    <Ionicons name="pencil" size={18} color={colors.textPrimaryDark} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.iconButton, styles.deleteIconButton]} onPress={handleDeleteOrg}>
                    <Ionicons name="trash" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={[
                    styles.followButton, 
                    membershipStatus === 'member' ? styles.followingButton : styles.followButtonPrimary
                  ]} 
                  onPress={handleMembershipAction}
                >
                  <Text style={[
                    styles.followButtonText, 
                    membershipStatus === 'member' ? styles.followingButtonText : styles.followButtonTextPrimary
                  ]}>
                    {membershipStatus === 'member' ? 'Sair' : membershipStatus === 'pending' ? 'Pendente' : 'Participar'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {org.description && <Text style={styles.bio}>{org.description}</Text>}
          </View>
        </View>

        {/* Seção de Membros */}
        <View style={styles.membersSectionContainer}>
          <Text style={styles.membersSectionLabel}>
            <Text style={styles.statBold}>{membersCount}</Text> {membersCount === 1 ? 'membro' : 'membros'}
          </Text>

          <TouchableOpacity style={styles.membersPreviewCard} onPress={() => setModalType('members')} activeOpacity={0.85}>
            <View style={styles.membersPreviewLeft}>
              <Text style={styles.membersPreviewTitle}>Membros da Organização</Text>
              <Text style={styles.membersPreviewSub}>Toque para ver todos</Text>
            </View>

            <View style={styles.membersPreviewRight}>
              <View style={styles.avatarStack}>
                {membersList.slice(0, 3).map((member, index) => {
                  const avatarUri = member.picture_profile ? getImageUrl(member.picture_profile) : null;
                  return (
                    <Image 
                      key={member.id?.toString() || index.toString()} 
                      source={avatarUri ? { uri: avatarUri } : userPlaceholder} 
                      style={[styles.stackedAvatar, { right: index * 14 }]} 
                    />
                  );
                })}
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Seção de Pedidos Pendentes (Apenas para Admins/Dono) */}
        {isAdminOrOwner && (
          <View style={styles.membersSectionContainer}>
            <Text style={styles.membersSectionLabel}>
              <Text style={styles.statBold}>{pendingCount}</Text> {pendingCount === 1 ? 'pedido pendente' : 'pedidos pendentes'}
            </Text>

            <TouchableOpacity style={styles.membersPreviewCard} onPress={() => setModalType('pending')} activeOpacity={0.85}>
              <View style={styles.membersPreviewLeft}>
                <Text style={styles.membersPreviewTitle}>Solicitações Pendentes</Text>
                <Text style={styles.membersPreviewSub}>Toque para gerenciar pedidos</Text>
              </View>

              <View style={styles.membersPreviewRight}>
                <View style={styles.avatarStack}>
                  {pendingList.slice(0, 3).map((user, index) => {
                    const avatarUri = user.picture_profile ? getImageUrl(user.picture_profile) : null;
                    return (
                      <Image 
                        key={user.id?.toString() || index.toString()} 
                        source={avatarUri ? { uri: avatarUri } : userPlaceholder} 
                        style={[styles.stackedAvatar, { right: index * 14 }]} 
                      />
                    );
                  })}
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>Eventos</Text>
          <View style={styles.postCardPlaceholder}>
            <Text style={{ color: colors.textSecondary }}>Em breve...</Text>
          </View>
        </View>

      </ScrollView>

      {/* Modal de Membros */}
      <UserOverlayModal visible={modalType === 'members'} onClose={() => setModalType(null)} title="Membros da Organização">
        {renderUserListModalContent(membersList, 'members')}
      </UserOverlayModal>

      {/* Modal de Pedidos Pendentes */}
      <UserOverlayModal visible={modalType === 'pending'} onClose={() => setModalType(null)} title="Solicitações Pendentes">
        {renderUserListModalContent(pendingList, 'pending')}
      </UserOverlayModal>

      {/* Modal de Edição */}
      <UserOverlayModal visible={modalType === 'edit'} onClose={() => setModalType(null)} title="Editar Organização">
        <ScrollView contentContainerStyle={styles.editForm}>
          
          <View style={styles.editPhotoContainer}>
            <Image 
              source={selectedImageUri ? { uri: selectedImageUri } : (org.picture_profile ? { uri: getImageUrl(org.picture_profile)! } : orgPlaceholder)} 
              style={styles.editAvatarPreview} 
            />
            <TouchableOpacity style={styles.changePhotoButton} onPress={handlePickImage}>
              <Text style={styles.changePhotoText}>Alterar foto da organização</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} value={editName} onChangeText={setEditName} placeholderTextColor={colors.textSecondary} />

          <Text style={styles.label}>Descrição</Text>
          <TextInput style={[styles.input, styles.textArea]} value={editDescription} onChangeText={setEditDescription} multiline placeholderTextColor={colors.textSecondary} />

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveOrg}>
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
  ownerActions: { flexDirection: 'row', gap: 6 },
  iconButton: { padding: 8, backgroundColor: colors.backgroundDarkSecondary, borderRadius: 8, borderWidth: 1, borderColor: colors.backgroundDarkSecondary },
  deleteIconButton: { borderColor: 'rgba(239, 68, 68, 0.3)' },
  followButton: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center', minWidth: 90 },
  followButtonPrimary: { backgroundColor: colors.orangePrimary, borderColor: colors.orangePrimary },
  followingButton: { backgroundColor: 'transparent', borderColor: colors.textSecondary },
  followButtonText: { fontWeight: 'bold', fontSize: 12 },
  followButtonTextPrimary: { color: '#FFF' },
  followingButtonText: { color: colors.textPrimaryDark },
  bio: { color: colors.textPrimaryDark, fontSize: 13, marginBottom: 10 },
  membersSectionContainer: { marginBottom: 16 },
  membersSectionLabel: { color: colors.textSecondary, fontSize: 12, marginBottom: 8 },
  statBold: { color: colors.textPrimaryDark, fontWeight: 'bold' },
  membersPreviewCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.backgroundDarkSecondary, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: colors.backgroundDarkSecondary },
  membersPreviewLeft: { flex: 1 },
  membersPreviewTitle: { color: colors.textPrimaryDark, fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  membersPreviewSub: { color: colors.textSecondary, fontSize: 12 },
  membersPreviewRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatarStack: { flexDirection: 'row', height: 32, width: 65, alignItems: 'center', position: 'relative' },
  stackedAvatar: { width: 32, height: 32, borderRadius: 16, position: 'absolute', borderWidth: 2, borderColor: colors.backgroundDarkSecondary },
  postsSection: { marginTop: 10 },
  sectionTitle: { color: colors.textPrimaryDark, fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  postCardPlaceholder: { padding: 20, backgroundColor: colors.backgroundDark, borderRadius: 12, alignItems: 'center' },
  emptyModalText: { color: colors.textSecondary, textAlign: 'center', padding: 20 },
  memberCardContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.backgroundDarkSecondary, padding: 10, borderRadius: 8, marginBottom: 8 },
  memberInfoWrapper: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  memberAvatar: { width: 40, height: 40, borderRadius: 20 },
  memberName: { color: colors.textPrimaryDark, fontWeight: 'bold', fontSize: 14 },
  memberRoleTag: { color: colors.orangePrimary, fontSize: 11 },
  actionButtonPrimary: { backgroundColor: colors.orangePrimary, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  actionButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  editForm: { gap: 12, paddingBottom: 10 },
  editPhotoContainer: { alignItems: 'center', marginBottom: 10 },
  editAvatarPreview: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  changePhotoButton: { paddingVertical: 4, paddingHorizontal: 10 },
  changePhotoText: { color: colors.orangePrimary, fontSize: 12, fontWeight: 'bold' },
  label: { color: colors.textSecondary, fontSize: 12, fontWeight: 'bold' },
  input: { backgroundColor: colors.backgroundDarkSecondary, borderWidth: 1, borderColor: colors.backgroundDarkSecondary, borderRadius: 8, padding: 10, color: colors.textPrimaryDark, fontSize: 14 },
  textArea: { height: 80, textAlignVertical: 'top' },
  saveButton: { backgroundColor: colors.orangePrimary, padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  saveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  actionButtonSecondary: { backgroundColor: colors.backgroundDark, borderWidth: 1, borderColor: colors.orangePrimary, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  actionButtonSecondaryText: { color: colors.orangePrimary, fontSize: 11, fontWeight: 'bold' },
  actionButtonDemote: { 
    borderColor: '#EF4444', 
    backgroundColor: 'transparent' 
  },
  actionButtonDemoteText: { 
    color: '#EF4444' 
  },
});