import React from 'react';
import { ScrollView, View, Image, TouchableOpacity, Text, TextInput } from 'react-native';
import { UserOverlayModal } from '@/components/UserOverlayModal';
import { getImageUrl } from '@/utils/image';
import { globalStyles, colors } from '@/styles/global';

const userPlaceholder = require('@/assets/images/LA.png');

export function EditProfileModal({ 
  visible, onClose, user, 
  editName, setEditName, 
  editNickname, setEditNickname, 
  editBio, setEditBio, 
  selectedImageUri, handlePickImage, 
  handleSaveProfile 
}: any) {
  if (!user) return null;

  const avatarSource = selectedImageUri ? 
                       { uri: selectedImageUri } :
                       (user.picture_profile ?
                         { uri: getImageUrl(user.picture_profile)! } :
                         userPlaceholder);

  return (
    <UserOverlayModal visible={visible} onClose={onClose} title="Editar Perfil">
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 10 }}>

        <View style={globalStyles.infoFormImageContainer}>
          <Image source={avatarSource} style={globalStyles.profilePicture} />
          <TouchableOpacity onPress={handlePickImage} style={globalStyles.interactionButton}>
            <Text style={[globalStyles.label, { color: colors.bluePrimary }]}>Alterar foto de perfil</Text>
          </TouchableOpacity>
        </View>

        <Text style={globalStyles.label}>Nome</Text>
        <TextInput style={globalStyles.input} 
                   value={editName} 
                   onChangeText={setEditName} 
                   placeholderTextColor={colors.textSecondary}
                   />

        <Text style={globalStyles.label}>Nickname</Text>
        <TextInput style={globalStyles.input} 
                   value={editNickname} 
                   onChangeText={setEditNickname} 
                   placeholderTextColor={colors.textSecondary} 
                   />

        <Text style={globalStyles.label}>Bio</Text>
        <TextInput style={[globalStyles.input, globalStyles.formTextArea]} 
                   value={editBio} 
                   onChangeText={setEditBio} 
                   multiline 
                   placeholderTextColor={colors.textSecondary} 
                   />

        <TouchableOpacity style={globalStyles.formSaveButton} onPress={handleSaveProfile}>
          <Text style={globalStyles.formSaveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </UserOverlayModal>
  );
}