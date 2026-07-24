import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '../services/authService';
import axios from 'axios'; 

export function useRegister() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };

  const handleRegister = async () => {
    if (!name.trim() || !nickname.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não conferem.');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Digite um email válido.');
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        name,
        nickname,
        email,
        password,
        bio: '',
      });

      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      router.replace('/login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        let mensagemErro = 'Não foi possível concluir o cadastro.';
        
        if (detail) {
           mensagemErro = typeof detail === 'string' 
             ? detail 
             : JSON.stringify(detail, null, 2);
        }
        
        Alert.alert('Erro no cadastro', mensagemErro);
      } else {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
