import { api } from './api'; 
import { User } from '../types/user';

export const userService = {
  // Busca o perfil do próprio usuário logado (usa o token automaticamente)
  async getMe(): Promise<User> {
    const response = await api.get('/usuarios/me');
    return response.data;
  },

  // Busca o perfil de qualquer usuário pelo ID
  async getUser(id: string | number): Promise<User> {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },
};