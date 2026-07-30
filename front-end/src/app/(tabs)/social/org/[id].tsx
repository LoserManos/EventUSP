import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, globalStyles } from '@/styles/global';
import { useAuth } from '@/contexts/AuthContext';
import { FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getImageUrl } from '@/utils/image';

// Hooks Modularizados
import { useFetchOrg } from '@/hooks/useFetchOrg';
import { useOrgActions } from '@/hooks/useOrgActions';
import { useOrgEdit } from '@/hooks/useOrgEdit';

// Modais
import { EditOrgModal } from '@/components/EditOrgModal';

const orgPlaceholder = require('@/assets/images/LA.png');
const userPlaceholder = require('@/assets/images/LA.png');

export default function OrgProfilePage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { userProfile: authUser } = useAuth();
  const currentLoggedUserId = authUser?.id;
  const numericOrgId = Number(id);

  const [modalType, setModalType] = useState<'edit' | null>(null);
  const [tab, setTab] = useState<'events' | 'members' | 'about'>('events');

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

  const avatarUri = org.picture_profile ? { uri: getImageUrl(org.picture_profile)! } : orgPlaceholder;
  const coverUri = avatarUri;

  const renderMemberActions = (userItem: any, isItemOwner: boolean, isCurrentlyAdmin: boolean) => {
    return (
      <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
        {isOwner && !isItemOwner && (
          <TouchableOpacity 
            style={[localStyles.actionIcon, { borderColor: colors.orangePrimary }]}
            onPress={() => actions.handleTransferOwnership(userItem.id, userItem.name)}
          >
            <FontAwesome6 name="crown" size={12} color={colors.orangePrimary} />
          </TouchableOpacity>
        )}
        {isAdminOrOwner && !isItemOwner && (
          <TouchableOpacity 
            style={[
              localStyles.actionBtn, 
              isCurrentlyAdmin ? localStyles.actionBtnDanger : localStyles.actionBtnPrimary
            ]}
            onPress={() => actions.handleRoleToggle(userItem.id, userItem.name, isCurrentlyAdmin, setMembersList)}
          >
            <Text style={[
              localStyles.actionBtnText,
              isCurrentlyAdmin ? localStyles.actionBtnTextDanger : localStyles.actionBtnTextPrimary
            ]}>
              {isCurrentlyAdmin ? 'Rebaixar' : 'Promover'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={localStyles.screenContainer}>
      <ScrollView contentContainerStyle={localStyles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* COVER SECTION */}
        <View style={localStyles.coverContainer}>
          <Image source={coverUri} style={localStyles.coverImage} blurRadius={10} />
          <View style={localStyles.coverOverlay} />
          <View style={localStyles.headerButtons}>
            <TouchableOpacity style={localStyles.iconButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            {isOwner && (
              <TouchableOpacity style={localStyles.iconButton} onPress={() => setModalType('edit')}>
                <Ionicons name="pencil" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* IDENTITY SECTION */}
        <View style={localStyles.identityContainer}>
          <View style={localStyles.avatarWrapper}>
            <Image source={avatarUri} style={localStyles.avatarImage} />
          </View>
          <View style={localStyles.nameRow}>
            <Text style={localStyles.orgName} numberOfLines={1}>{org.name}</Text>
          </View>
          {/* <Text style={localStyles.orgHandle}>@org_{org.id}</Text> */}
        </View>

        {/* STATS SECTION */}
        <View style={localStyles.statsCard}>
          <View style={localStyles.statItem}>
            <Text style={localStyles.statValue}>{membersCount}</Text>
            <Text style={localStyles.statLabel}>Membros</Text>
          </View>
          <View style={localStyles.statDivider} />
          <View style={localStyles.statItem}>
            <Text style={localStyles.statValue}>{org.events_count ?? '--'}</Text>
            <Text style={localStyles.statLabel}>Eventos</Text>
          </View>
          {/* <View style={localStyles.statDivider} />
          <View style={localStyles.statItem}>
            <Text style={localStyles.statValue}>--</Text>
            <Text style={localStyles.statLabel}>Seguidores</Text>
          </View> */}
        </View>

        {/* ACTIONS SECTION */}
        <View style={localStyles.actionsContainer}>
          {!isOwner ? (
            <TouchableOpacity 
              style={[
                localStyles.primaryAction,
                membershipStatus !== 'none' && localStyles.primaryActionActive
              ]} 
              onPress={actions.handleMembershipAction}
            >
              <Text style={[
                localStyles.primaryActionText,
                membershipStatus !== 'none' && localStyles.primaryActionTextActive
              ]}>
                {membershipStatus === 'member' ? 'Participando ✓' : membershipStatus === 'pending' ? 'Pendente...' : 'Participar'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[localStyles.primaryAction, { backgroundColor: 'rgba(255, 69, 58, 0.15)' }]} 
              onPress={actions.handleDeleteOrg}
            >
              <Text style={[localStyles.primaryActionText, { color: colors.redWarning }]}>Excluir Organização</Text>
            </TouchableOpacity>
          )}
          {/* <TouchableOpacity style={localStyles.secondaryAction}>
            <Text style={localStyles.secondaryActionText}>Mensagem</Text>
          </TouchableOpacity> */}
        </View>

        {/* TABS SELECTOR */}
        <View style={localStyles.tabsContainer}>
          {(['events', 'members', 'about'] as const).map(key => {
            const labels = { events: 'Eventos', members: 'Membros', about: 'Sobre' };
            const isActive = tab === key;
            return (
              <TouchableOpacity
                key={key}
                style={[localStyles.tabButton, isActive && localStyles.tabButtonActive]}
                onPress={() => setTab(key)}
              >
                <Text style={[localStyles.tabButtonText, isActive && localStyles.tabButtonTextActive]}>
                  {labels[key]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* TAB CONTENT */}
        <View style={localStyles.tabContent}>
          
          {tab === 'events' && (
            <View style={localStyles.eventsContainer}>
               <View style={localStyles.emptyState}>
                 <Text style={localStyles.emptyStateText}>Nenhum evento encontrado.</Text>
               </View>
            </View>
          )}

          {tab === 'members' && (
            <View style={localStyles.membersContainer}>
              {isAdminOrOwner && pendingList.length > 0 && (
                <View style={localStyles.pendingSection}>
                  <Text style={localStyles.sectionTitle}>Solicitações Pendentes ({pendingCount})</Text>
                  {pendingList.map(user => (
                    <View key={user.id} style={localStyles.memberCard}>
                      <Image source={user.picture_profile ? { uri: getImageUrl(user.picture_profile)! } : userPlaceholder} style={localStyles.memberAvatar} />
                      <View style={localStyles.memberInfo}>
                        <Text style={localStyles.memberName} numberOfLines={1}>{user.name}</Text>
                        <Text style={localStyles.memberRole}>Solicitante</Text>
                      </View>
                      <TouchableOpacity 
                        style={localStyles.acceptBtn}
                        onPress={() => user.id && actions.handleAcceptMember(user.id, pendingList)}
                      >
                        <Text style={localStyles.acceptBtnText}>Aceitar</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <Text style={localStyles.sectionTitle}>Membros ({membersCount})</Text>
              {membersList.map(user => {
                const isItemOwner = user.id === org.creator_id;
                const isCurrentlyAdmin = user.role === 'admin';
                return (
                  <TouchableOpacity 
                    key={user.id} 
                    style={localStyles.memberCard}
                    onPress={() => router.push(`/social/user/${user.id}`)}
                  >
                    <Image source={user.picture_profile ? { uri: getImageUrl(user.picture_profile)! } : userPlaceholder} style={localStyles.memberAvatar} />
                    <View style={localStyles.memberInfo}>
                      <Text style={localStyles.memberName} numberOfLines={1}>{user.name}</Text>
                      <Text style={localStyles.memberRole}>{isItemOwner ? 'Dono' : isCurrentlyAdmin ? 'Administrador' : 'Membro'}</Text>
                    </View>
                    {(isItemOwner || isCurrentlyAdmin) && (
                      <View style={localStyles.adminBadge}>
                        <Text style={localStyles.adminBadgeText}>Admin</Text>
                      </View>
                    )}
                    {renderMemberActions(user, isItemOwner, isCurrentlyAdmin)}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {tab === 'about' && (
            <View style={localStyles.aboutContainer}>
              <View style={localStyles.aboutCard}>
                <Text style={localStyles.sectionTitle}>Descrição</Text>
                <Text style={localStyles.aboutDescription}>
                  {org.description || 'Nenhuma descrição fornecida.'}
                </Text>
              </View>
              <View style={localStyles.aboutCard}>
                <View style={localStyles.aboutRow}>
                  <View style={localStyles.aboutIconBox}>
                     <Ionicons name="calendar" size={16} color={colors.orangePrimary} />
                  </View>
                  <Text style={localStyles.aboutText}>Criada em {new Date(org.created_at).toLocaleDateString()}</Text>
                </View>
              </View>
            </View>
          )}

        </View>
      </ScrollView>

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

const localStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  coverContainer: {
    height: 150,
    width: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerButtons: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  identityContainer: {
    paddingHorizontal: 16,
    marginTop: -42,
    alignItems: 'flex-start',
  },
  avatarWrapper: {
    width: 84,
    height: 84,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: colors.backgroundDark,
    backgroundColor: colors.backgroundDarkSecondary,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  orgName: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    color: colors.textPrimaryDark,
  },
  orgHandle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 17,
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
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  primaryAction: {
    flex: 1,
    backgroundColor: colors.orangePrimary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionActive: {
    backgroundColor: 'rgba(252, 185, 40, 0.15)',
  },
  primaryActionText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: colors.backgroundDark,
  },
  primaryActionTextActive: {
    color: colors.orangePrimary,
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: colors.backgroundDarkSecondary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  secondaryActionText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: colors.textPrimaryDark,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 16,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: colors.backgroundDark,
  },
  tabButtonText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: colors.textSecondary,
  },
  tabButtonTextActive: {
    color: colors.orangePrimary,
  },
  tabContent: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  eventsContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  membersContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  sectionTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: colors.textPrimaryDark,
    marginBottom: 8,
    marginTop: 8,
  },
  pendingSection: {
    marginBottom: 12,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDarkSecondary,
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 8,
  },
  memberAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: colors.textPrimaryDark,
  },
  memberRole: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  adminBadge: {
    backgroundColor: 'rgba(252, 185, 40, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  adminBadgeText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 10,
    color: colors.orangePrimary,
  },
  acceptBtn: {
    backgroundColor: colors.bluePrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  acceptBtnText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,
    color: '#fff',
  },
  actionIcon: {
    padding: 6,
  },
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  actionBtnPrimary: {
    backgroundColor: 'rgba(67, 161, 214, 0.15)',
  },
  actionBtnDanger: {
    backgroundColor: 'rgba(255, 69, 58, 0.15)',
  },
  actionBtnText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 10,
  },
  actionBtnTextPrimary: {
    color: colors.bluePrimary,
  },
  actionBtnTextDanger: {
    color: colors.redWarning,
  },
  aboutContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  aboutCard: {
    backgroundColor: colors.backgroundDarkSecondary,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  aboutDescription: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aboutIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(252, 185, 40, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboutText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
});