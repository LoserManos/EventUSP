import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { User } from '@/types/user';
import { userService } from '@/services/userService';

export function useUserProfile(currentLoggedUserId?: number) {
  const { id } = useLocalSearchParams();
  const userId = Array.isArray(id) ? Number(id[0]) : Number(id);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [modalType, setModalType] = useState<'orgs' | 'followers' | 'following' | 'edit' | null>(null);
  
  const [userOrgs, setUserOrgs] = useState<any[]>([]);
  const [followersList, setFollowersList] = useState<User[]>([]);
  const [followingList, setFollowingList] = useState<User[]>([]);
  const [followingIds, setFollowingIds] = useState<number[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [eventTab, setEventTab] = useState<'criados' | 'interesses' | 'curtidos'>('criados');
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  const [editName, setEditName] = useState('');
  const [editNickname, setEditNickname] = useState('');
  const [editBio, setEditBio] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const isMe = user?.id && currentLoggedUserId ? user.id === currentLoggedUserId : false;

  useEffect(() => {
    async function fetchUserData() {
      try {
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

        try {
          const orgsData = await userService.getOrgs(userId);
          setUserOrgs(orgsData);
        } catch (err) {
          console.error("Erro ao carregar organizações:", err);
        }

        if (currentLoggedUserId && !isMe) {
          setIsFollowing(followers.some(f => f.id === currentLoggedUserId));
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    }
    if (userId) fetchUserData();
  }, [userId, currentLoggedUserId]);

  useEffect(() => {
    async function fetchUserEvents() {
      if (!userId) return;
      setEventsLoading(true);
      try {
        let data = [];
        if (eventTab === 'criados') data = await userService.getUserCreatedEvents(userId);
        else if (eventTab === 'interesses') data = await userService.getUserInterestedEvents(userId);
        else if (eventTab === 'curtidos') data = await userService.getUserLikedEvents(userId);
        setEventsList(data);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        setEventsList([]);
      } finally {
        setEventsLoading(false);
      }
    }
    fetchUserEvents();
  }, [userId, eventTab]);

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
    } catch (error) {
      console.error("Erro ao alterar follow:", error);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled && result.assets[0].uri) {
      setSelectedImageUri(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updated = await userService.updateMyProfile({ name: editName, nickname: editNickname, bio: editBio });
      let newPictureProfile = user?.picture_profile;

      if (selectedImageUri) {
        const photoResponse = await userService.uploadMyPhoto({
          uri: selectedImageUri, name: selectedImageUri.split('/').pop() || 'profile.jpg', type: 'image/jpeg',
        } as any);
        newPictureProfile = photoResponse.picture_profile;
      }

      setUser((prev) => prev ? { ...prev, ...updated, picture_profile: newPictureProfile ?? prev.picture_profile } : prev);
      setModalType(null);
      setSelectedImageUri(null);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  return {
    userId, user, loading, isFollowing, isMe, modalType, setModalType,
    userOrgs, followersList, followingList, followingIds, followersCount, followingCount,
    eventTab, setEventTab, eventsList, eventsLoading,
    editName, setEditName, editNickname, setEditNickname, editBio, setEditBio,
    selectedImageUri, handleFollowToggle, handlePickImage, handleSaveProfile
  };
}