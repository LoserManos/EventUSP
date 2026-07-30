import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services/userService';
import { User } from '@/types/user';

export function useUserProfileData(userId: number, currentLoggedUserId?: number, isMe?: boolean) {
  const [userOrgs, setUserOrgs] = useState<any[]>([]);
  const [followersList, setFollowersList] = useState<User[]>([]);
  const [followingList, setFollowingList] = useState<User[]>([]);
  const [followingIds, setFollowingIds] = useState<number[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingRelations, setLoadingRelations] = useState(true);

  const fetchRelations = useCallback(async () => {
    if (!userId) return;
    try {
      const [followers, following, orgsData] = await Promise.all([
        userService.getFollowers(userId),
        userService.getFollowing(userId),
        userService.getOrgs(userId).catch(() => []),
      ]);

      setFollowersList(followers);
      setFollowersCount(followers.length);
      setFollowingList(following);
      setFollowingCount(following.length);
      setFollowingIds(following.map(f => f.id));
      setUserOrgs(orgsData);

      if (currentLoggedUserId && !isMe) {
        setIsFollowing(followers.some(f => f.id === currentLoggedUserId));
      }
    } catch (error) {
      console.error("Erro ao carregar dados relacionais:", error);
    } finally {
      setLoadingRelations(false);
    }
  }, [userId, currentLoggedUserId, isMe]);

  useEffect(() => {
    fetchRelations();
  }, [fetchRelations]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await userService.unfollowUser(userId);
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        await userService.followUser(userId);
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (error: any) {
      if (isFollowing && error.response && error.response.status === 404) {
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        console.error("Erro ao alterar follow:", error);
      }
    }
  };

  return {
    userOrgs, followersList, followingList, followingIds,
    followersCount, followingCount, isFollowing, loadingRelations,
    handleFollowToggle
  };
}