// src/services/orgService.ts
import { api } from './api';
import { Organization, OrganizationCreateDTO, OrganizationUpdateDTO, PaginatedOrgResponse, OrgMember } from '@/types/org';

export const orgService = {
  // Listar organizações (com paginação e busca opcional)
  async listOrgs(page = 1, limit = 20, search = ''): Promise<PaginatedOrgResponse> {
    const response = await api.get(`/organizacoes`, {
      params: { page, limit, search },
    });
    return response.data;
  },

  //// Obter detalhes de uma organização específica
  //async getOrg(id: number): Promise<Organization> {
  //  const response = await api.get(`/organizacoes/${id}`);
  //  return response.data;
  //},

  async getOrg(id: number): Promise<Organization> {
    // Como não sabemos a página exata, buscamos a primeira página com um limite alto ou buscamos até achar
    let page = 1;
    let foundOrg: Organization | null = null;

    while (page <= 5) { // Limite de segurança para evitar loops infinitos
      const response = await this.listOrgs(page, 50, ''); // ou listOrgs(page, 50, '')
      foundOrg = response.data.find((org: Organization) => org.id === id) || null;
      
      if (foundOrg || page >= response.total_pages) break;
      page++;
    }

    if (!foundOrg) {
      throw new Error("Organização não encontrada via listagem.");
    }

    return foundOrg;
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

  // [Previsão] Aprovar solicitação de entrada de um membro (Admin)
  async approveMember(orgId: number, userId: number): Promise<{ mensagem: string }> {
    const response = await api.patch(`/organizacoes/${orgId}/membros/${userId}/aprovar`);
    return response.data;
  },
};