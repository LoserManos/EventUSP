import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/global';

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

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.orangePrimary} />
      </SafeAreaView>
    );
  }

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
          {/* Título */}
          <View style={styles.header}>
            <Text style={styles.titulo}>Criar uma{'\n'}conta</Text>
            <Text style={styles.subtitulo}>
              Leva menos de um minuto para começar.
            </Text>
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={20}
              color={colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="at-outline"
              size={20}
              color={colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Usuário"
              placeholderTextColor={colors.textSecondary}
              value={nickname}
              onChangeText={setNickname}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar Senha"
              placeholderTextColor={colors.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!confirmPasswordVisible}
            />
            <TouchableOpacity
              onPress={toggleConfirmPasswordVisibility}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={confirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleRegister}
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
                <Text style={styles.createButtonText}>Criar conta</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.loginWrapper}>
            <Text style={styles.loginTexto}>Eu já tenho uma conta </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 32,
  },
  titulo: {
    fontSize: 34,
    fontFamily: 'Montserrat_700Bold',
    color: colors.orangePrimary,
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 15,
    fontFamily: 'Montserrat_400Regular',
    color: colors.textSecondary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  eyeIcon: {
    padding: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Montserrat_400Regular',
    color: colors.textPrimaryDark,
  },
  createButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 20,
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
    fontFamily: 'Montserrat_700Bold',
  },
  loginWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  loginTexto: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: colors.textPrimaryDark,
  },
  loginLink: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: colors.orangePrimary,
    textDecorationLine: 'underline',
  },
});