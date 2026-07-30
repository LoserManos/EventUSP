import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { orgService } from '@/services/orgService';
import { Organization } from '@/types/org';

export function useOrgEdit(org: Organization | null, orgId: number, onSaveSuccess: () => void) {
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (org) {
      setEditName(org.name);
      setEditDescription(org.description || '');
    }
  }, [org]);

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
      await orgService.updateOrg(orgId, {
        name: editName,
        description: editDescription,
      });

      if (selectedImageUri) {
        await orgService.uploadOrgPhoto(orgId, {
          uri: selectedImageUri,
          name: selectedImageUri.split('/').pop() || 'org.jpg',
          type: 'image/jpeg',
        });
      }

      onSaveSuccess();
      setSelectedImageUri(null);
    } catch (error) {
      console.error("Erro ao salvar organização:", error);
    }
  };

  return {
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    selectedImageUri,
    handlePickImage,
    handleSaveOrg,
  };
}