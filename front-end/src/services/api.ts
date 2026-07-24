import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const hostUri = Constants?.expoConfig?.hostUri;
const localIp = hostUri ? hostUri.split(':')[0] : 'localhost';
const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${localIp}:8000`;

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor: injeta o token na ida
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao buscar token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Resposta: Se o backend der 401 (token inválido), limpa o armazenamento na marra
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Token inválido ou expirado! Limpando AsyncStorage...');
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userProfile');
      // Opcional: Redirecionar para o Login aqui, mas o _layout já fará isso quando o estado mudar
    }
    return Promise.reject(error);
  }
);