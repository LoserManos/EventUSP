// src/components/EditOrgModal.tsx
import React from 'react';
import { ScrollView, View, Image, TouchableOpacity, Text, TextInput } from 'react-native';
import { UserOverlayModal } from '@/components/UserOverlayModal';
import { getImageUrl } from '@/utils/image';
import { globalStyles, colors } from '@/styles/global';

const orgPlaceholder = require('@/assets/images/LA.png');

export function EditOrgModal({ 
  visible, onClose, org, 
  editName, setEditName, 
  editDescription, setDescription, 
  selectedImageUri, handlePickImage, 
  handleSaveOrg 
}: any) {
  if (!org) return null;
  
  const avatarSource = selectedImageUri ? 
                       { uri: selectedImageUri } :
                       (org.picture_profile ?
                         { uri: getImageUrl(org.picture_profile)! } :
                         orgPlaceholder);

  return (
    <UserOverlayModal visible={visible} onClose={onClose} title="Editar Organização">
      <ScrollView contentContainerStyle={globalStyles.infoForm}>
        
        <View style={globalStyles.infoFormImageContainer}>
          <Image source={avatarSource} style={globalStyles.profilePicture} />
          <TouchableOpacity style={globalStyles.interactionButton} onPress={handlePickImage}>
            <Text style={[globalStyles.label, { color: colors.bluePrimary }]}>Alterar foto da organização</Text>
          </TouchableOpacity>
        </View>

        <Text style={globalStyles.label}>Nome</Text>
        <TextInput 
          style={globalStyles.input} 
          value={editName} 
          onChangeText={setEditName} 
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={globalStyles.label}>Descrição</Text>
        <TextInput 
          style={[globalStyles.input, globalStyles.formTextArea]} 
          value={editDescription} 
          onChangeText={setDescription} 
          multiline 
          placeholderTextColor={colors.textSecondary} 
        />

        <TouchableOpacity style={globalStyles.formSaveButton} onPress={handleSaveOrg}>
          <Text style={globalStyles.formSaveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </UserOverlayModal>
  );
}