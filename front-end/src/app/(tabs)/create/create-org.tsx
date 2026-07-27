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
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/global';
import { useRouter } from 'expo-router';
import { orgService } from '@/services/orgService';

export default function CreateOrgScreen() {
  const router = useRouter();

  // Estados para os campos do formulário
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateOrg = async () => {
    if (!name || !description) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const orgParaEnviar = {
        name,
        description,
      };

      const response = await orgService.createOrg(orgParaEnviar);
      
      Alert.alert('Sucesso', 'Organização criada com sucesso!');
      
      setName('');
      setDescription('');
      
      // Redireciona para a página da organização recém-criada ou lista
      router.push(`/social/org/${response.organizacao_id}`);
    } catch (err: any) {
      console.log('Falha ao criar organização', err);
      setError(err?.response?.data?.detail || 'Erro ao criar organização. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={styles.titulo}>Criar Organização</Text>
            <Text style={styles.subtitulo}>
              Preencha os dados abaixo para estruturar sua nova organização.
            </Text>
          </View>
          
          {/* Nome da Organização */}
          <Text style={styles.label}>Nome da Organização</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="people-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ex: Liga Acadêmica de Computação"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Descrição */}
          <Text style={styles.label}>Descrição</Text>
          <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
            <Ionicons name="document-text-outline" size={20} color={colors.textSecondary} style={[styles.inputIcon, { alignSelf: 'flex-start', marginTop: 4 }]} />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Fale um pouco sobre a organização..."
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          {/* Mensagem de Erro (se houver) */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Botão de Criar */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateOrg}
            activeOpacity={0.85}
            disabled={loading}
          >
            <LinearGradient
              colors={[colors.orangePrimary, colors.orangePrimary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              {loading ? (
                <ActivityIndicator color={colors.backgroundDark} />
              ) : (
                <Text style={styles.createButtonText}>Criar Organização</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  titulo: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.orangePrimary,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  label: {
    fontSize: 14,
    color: colors.textPrimaryDark,
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 20,
  },
  textAreaWrapper: {
    height: 120,
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimaryDark,
  },
  textArea: {
    height: '100%',
    textAlignVertical: 'top',
  },
  createButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: colors.orangePrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  gradient: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: colors.backgroundDark,
    fontSize: 17,
    fontWeight: 'bold',
  },
});