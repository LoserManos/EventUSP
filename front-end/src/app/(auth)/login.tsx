import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, globalStyles } from '@/styles/global';

import { useLogin } from '../../hooks/useLogin';

export default function LoginScreen() {
  const router = useRouter();
  const {
    email,
    setEmail,
    password,
    setPassword,
    passwordVisible,
    togglePasswordVisibility,
    loading,
    handleLogin,
  } = useLogin();

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
          {/* Título */}
          <View style={{ marginBottom: 16 }}>
            <Text style={globalStyles.title}>Bem-vindo{'\n'}de volta!</Text>
            <Text style={globalStyles.secondaryText}>
              Faça login para continuar de onde parou.
            </Text>
          </View>

          {/* Email */}
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
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Senha */}
          <Text style={globalStyles.label}>Senha</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="lock-closed-outline"
              size={16}
              color={colors.textSecondary}
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={[globalStyles.input, { flex: 1 }]}
              placeholder="Senha"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={{ padding: 4, marginLeft: 8 }}
            >
              <Ionicons
                name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={16}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Esqueceu a senha */}
          <TouchableOpacity
            style={{ alignSelf: 'flex-end', marginBottom: 8 }}
            onPress={() => router.push('/forgot')}
          >
            <Text style={[globalStyles.secondaryText, { color: colors.orangePrimary }]}>
              Esqueceu a senha?
            </Text>
          </TouchableOpacity>

          {/* Botão Login */}
          <TouchableOpacity
            style={globalStyles.formSaveButton}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.backgroundDark} />
            ) : (
              <Text style={globalStyles.formSaveButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Registrar */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
            <Text style={globalStyles.secondaryText}>Crie uma conta </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={[globalStyles.secondaryText, { color: colors.orangePrimary, fontWeight: 'bold' }]}>
                Registrar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}