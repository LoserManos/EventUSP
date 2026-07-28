// src/components/UserListModal.tsx
import React from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import { User } from '@/types/user';
import { UserCard } from '@/components/UserCard';
import { UserOverlayModal } from '@/components/UserOverlayModal';
import { colors } from '@/styles/global';

interface UserListModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  users: User[];
  currentLoggedUserId?: number;
  followingIds: number[];
  onSelectUser: (userId: number) => void;
  emptyMessage: string;
}

export function UserListModal({
  visible,
  onClose,
  title,
  users,
  currentLoggedUserId,
  followingIds,
  onSelectUser,
  emptyMessage,
}: UserListModalProps) {
  return (
    <UserOverlayModal visible={visible} onClose={onClose} title={title}>
      {users.length === 0 ? (
        <Text style={styles.emptyModalText}>{emptyMessage}</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isCurrentUser = currentLoggedUserId ? item.id === currentLoggedUserId : false;
            const isFollowing = followingIds.includes(item.id);

            return (
              <UserCard
                user={item}
                isCurrentUser={isCurrentUser}
                initialIsFollowing={isFollowing}
                onPress={() => onSelectUser(item.id)}
              />
            );
          }}
          contentContainerStyle={styles.modalListContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </UserOverlayModal>
  );
}

const styles = StyleSheet.create({
  emptyModalText: { color: colors.textSecondary, textAlign: 'center', padding: 20 },
  modalListContent: { paddingBottom: 20, paddingHorizontal: 4 },
});