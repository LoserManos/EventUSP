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

// Importa o Hook de lógica
import { useRegister } from '../../hooks/useRegister';

export default function RegisterScreen() {
  const router = useRouter();

  // Toda a lógica e estados vêm prontos daqui:
  const {
    name,
    setName,
    nickname,
    setNickname,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    passwordVisible,
    togglePasswordVisibility,
    confirmPasswordVisible,
    toggleConfirmPasswordVisibility,
    loading,
    handleRegister,
  } = useRegister();

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
            <Text style={globalStyles.title}>Criar uma{'\n'}conta</Text>
            <Text style={globalStyles.secondaryText}>
              Leva menos de um minuto para começar.
            </Text>
          </View>

          <Text style={globalStyles.label}>Nome</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="person-outline"
              size={16}
              color={colors.textSecondary}
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={[globalStyles.input, { flex: 1 }]}
              placeholder="Nome"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <Text style={globalStyles.label}>Usuário</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="at-outline"
              size={16}
              color={colors.textSecondary}
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={[globalStyles.input, { flex: 1 }]}
              placeholder="Usuário"
              placeholderTextColor={colors.textSecondary}
              value={nickname}
              onChangeText={setNickname}
              autoCapitalize="none"
            />
          </View>

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

          <Text style={globalStyles.label}>Confirmar Senha</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="lock-closed-outline"
              size={16}
              color={colors.textSecondary}
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={[globalStyles.input, { flex: 1 }]}
              placeholder="Confirmar Senha"
              placeholderTextColor={colors.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!confirmPasswordVisible}
            />
            <TouchableOpacity
              onPress={toggleConfirmPasswordVisibility}
              style={{ padding: 4, marginLeft: 8 }}
            >
              <Ionicons
                name={confirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={16}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={globalStyles.formSaveButton}
            onPress={handleRegister}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.backgroundDark} />
            ) : (
              <Text style={globalStyles.formSaveButtonText}>Criar conta</Text>
            )}
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
            <Text style={globalStyles.secondaryText}>Eu já tenho uma conta </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={[globalStyles.secondaryText, { color: colors.orangePrimary, fontWeight: 'bold' }]}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}