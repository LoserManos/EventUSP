import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '@/styles/global';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleEnviar = () => {
    // TODO: implementar lógica de envio do email de redefinição
    console.log('Enviar redefinição para:', email);
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
          {/* Botão voltar */}
          <TouchableOpacity
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: colors.backgroundDarkSecondary,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
            onPress={() => router.push('/login')}
          >
            <Ionicons name="arrow-back" size={16} color={colors.textPrimaryDark} />
          </TouchableOpacity>

          {/* Título */}
          <View style={{ marginBottom: 16 }}>
            <Text style={globalStyles.title}>Esqueceu a{'\n'}senha?</Text>
            <Text style={[globalStyles.secondaryText, { lineHeight: 18 }]}>
              <Text style={{ color: colors.orangePrimary }}>* </Text>
              Mandaremos um email de redefinição de senha para o endereço colocado.
            </Text>
          </View>

          {/* Campo Email */}
          <Text style={globalStyles.label}>E-mail</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="mail-outline"
              size={16}
              color={colors.textSecondary}
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={[globalStyles.input, { flex: 1 }]}
              placeholder="Coloque seu endereço de email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Botão Enviar */}
          <TouchableOpacity
            style={globalStyles.formSaveButton}
            onPress={handleEnviar}
            activeOpacity={0.85}
          >
            <Text style={globalStyles.formSaveButtonText}>Enviar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}