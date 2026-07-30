import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { userService } from '@/services/userService';
import { User } from '@/types/user';

export function useUserEdit(user: User | null, onUpdateSuccess: (updatedUser: Partial<User>) => void) {
  const [editName, setEditName] = useState('');
  const [editNickname, setEditNickname] = useState('');
  const [editBio, setEditBio] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditNickname(user.nickname || '');
      setEditBio(user.bio || '');
    }
  }, [user]);

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

      onUpdateSuccess({ ...updated, picture_profile: newPictureProfile ?? user?.picture_profile });
      setSelectedImageUri(null);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      return false;
    }
  };

  return {
    editName, setEditName, editNickname, setEditNickname,
    editBio, setEditBio, selectedImageUri, handlePickImage, handleSaveProfile
  };
}