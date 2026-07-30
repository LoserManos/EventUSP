// src/app/social/org/[id].tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, globalStyles } from '@/styles/global';
import { useAuth } from '@/contexts/AuthContext';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { getImageUrl } from '@/utils/image';
import { orgService } from '@/services/orgService'; // Importação do orgService para buscar o status do membro

// Hooks Modularizados
import { useFetchOrg } from '@/hooks/useFetchOrg';
import { useOrgActions } from '@/hooks/useOrgActions';
import { useOrgEdit } from '@/hooks/useOrgEdit';

// Componentes e Modais
import { UserOverlayModal } from '@/components/UserOverlayModal';
import { EditOrgModal } from '@/components/EditOrgModal';

const orgPlaceholder = require('@/assets/images/LA.png');
const userPlaceholder = require('@/assets/images/LA.png');

export default function OrgProfilePage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { userProfile: authUser } = useAuth(); 
  const currentLoggedUserId = authUser?.id;
  const numericOrgId = Number(id);

  const [modalType, setModalType] = useState<'members' | 'pending' | 'edit' | null>(null);

  const {
    org,
    setOrg,
    loading,
    isOwner,
    membershipStatus,
    setMembershipStatus,
    isAdminOrOwner,
    membersList,
    setMembersList,
    membersCount,
    setMembersCount,
    pendingList,
    setPendingList,
    pendingCount,
    setPendingCount,
    refetch,
  } = useFetchOrg(numericOrgId, currentLoggedUserId);

  const actions = useOrgActions(
    numericOrgId,
    membershipStatus,
    setMembershipStatus,
    setPendingList,
    setPendingCount,
    setMembersList,
    setMembersCount,
    setOrg,
    router,
    setModalType
  );

  const edit = useOrgEdit(org, numericOrgId, () => {
    refetch();
    setModalType(null);
  });

  // Função customizada para abrir o modal de membros buscando os cargos reais na tabela de junção
  const handleOpenMembersModal = async () => {
    setModalType('members');
    try {
      if (membersList.length > 0) {
        const updatedMembers = await Promise.all(
          membersList.map(async (member: any) => {
            if (!member.id) return member;
            const statusData = await orgService.getMemberStatus(numericOrgId, member.id);
            return {
              ...member,
              role: statusData ? statusData.role : member.role // Sobrescreve com o role correto da organização
            };
          })
        );
        setMembersList(updatedMembers);
      }
    } catch (error) {
      console.error("Erro ao sincronizar cargos dos membros:", error);
    }
  };

  if (loading) {
    return (
      <View style={[globalStyles.container, globalStyles.centered]}>
        <ActivityIndicator size="large" color={colors.orangePrimary} />
      </View>
    );
  }

  if (!org) {
    return (
      <View style={[globalStyles.container, globalStyles.centered]}>
        <Text style={{ color: colors.textSecondary }}>Organização não encontrada.</Text>
      </View>
    );
  }

  const renderUserListModalContent = (users: any[], type: 'members' | 'pending') => (
    <FlatList
      data={users}
      keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
      renderItem={({ item: userItem }) => {
        const isItemOwner = userItem.id === org.creator_id;
        const avatarUri = userItem.picture_profile ? getImageUrl(userItem.picture_profile) : null;
        
        // Verificação baseada no role da organização ('admin')
        const isCurrentlyAdmin = userItem.role === 'admin';

        return (
          <View style={globalStyles.socialItemContainer}>
            <Image 
                source={avatarUri ? { uri: avatarUri } : userPlaceholder} 
                style={globalStyles.itemPicture} 
            />
            <TouchableOpacity 
              style={globalStyles.itemInfoContainer}
              onPress={() => {
                setModalType(null);
                router.push(`/social/user/${userItem.id}`);
              }}
            >
              <View style={globalStyles.itemInfoContainer}>
                <Text style={globalStyles.primaryText} numberOfLines={1}>{userItem.name}</Text>
                <Text style={[globalStyles.secondaryText, {color: colors.orangePrimary}]}>
                  {type === 'members' ? (isItemOwner ? 'Dono' : (isCurrentlyAdmin ? 'Administrador' : 'Membro')) : 'Solicitante'}
                </Text>
              </View>
            </TouchableOpacity>

            {type === 'pending' && (
              <TouchableOpacity 
                style={[globalStyles.interactionButton, globalStyles.blueInteractionButton]}
                onPress={() => userItem.id && actions.handleAcceptMember(userItem.id, pendingList)}
              >
                <Text style={[globalStyles.interactionButtonText, globalStyles.primaryInteractionText]}>Aceitar</Text>
              </TouchableOpacity>
            )}

            {type === 'members' && (
              <View style={globalStyles.iconsTab}>
              {isOwner && !isItemOwner && (
                <TouchableOpacity 
                  style={[globalStyles.iconButton, {borderColor: colors.orangePrimary}]}
                  onPress={() => actions.handleTransferOwnership(userItem.id!, userItem.name)}
                >
                  <FontAwesome6 name="crown" size={16} color={colors.orangePrimary} />
                </TouchableOpacity>
              )}

              {isAdminOrOwner && !isItemOwner && (
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  <TouchableOpacity 
                    style={[
                      globalStyles.interactionButton, 
                      isCurrentlyAdmin ?
                      globalStyles.redInteractionButton :
                      globalStyles.blueInteractionButton
                    ]}
                    onPress={() => actions.handleRoleToggle(userItem.id!, userItem.name, isCurrentlyAdmin, setMembersList)}
                  >
                    <Text style={[
                      globalStyles.interactionButtonText,
                      globalStyles.primaryInteractionText
                    ]}>
                      {isCurrentlyAdmin ? 'Rebaixar' : 'Promover'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            )}
          </View>
        );
      }}
      ListEmptyComponent={<Text style={globalStyles.empty}>Nenhum registro encontrado.</Text>}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      style={globalStyles.itemsList}
    />
  );

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={[]} 
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        ListHeaderComponent={
          <>
            {/* Cabeçalho da Organização */}
            <View style={[globalStyles.profileHeader, { marginTop: 40 }]}>
              <Image 
                source={org.picture_profile ? { uri: getImageUrl(org.picture_profile)! } : orgPlaceholder} 
                style={globalStyles.profilePicture}
              />
              
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={globalStyles.primaryText}>{org.name}</Text>
                  </View>

                  {isOwner ? (
                    <View style={globalStyles.iconsTab}>
                      <TouchableOpacity style={[globalStyles.iconButton, {borderColor: colors.bluePrimary}]} onPress={() => setModalType('edit')}>
                        <Ionicons name="pencil" size={16} color={colors.bluePrimary} />
                      </TouchableOpacity>
                      <TouchableOpacity style={[globalStyles.iconButton, {borderColor: colors.redWarning}]} onPress={actions.handleDeleteOrg}>
                        <Ionicons name="trash" size={16} color={colors.redWarning} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={[
                        globalStyles.interactionButton, 
                        membershipStatus === 'none' ?
                        globalStyles.blueInteractionButton :
                        globalStyles.pressedInteractionButton
                      ]} 
                      onPress={actions.handleMembershipAction}
                    >
                      <Text style={[
                        globalStyles.interactionButtonText, 
                        membershipStatus === 'none' ?
                        globalStyles.primaryInteractionText :
                        globalStyles.pressedInteractionText
                      ]}>
                        {membershipStatus === 'member' ?
                        'Sair' : 
                        membershipStatus === 'pending' ?
                          'Pendente' :
                          'Participar'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {org.description && <Text style={globalStyles.profileDescription}>{org.description}</Text>}
              </View>
            </View>

            {/* Seção de Membros */}
            <View style={globalStyles.listPreviewContainer}>
              <Text style={globalStyles.primaryText}>
                Membros: <Text style={[globalStyles.primaryText, {color: colors.bluePrimary}]}>{membersCount}</Text>
              </Text>

              <TouchableOpacity style={globalStyles.listPreviewCard} 
                                onPress={handleOpenMembersModal} 
                                activeOpacity={0.85}
              >
                <View style={globalStyles.listPreviewPictureList}>
                  {membersList.slice(0, 3).map((member, index) => {
                    const avatarUri = member.picture_profile ? getImageUrl(member.picture_profile) : null;
                    return (
                      <Image 
                        key={member.id?.toString() || index.toString()} 
                        source={avatarUri ? { uri: avatarUri } : userPlaceholder} 
                        style={globalStyles.listPreviewPicture}
                      />
                    );
                  })}
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Seção de Pedidos Pendentes */}
            {isAdminOrOwner && (
              <View style={globalStyles.listPreviewContainer}>
                <Text style={globalStyles.primaryText}>
                  Solicitações Pendentes: <Text style={[globalStyles.primaryText, {color: colors.bluePrimary}]}>{pendingCount}</Text>
                </Text>

                <TouchableOpacity style={globalStyles.listPreviewCard} 
                                  onPress={() => setModalType('pending')} 
                                  activeOpacity={0.85}
                >
                  <View style={globalStyles.listPreviewPictureList}>
                    {pendingList.slice(0, 3).map((user, index) => {
                      const avatarUri = user.picture_profile ? getImageUrl(user.picture_profile) : null;
                      return (
                        <Image 
                          key={user.id?.toString() || index.toString()} 
                          source={avatarUri ? { uri: avatarUri } : userPlaceholder} 
                          style={globalStyles.listPreviewPicture} 
                        />
                      );
                    })}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}

            <View style={{ marginTop: 10 }}>
              <Text style={globalStyles.primaryText}>Eventos</Text>
              <View style={{ padding: 20, backgroundColor: colors.backgroundDark, borderRadius: 12, alignItems: 'center', marginTop: 8 }}>
                <Text style={{ color: colors.textSecondary }}>Em breve...</Text>
              </View>
            </View>
          </>
        }
        renderItem={null}
      />

      {/* Modais */}
      <UserOverlayModal visible={modalType === 'members'} onClose={() => setModalType(null)} title="Membros da Organização">
        {renderUserListModalContent(membersList, 'members')}
      </UserOverlayModal>

      <UserOverlayModal visible={modalType === 'pending'} onClose={() => setModalType(null)} title="Solicitações Pendentes">
        {renderUserListModalContent(pendingList, 'pending')}
      </UserOverlayModal>

      <EditOrgModal 
        visible={modalType === 'edit'} 
        onClose={() => setModalType(null)} 
        org={org}
        editName={edit.editName}
        setEditName={edit.setEditName}
        editDescription={edit.editDescription}
        setDescription={edit.setEditDescription}
        selectedImageUri={edit.selectedImageUri}
        handlePickImage={edit.handlePickImage}
        handleSaveOrg={edit.handleSaveOrg}
      />
    </View>
  );
}