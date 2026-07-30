import { useState, useEffect, useCallback } from 'react';
import { Organization } from '@/types/org';
import { User } from '@/types/user';
import { orgService } from '@/services/orgService';

export function useFetchOrg(orgId: string | number, currentLoggedUserId?: number) {
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [membershipStatus, setMembershipStatus] = useState<'none' | 'pending' | 'member'>('none');
  const [isAdminOrOwner, setIsAdminOrOwner] = useState(false);
  
  const [membersList, setMembersList] = useState<User[]>([]);
  const [membersCount, setMembersCount] = useState(0);

  const [pendingList, setPendingList] = useState<User[]>([]);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchOrgData = useCallback(async () => {
    if (!orgId) return;
    try {
      setLoading(true);
      const numericOrgId = Number(orgId);
      const data = await orgService.getOrg(numericOrgId);
      setOrg(data);

      const members = await orgService.getOrgMembers(numericOrgId);
      setMembersList(members);
      setMembersCount(members.length);

      if (currentLoggedUserId) {
        try {
          const membershipInfo = await orgService.getMemberStatus(numericOrgId, currentLoggedUserId);
          
          if (!membershipInfo) {
            setMembershipStatus('none');
            setIsAdminOrOwner(data.creator_id === currentLoggedUserId);
          } else {
            setMembershipStatus(membershipInfo.status === true ? 'member' : 'pending');
            const adminOrOwner = (data.creator_id === currentLoggedUserId) || (membershipInfo.role === 'ADMIN');
            setIsAdminOrOwner(adminOrOwner);

            if (adminOrOwner) {
              const pendings = await orgService.getPendingOrgMembers(numericOrgId);
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
  }, [orgId, currentLoggedUserId]);

  useEffect(() => {
    fetchOrgData();
  }, [fetchOrgData]);

  const isOwner = org?.creator_id && currentLoggedUserId ? org.creator_id === currentLoggedUserId : false;

  return {
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
    refetch: fetchOrgData,
  };
}