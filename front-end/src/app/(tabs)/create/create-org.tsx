// src/app/social/org/create.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '@/styles/global';
import { useRouter } from 'expo-router';
import { orgService } from '@/services/orgService';

const ACCENT = colors.orangePrimary;
const ACCENT_DARK = colors.orangePrimary;
const BG_COLOR = colors.backgroundDark;
const TEXT_MAIN = colors.textPrimaryDark;
const TEXT_MUTED = colors.textSecondary;
const INPUT_BG = colors.backgroundDarkSecondary;

function Field({ label, icon, children }: { label: string; icon?: keyof typeof Ionicons.glyphMap; children: React.ReactNode }) {
  return (
    <View style={styles.fieldContainer}>
      <View style={styles.labelRow}>
        {icon && <Ionicons name={icon} size={14} color={ACCENT_DARK} />}
        <Text style={styles.label}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

export default function CreateOrgScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canPublish = name.trim().length > 0 && description.trim().length > 0;

  const handleCreateOrg = async () => {
    if (!canPublish) return;

    try {
      setLoading(true);
      setError(null);

      const orgParaEnviar = {
        name,
        description,
      };

      const response = await orgService.createOrg(orgParaEnviar);
      
      Alert.alert('Sucesso', 'Organização criada com sucesso!');
      
      router.push(`/social/org/${response.organizacao_id}`);
    } catch (err: any) {
      console.log('Falha ao criar organização', err);
      setError(err?.response?.data?.detail || 'Erro ao criar organização. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Cabeçalho */}
          <View style={styles.pageHeader}>
            <Text style={globalStyles.title}>Criar Organização</Text>
            <Text style={styles.subtitulo}>
              Preencha os dados abaixo para estruturar sua nova organização.
            </Text>
          </View>
          
          <View style={styles.formContent}>
            {/* Foto uploader */}
            {/* <TouchableOpacity style={styles.coverUploader} activeOpacity={0.9}>
              <View style={styles.coverIconCircle}>
                <Ionicons name="images-outline" size={20} color={ACCENT_DARK} />
              </View>
              <Text style={styles.coverText}>Adicionar foto da organização</Text>
              <Text style={styles.coverSubtext}>Recomendado 500 × 500</Text>
            </TouchableOpacity> */}

            {/* Nome da Organização */}
            <Field label="Nome da Organização" icon="people-outline">
              <TextInput
                style={styles.input}
                placeholder="Ex: Liga Acadêmica de Computação"
                placeholderTextColor={TEXT_MUTED}
                value={name}
                onChangeText={setName}
              />
            </Field>

            {/* Descrição */}
            <Field label="Descrição" icon="document-text-outline">
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Fale um pouco sobre a organização..."
                placeholderTextColor={TEXT_MUTED}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </Field>

            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </ScrollView>

        {/* Sticky publish */}
        <View style={styles.stickyFooter}>
          <TouchableOpacity
            style={[styles.publishButton, (!canPublish || loading) && styles.publishButtonDisabled]}
            onPress={handleCreateOrg}
            disabled={!canPublish || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.backgroundDark} />
            ) : (
              <Text style={styles.publishButtonText}>Criar Organização</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  pageHeader: {
    marginBottom: 24,
    marginTop: 4,
  },
  subtitulo: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  formContent: {
    gap: 16,
    paddingTop: 4,
  },
  coverUploader: {
    height: 160,
    width: '100%',
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: ACCENT,
    backgroundColor: `${ACCENT}12`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  coverIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${ACCENT}30`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  coverText: {
    fontWeight: 'bold',
    fontSize: 13,
    color: ACCENT_DARK,
  },
  coverSubtext: {
    fontSize: 11,
    color: TEXT_MUTED,
    marginTop: 4,
  },
  fieldContainer: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontWeight: '700',
    fontSize: 13,
    color: TEXT_MAIN,
  },
  input: {
    width: '100%',
    backgroundColor: INPUT_BG,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: TEXT_MAIN,
    minHeight: 48,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 8,
  },
  stickyFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: BG_COLOR,
    borderTopWidth: 1,
    borderTopColor: INPUT_BG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  publishButton: {
    width: '100%',
    backgroundColor: ACCENT,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  publishButtonDisabled: {
    opacity: 0.4,
  },
  publishButtonText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: colors.backgroundDark,
  },
});