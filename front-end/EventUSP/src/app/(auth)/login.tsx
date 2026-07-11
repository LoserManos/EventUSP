import React, { useState } from 'react';
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
import { colors, globalStyles } from '@/styles/global';

export default function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const handleLogin = () => {
    // TODO: implementar lógica de autenticação
    console.log('Login:', usuario, senha);
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

          {/* Campo Usuário/Email */}
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={20}
              color={colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Usuário ou Email"
              placeholderTextColor={colors.textSecondary}
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Campo Senha */}
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
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!senhaVisivel}
            />
            <TouchableOpacity
              onPress={() => setSenhaVisivel(!senhaVisivel)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Esqueceu a senha */}
          <TouchableOpacity
            style={styles.esqueceuSenhaWrapper}
            onPress={() => navigation?.navigate?.('ForgotPassword')}
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
              onPress={() => navigation?.navigate?.('Register')}
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