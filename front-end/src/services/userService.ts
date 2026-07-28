import { api } from './api'; 
import { User, PaginatedUserResponse, UserUpdateDTO } from '../types/user';

export const userService = {
  // Listar usuários com paginação e busca opcional (GET /usuarios/)
  async listUsers(page: number = 1, limit: number = 20, search?: string): Promise<PaginatedUserResponse> {
    const params: any = { page, limit };
    if (search) params.search = search;
    
    const response = await api.get('/usuarios', { params });
    return response.data;
  },

  // Busca o perfil do próprio usuário logado (usa o token automaticamente)
  async getMe(): Promise<User> {
    const response = await api.get('/usuarios/me');
    return response.data;
  },

  // Atualizar o perfil do próprio usuário usando o DTO correto (PATCH /usuarios/me)
  async updateMyProfile(userData: UserUpdateDTO): Promise<User> {
    const response = await api.patch('/usuarios/me', userData);
    return response.data;
  },

  // Excluir conta do próprio usuário (DELETE /usuarios/me)
  async deleteMyProfile(): Promise<{ mensagem: string; usuario_id: number }> {
    const response = await api.delete('/usuarios/me');
    return response.data;
  },

  // Upload de foto de perfil (POST /usuarios/me/foto)
  async uploadMyPhoto(file: File | Blob): Promise<{ mensagem: string; picture_profile: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/usuarios/me/foto', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Busca o perfil de qualquer usuário pelo ID
  async getUser(id: string | number): Promise<User> {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },
  
  // Seguir um usuário (POST /usuarios/{id_following}/seguir)
  async followUser(idFollowing: number | string): Promise<{ mensagem: string; seguindo_id: number }> {
    const response = await api.post(`/usuarios/${idFollowing}/seguir`);
    return response.data;
  },

  // Deixar de seguir um usuário (DELETE /usuarios/{id_following}/seguir)
  async unfollowUser(idFollowing: number | string): Promise<{ mensagem: string; seguindo_id: number }> {
    const response = await api.delete(`/usuarios/${idFollowing}/seguir`);
    return response.data;
  },

  // Listar seguidores de um usuário (GET /usuarios/{user_id}/seguidores)
  async getFollowers(userId: number | string): Promise<User[]> {
    const response = await api.get(`/usuarios/${userId}/seguidores`);
    return response.data;
  },

  // Listar quem o usuário segue (GET /usuarios/{user_id}/seguindo)
  async getFollowing(userId: number | string): Promise<User[]> {
    const response = await api.get(`/usuarios/${userId}/seguindo`);
    return response.data;
  }
};