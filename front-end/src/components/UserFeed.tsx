// src/components/UserFeed.tsx
import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { colors, globalStyles } from '@/styles/global';
import { User } from '@/types/user';
import { userService } from '@/services/userService';
import { UserCard } from '@/components/UserCard';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export function UserFeed({ searchQuery }: { searchQuery: string }) {
  const router = useRouter();
  const { userProfile: authUser } = useAuth();
  const currentLoggedUserId = authUser?.id;

  const [data, setData] = useState<User[]>([]);
  const [followingIds, setFollowingIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 1. Busca os IDs de quem o usuário logado segue para checagem rápida
  useEffect(() => {
    async function fetchFollowingStatus() {
      if (!currentLoggedUserId) return;
      try {
        const followingList = await userService.getFollowing(currentLoggedUserId);
        const ids = followingList.map((user) => user.id);
        setFollowingIds(ids);
      } catch (error) {
        console.error("Erro ao carregar lista de seguindo:", error);
      }
    }
    fetchFollowingStatus();
  }, [currentLoggedUserId]);

  const loadUsers = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);
    const p = reset ? 1 : page;
    
    try {
      const response = await userService.listUsers(p, 20, searchQuery);
      setData(reset ? response.data : [...data, ...response.data]);
      setHasMore(p < response.total_pages);
      setPage(p + 1);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    loadUsers(true);
  }, [searchQuery]);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        const isCurrentUser = currentLoggedUserId ? item.id === currentLoggedUserId : false;
        const isFollowing = followingIds.includes(item.id); // Verifica se o ID está na lista de quem o usuário segue

        return (
          <UserCard 
            user={item} 
            isCurrentUser={isCurrentUser}
            initialIsFollowing={isFollowing} 
            onPress={() => {
              if (isCurrentUser) {
                router.push('/profile');
              } else {
                router.push(`/social/user/${item.id}`);
              }
            }} 
          />
        );
      }}
      onEndReached={() => loadUsers(false)}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <ActivityIndicator color={colors.orangePrimary} /> : null}
      contentContainerStyle={globalStyles.itemsList}
      showsVerticalScrollIndicator={false}
    />
  );
}