// src/services/orgService.ts
import { api } from './api';
import { Organization, 
         OrganizationCreateDTO, 
         OrganizationUpdateDTO, 
         PaginatedOrgResponse, 
         OrgMember } from '@/types/org';
import { User } from '@/types/user';

export const orgService = {
  // Listar organizações (com paginação e busca opcional)
  async listOrgs(page = 1, limit = 20, search = ''): Promise<PaginatedOrgResponse> {
    const response = await api.get(`/organizacoes`, {
      params: { page, limit, search },
    });
    return response.data;
  },

  async getOrg(id: number): Promise<Organization> {
    const response = await api.get(`/organizacoes/${id}`);
    return response.data;
  },

  // Criar Organização
  async createOrg(data: OrganizationCreateDTO): Promise<{ mensagem: string; organizacao_id: number }> {
    const response = await api.post('/organizacoes/', data);
    return response.data;
  },

  // Atualizar Organização
  async updateOrg(id: number, data: OrganizationUpdateDTO): Promise<Organization> {
    const response = await api.patch(`/organizacoes/${id}`, data);
    return response.data;
  },

  // Upload da foto da organização
  async uploadOrgPhoto(id: number, file: { uri: string; name: string; type: string }): Promise<{ mensagem: string; picture_profile: string }> {
    const formData = new FormData();
    formData.append('file', file as any);

    const response = await api.post(`/organizacoes/${id}/foto`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Excluir Organização
  async deleteOrg(id: number): Promise<void> {
    await api.delete(`/organizacoes/${id}`);
  },

  // Solicitar entrada na organização
  async joinOrg(id: number): Promise<{ mensagem: string }> {
    const response = await api.post(`/organizacoes/${id}/entrar`);
    return response.data;
  },

  // Aceitar solicitação de entrada de um membro (Admin) - Corrigido para /aceitar
  async approveMember(orgId: number, userId: number): Promise<{ mensagem: string }> {
    const response = await api.patch(`/organizacoes/${orgId}/membros/${userId}/aceitar`);
    return response.data;
  },

  // Sair da organização
  async leaveOrg(id: number): Promise<{ mensagem: string }> {
    const response = await api.delete(`/organizacoes/${id}/sair`);
    return response.data;
  },

  // Listar membros de uma organização
  async getOrgMembers(id: number) {
    const response = await api.get(`/organizacoes/${id}/membros`);
    return response.data;
  },

  async getMemberStatus(orgId: number, userId: number) {
    try {
      const response = await api.get(`/organizacoes/${orgId}/membros/${userId}`);
      return response.data; // Retorna { user_id, organization_id, role, status }
    } catch {
      return null;
    }
  },

  // Listar solicitações pendentes de entrada na organização (Admin)
  async getPendingOrgMembers(id: number): Promise<User[]> {
    const response = await api.get(`/organizacoes/${id}/membros/pendentes`);
    return response.data;
  },

  // Promover membro da organização admin (Admin)
  async PromoteMember(orgId: number, userId: number): Promise<{ mensagem: string }> {
    const response = await api.patch(`/organizacoes/${orgId}/membros/${userId}/promover`);
    return response.data;
  },

  // Rebaixar admin da organização a membro (Admin)
    async DemoteMember(orgId: number, userId: number): Promise<{ mensagem: string }> {
    const response = await api.patch(`/organizacoes/${orgId}/membros/${userId}/rebaixar`);
    return response.data;
  },

  // Transferir a posse da organização (Apenas o Dono atual)
  async transferOwnership(orgId: number, newOwnerId: number): Promise<{ mensagem: string }> {
    const response = await api.patch(`/organizacoes/${orgId}/transferir-propriedade/${newOwnerId}`);
    return response.data;
  },
};