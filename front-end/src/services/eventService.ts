import { api } from './api'; 
import { Event } from '../types/event';
import { User } from '../types/user';
import { Comment } from '../types/comment';

// Interface que define o que o Backend (EventCreateSchema) espera receber 
export interface EventCreateData {
  title: string;
  start_date: string; 
  duration: number; 
  local: string;
  category_id: number;
  organization_id?: number | null;
}

const CATEGORY_MAP: Record<string, number> = {
  party: 1,
  sport: 2,
  workshop: 3,
  lecture: 4,
  congress: 5,
  social: 6,
  religion: 7,
  academic: 8
};

export const eventsService = {
  async createEvent(eventData: EventCreateData) {
    try {
      // Fazemos o POST para a rota /eventos/
      const response = await api.post('/eventos/', eventData);
      
      return response.data; // Retorna { mensagem: "Evento criado...", evento_id: 1 }
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw error;
    }
  },

  async getEvents(
    pagina: number = 1,
    limite: number = 20,
    filtros?: EventFilters
  ): Promise<PaginatedResponse> {
    const params: any = { pagina, limite };
    if (filtros?.busca) params.busca = filtros.busca;
    if (filtros?.categoria && CATEGORY_MAP[filtros.categoria]) {
      params.category_id = CATEGORY_MAP[filtros.categoria];
    }
    if (filtros?.sortBy === 'likes') params.most_likes = true;
    else if (filtros?.sortBy === 'date_desc') params.most_recent = true;

    const response = await api.get('/eventos/', { params });
    return response.data;
  },

  async getEventById(id: number): Promise<Event> {
    const response = await api.get(`/eventos/${id}`);
    return response.data;
  },

  async toggleInterest(id: number): Promise<{ mensagem: string }> {
    const response = await api.post(`/eventos/${id}/interesse`);
    return response.data;
  },

  async toggleLike(id: number): Promise<{ mensagem: string }> {
    const response = await api.post(`/eventos/${id}/curtir`);
    return response.data;
  },

  async getEventLikes(id: number): Promise<User[]> {
    const response = await api.get(`/eventos/${id}/curtidas`);
    return response.data;
  },

  async getEventInterests(id: number): Promise<User[]> {
    const response = await api.get(`/eventos/${id}/interesses`);
    return response.data;
  },

  async getEventComments(id: number): Promise<Comment[]> {
    const response = await api.get(`/eventos/${id}/comentarios`);
    return response.data;
  },

  async getFollowingEvents(pagina: number = 1, limite: number = 20): Promise<PaginatedResponse> {
    const response = await api.get('/eventos/seguindo', { params: { pagina, limite } });
    return response.data;
  },

  async addComment(id: number, content: string): Promise<{ mensagem: string }> {
    const response = await api.post(`/eventos/${id}/comentarios`, { content });
    return response.data;
  },

  async deleteEvent(id: number): Promise<void> {
    await api.delete(`/eventos/${id}`);
  },

  async updateEvent(id: number, data: Partial<any>): Promise<Event> {
    const response = await api.patch(`/eventos/${id}`, data);
    return response.data;
  },

  async uploadEventImage(id: number, formData: any): Promise<any> {
    const response = await api.post(`/eventos/${id}/fotos`, formData);
    return response.data;
  },

  async updateEventBanner(id: number, formData: any): Promise<any> {
    const response = await api.patch(`/eventos/${id}/banner`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export interface EventFilters {
  busca?: string;
  categoria?: string | null;
  sortBy?: 'date_asc' | 'date_desc' | 'likes';
}

export interface PaginatedResponse {
  pagina_atual: number;
  total_eventos: number;
  dados: Event[];
}
