import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '../services/authService';
import axios from 'axios'; 

export function useLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

const handleLogin = async () => {
    try {
      const data = await authService.login({ email, password });
      // Se deu sucesso (200), faz o login...
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      router.replace('/(tabs)');
      
    } catch(error) {
      // 🚨 O Axios jogou o erro pra cá automaticamente! 🚨
      
      // Verifica se o erro veio do servidor (axios)
      if (axios.isAxiosError(error)) {
        // error.response.data contém aquele mesmo JSON que o FastAPI devolve
        const detail = error.response?.data?.detail;
        
        let mensagemErro = 'Falha na requisição.';
        
        if (detail) {
           // Transforma o Array (no caso do erro 422) em texto, ou usa a String direto (no erro 400)
           mensagemErro = typeof detail === 'string' 
             ? detail 
             : JSON.stringify(detail, null, 2);
        }
        
        Alert.alert('Erro de Validação', mensagemErro);
      } else {
        // Se for erro de internet caída, etc.
        Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
      }
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