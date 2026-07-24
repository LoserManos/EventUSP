import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import { User } from '../types/user';
import axios from 'axios';

interface UseFetchUserResult {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Sem argumento = busca o próprio perfil logado (/usuarios/me)
// Com ID = busca o perfil de outro usuário (/usuarios/:id)
export function useFetchUser(id?: string | number): UseFetchUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Se receber um ID, busca aquele usuário. Se não, busca o /me
      const data = id
        ? await userService.getUser(id)
        : await userService.getMe();

      setUser(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;

        if (Array.isArray(detail)) {
          setError(detail[0]?.msg || 'Dados do usuário inválidos.');
        } else if (typeof detail === 'string') {
          setError(detail);
        } else {
          setError('Não foi possível carregar os dados do usuário.');
        }
      } else {
        setError('Não foi possível conectar ao servidor.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser, // Permite recarregar manualmente (ex: Pull to Refresh)
  };
}