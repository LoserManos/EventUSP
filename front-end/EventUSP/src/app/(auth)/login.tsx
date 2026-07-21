import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
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

// *****************
// TEMPORARIO, BASEIA COM O BACKEND RODANDO LOCALMENTE, DEPOIS MUDAR PARA O IP DO SERVER
import Constants from 'expo-constants';
const hostUri = Constants?.expoConfig?.hostUri;
const localIp = hostUri ? hostUri.split(':')[0] : 'localhost';
export const API_URL = `http://${localIp}:8000`;

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Erro', 'Informe o email e a senha.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        let mensagemErro = 'Falha no login.';
        
        if (data.detail) {
           mensagemErro = typeof data.detail === 'string' 
             ? data.detail 
             : JSON.stringify(data.detail, null, 2); 
        }
        Alert.alert('Erro', mensagemErro);
        return;
      }

      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
      console.error(error);
    }
  };

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
            <Text style={styles.titulo}>Bem-vindo{'\n'}de volta!</Text>
            <Text style={styles.subtitulo}>
              Faça login para continuar de onde parou.
            </Text>
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
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Esqueceu a senha */}
          <TouchableOpacity
            style={styles.esqueceuSenhaWrapper}
            onPress={() => router.push('/forgot')}
          >
            <Text style={styles.esqueceuSenha}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          {/* Botão Login */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.orangePrimary, colors.orangePrimary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Registrar */}
          <View style={styles.registrarWrapper}>
            <Text style={styles.registrarTexto}>Crie uma conta </Text>
            <TouchableOpacity
              onPress={() => router.push('/register')}
            >
              <Text style={styles.registrarLink}>Registrar</Text>
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
  esqueceuSenhaWrapper: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  esqueceuSenha: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: colors.orangePrimary,
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
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
  loginButtonText: {
    color: colors.backgroundDark,
    fontSize: 17,
    fontFamily: 'Montserrat_700Bold',
  },
  registrarWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  registrarTexto: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: colors.textPrimaryDark,
  },
  registrarLink: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: colors.orangePrimary,
    textDecorationLine: 'underline',
  },
});