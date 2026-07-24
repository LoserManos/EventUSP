import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios'; 

export function useLogin() {
  const router = useRouter();
  const { signIn } = useAuth(); // Chama a função global do contexto
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      // Pega o token do backend
      const data = await authService.login({ email, password });
      
      console.log('Token recebido do backend:', data.access_token);
      
      // Passa apenas o token. O signIn vai salvar no celular e buscar os dados de /usuarios/me
      await signIn(data.access_token);

      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      router.replace('/(tabs)');
      
    } catch(error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        let mensagemErro = 'Falha na requisição.';
        if (detail) {
           mensagemErro = typeof detail === 'string' 
             ? detail 
             : JSON.stringify(detail, null, 2);
        }
        Alert.alert('Erro de Validação', mensagemErro);
      } else {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    passwordVisible,
    togglePasswordVisibility,
    loading,
    handleLogin,
  };
}