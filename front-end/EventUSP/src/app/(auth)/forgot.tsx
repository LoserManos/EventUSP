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
import { colors } from '@/styles/global';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const handleEnviar = () => {
    // TODO: implementar lógica de envio do email de redefinição
    console.log('Enviar redefinição para:', email);
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
          {/* Botão voltar */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack?.()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimaryDark} />
          </TouchableOpacity>

          {/* Título */}
          <View style={styles.header}>
            <Text style={styles.titulo}>Esqueceu a{'\n'}senha?</Text>
            <Text style={styles.subtitulo}>
              <Text style={styles.asterisco}>* </Text>
              Mandaremos um email de redefinição de senha para o endereço
              colocado.
            </Text>
          </View>

          {/* Campo Email */}
          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
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
            style={styles.enviarButton}
            onPress={handleEnviar}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.orangePrimary, colors.orangePrimary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              <Text style={styles.enviarButtonText}>Enviar</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    paddingTop: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundDarkSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
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
    lineHeight: 21,
  },
  asterisco: {
    color: colors.orangePrimary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Montserrat_400Regular',
    color: colors.textPrimaryDark,
  },
  enviarButton: {
    borderRadius: 16,
    overflow: 'hidden',
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
  enviarButtonText: {
    color: colors.backgroundDark,
    fontSize: 17,
    fontFamily: 'Montserrat_700Bold',
  },
});