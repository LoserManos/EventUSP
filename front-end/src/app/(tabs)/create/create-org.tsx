import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
      
      router.push(`/social/org/${response.organizacao_id}`);
    } catch (err: any) {
      console.log('Falha ao criar organização', err);
      setError(err?.response?.data?.detail || 'Erro ao criar organização. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={globalStyles.infoForm}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cabeçalho */}
          <View style={{ marginBottom: 16 }}>
            <Text style={globalStyles.title}>Criar Organização</Text>
            <Text style={globalStyles.secondaryText}>
              Preencha os dados abaixo para estruturar sua nova organização.
            </Text>
          </View>
          
          {/* Nome da Organização */}
          <Text style={globalStyles.label}>Nome da Organização</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="people-outline" size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              style={[globalStyles.input, { flex: 1 }]}
              placeholder="Ex: Liga Acadêmica de Computação"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Descrição */}
          <Text style={globalStyles.label}>Descrição</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Ionicons name="document-text-outline" size={16} color={colors.textSecondary} style={{ marginRight: 8, marginTop: 8 }} />
            <TextInput
              style={[globalStyles.input, globalStyles.formTextArea, { flex: 1 }]}
              placeholder="Fale um pouco sobre a organização..."
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          {/* Mensagem de Erro (se houver) */}
          {error && <Text style={{ color: colors.redWarning, fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>{error}</Text>}

          {/* Botão de Criar */}
          <TouchableOpacity
            style={globalStyles.formSaveButton}
            onPress={handleCreateOrg}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.backgroundDark} />
            ) : (
              <Text style={globalStyles.formSaveButtonText}>Criar Organização</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}