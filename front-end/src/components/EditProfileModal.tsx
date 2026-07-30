import React, { useState } from 'react';
import { Modal, ScrollView, View, Image, TouchableOpacity, Text, TextInput, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { getImageUrl } from '@/utils/image';
import { colors } from '@/styles/global';
import { Feather } from '@expo/vector-icons';

const userPlaceholder = require('@/assets/images/LA.png');

export function EditProfileModal({ 
  visible, onClose, user, 
  editName, setEditName, 
  editNickname, setEditNickname, 
  editBio, setEditBio, 
  selectedImageUri, handlePickImage, 
  handleSaveProfile 
}: any) {
  const [saving, setSaving] = useState(false);
  const [editCourse, setEditCourse] = useState(''); // Estado local apenas para o UI
  
  if (!user) return null;

  const avatarSource = selectedImageUri ? 
                       { uri: selectedImageUri } :
                       (user.picture_profile ?
                         { uri: getImageUrl(user.picture_profile)! } :
                         userPlaceholder);

  const canSave = editName.trim() && editNickname.trim();

  const onSave = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    await handleSaveProfile();
    setSaving(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.backgroundDark }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
            <Text style={styles.headerCancelText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar perfil</Text>
          <TouchableOpacity onPress={onSave} disabled={!canSave} style={styles.headerBtn}>
            <Text style={[styles.headerSaveText, !canSave && styles.disabledText]}>{saving ? '...' : 'Salvar'}</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
          
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickImage} activeOpacity={0.8}>
              <View style={styles.avatarRing}>
                <Image source={avatarSource} style={styles.avatarImage} resizeMode="cover" />
              </View>
              <View style={styles.editIconBadge}>
                <Feather name="edit-2" size={14} color={colors.backgroundDark} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePickImage}>
              <Text style={styles.changePhotoText}>Alterar foto</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldsContainer}>
            {/* Field: Nome */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Nome</Text>
              <TextInput 
                style={styles.input} 
                value={editName} 
                onChangeText={setEditName} 
                placeholder="Seu nome"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

        

            {/* Field: Bio */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Bio</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                value={editBio} 
                onChangeText={setEditBio} 
                placeholder="Conte um pouco sobre você..."
                placeholderTextColor={colors.textSecondary}
                multiline
                maxLength={160}
              />
              <Text style={styles.charCount}>{(editBio || '').length}/160</Text>
            </View>
          </View>

        </ScrollView>

        {/* Sticky Save */}
        <View style={styles.stickyFooter}>
          <TouchableOpacity 
            style={[styles.stickySaveBtn, !canSave && styles.disabledBtn]} 
            onPress={onSave}
            disabled={!canSave || saving}
            activeOpacity={0.8}
          >
            <Text style={styles.stickySaveBtnText}>{saving ? "Atualizando..." : "Salvar alterações"}</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundDarkSecondary,
  },
  headerBtn: {
    padding: 4,
    minWidth: 70,
  },
  headerCancelText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  headerTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 17,
    color: colors.textPrimaryDark,
  },
  headerSaveText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: colors.orangePrimary,
    textAlign: 'right',
  },
  disabledText: {
    opacity: 0.4,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    width: 96,
    height: 96,
    marginBottom: 10,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: colors.orangePrimary,
    padding: 3,
    backgroundColor: colors.backgroundDark,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.orangePrimary,
    borderWidth: 2,
    borderColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  changePhotoText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: colors.orangePrimary,
  },
  fieldsContainer: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: colors.textPrimaryDark,
  },
  input: {
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: colors.textPrimaryDark,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  inputPrefix: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 2,
  },
  inputFlex: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: colors.textPrimaryDark,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  stickyFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundDark,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundDarkSecondary,
  },
  stickySaveBtn: {
    backgroundColor: colors.orangePrimary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  disabledBtn: {
    opacity: 0.4,
  },
  stickySaveBtnText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    color: colors.backgroundDark,
  }
});
