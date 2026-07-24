import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user';
import { userService } from '../services/userService';

interface AuthContextData {
  isLogged: boolean;
  userProfile: User | null;
  loading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Ao abrir o app, verifica se já tem sessão salva no celular
  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');

        if (storedToken) {
          // Validação inicial do Token na API, como diz a regra UX
          const user = await userService.getMe();
          setUserProfile(user);
          // Opcional: atualiza o perfil em disco
          await AsyncStorage.setItem('userProfile', JSON.stringify(user));
        }
      } catch (error) {
        console.error('Sessão expirada ou erro ao carregar do AsyncStorage', error);
        // Em caso de erro (ex: 401), limpa o estado
        setUserProfile(null);
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userProfile');
      } finally {
        setLoading(false);
      }
    }
    loadStorageData();
  }, []);

  // Salva o token no celular e busca o perfil completo automaticamente
  async function signIn(token: string) {
    try {
      // 1. Salva a "pulseira" (token) no AsyncStorage (o HD do app)
      await AsyncStorage.setItem('userToken', token);
      
      // 2. Como o token já está salvo, o nosso interceptor (no api.ts) 
      // já consegue pegar ele e mandar para o backend na próxima requisição!
      // Então, pedimos para o backend: "me dê o perfil desse usuário"
      const user = await userService.getMe();
      
      // 3. Salvamos o perfil completo para usar nas telas
      await AsyncStorage.setItem('userProfile', JSON.stringify(user));
      setUserProfile(user);
    } catch (error) {
      console.error('Erro ao salvar token e buscar perfil', error);
      throw error; // Repassa o erro para a tela de login
    }
  }

  // Remove o token e o perfil do celular no logout
  async function signOut() {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userProfile');
      setUserProfile(null);
    } catch (error) {
      console.error('Erro ao remover token', error);
    }
  }

  return (
    <AuthContext.Provider value={{ isLogged: !!userProfile, userProfile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado para facilitar o acesso nas telas (alternativa ao useContext)
export function useAuth() {
  return useContext(AuthContext);
}