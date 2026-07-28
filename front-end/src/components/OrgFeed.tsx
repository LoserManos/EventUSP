// src/components/OrgFeed.tsx
import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@/styles/global';
import { Organization } from '@/types/org';
import { orgService } from '@/services/orgService';
import { OrgCard } from '@/components/OrgCard';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export function OrgFeed({ searchQuery }: { searchQuery: string }) {
  const router = useRouter();
  const { userProfile: authUser } = useAuth();
  const currentLoggedUserId = authUser?.id;

  const [data, setData] = useState<Organization[]>([]);
  // Mapeia o status do usuário por ID da organização: { [orgId]: { status: boolean, role: string } }
  const [userMemberships, setUserMemberships] = useState<Record<number, { status: boolean; role: string }>>({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadOrganizations = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);
    const p = reset ? 1 : page;
    
    try {
      const response = await orgService.listOrgs(p, 20, searchQuery);
      const newOrgs = reset ? response.data : [...data, ...response.data];
      setData(newOrgs);
      setHasMore(p < response.total_pages);
      setPage(p + 1);

      // Busca o status de vínculo utilizando a rota específica para cada organização carregada
      if (currentLoggedUserId) {
        const membershipsMap: Record<number, { status: boolean; role: string }> = reset ? {} : { ...userMemberships };
        
        await Promise.all(
          response.data.map(async (org: Organization) => {
            if (org.id && org.creator_id !== currentLoggedUserId) {
              try {
                const membershipInfo = await orgService.getMemberStatus(org.id, currentLoggedUserId);
                if (membershipInfo) {
                  membershipsMap[org.id] = { status: membershipInfo.status, role: membershipInfo.role };
                }
              } catch (e) {
                // Silencia caso não exista vínculo (retorna 404)
              }
            }
          })
        );
        setUserMemberships(membershipsMap);
      }
    } catch (error) {
      console.error("Erro ao carregar organizações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    loadOrganizations(true);
  }, [searchQuery]);

  const handleMembershipAction = async (org: Organization) => {
    if (!currentLoggedUserId || org.creator_id === currentLoggedUserId) return;

    const membership = userMemberships[org.id!];

    try {
      if (!membership) {
        await orgService.joinOrg(org.id!);
        setUserMemberships((prev) => ({
          ...prev,
          [org.id!]: { status: false, role: 'member' },
        }));
      } else if (membership.status) {
        await orgService.leaveOrg(org.id!);
        setUserMemberships((prev) => {
          const updated = { ...prev };
          delete updated[org.id!];
          return updated;
        });
      }
    } catch (error: any) {
      console.error("Erro na ação de organização:", error);
    }
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id!.toString()}
      renderItem={({ item }) => {
        const membership = item.id ? userMemberships[item.id] : null;

        return (
          <OrgCard 
            organization={item} 
            currentUserId={currentLoggedUserId}
            userMembership={membership}
            onPress={() => router.push(`/social/org/${item.id}`)} 
            onMembershipAction={() => handleMembershipAction(item)}
          />
        );
      }}
      onEndReached={() => loadOrganizations(false)}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <ActivityIndicator color={colors.orangePrimary} /> : null}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: 20 },
});