import { api } from '../services/api';
import { Event } from '../types/event';

export interface EventFilters {
  busca?: string;
  categoria?: string | null;
  orgName?: string;
  creatorName?: string;
  dateAfter?: string;
  dateBefore?: string;
  timeAfter?: string;
  timeBefore?: string;
  sortBy?: 'date_asc' | 'date_desc' | 'likes';
}

export interface PaginatedResponse {
  pagina_atual: number;
  total_eventos: number;
  dados: Event[];
}

export const getEvents = async (
  pagina: number = 1, 
  limite: number = 20,
  filtros?: EventFilters
): Promise<PaginatedResponse> => {
  try {
    const params: any = {
      pagina,
      limite,
    };

    if (filtros?.busca) {
      params.busca = filtros.busca;
    }

    if (filtros?.categoria) {
      params.category_id = Number(filtros.categoria);
    }
    
    // O backend já suporta ordenar por mais likes, etc.
    if (filtros?.sortBy === 'likes') {
      params.most_likes = true;
    } else if (filtros?.sortBy === 'date_desc') {
      params.most_recent = true; // Assumindo most_recent como data de criação, ou poderia ser closest
    }

    const response = await api.get('/eventos/', { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar eventos na API:", error);
    // Retorna um fallback vazio em caso de erro para não quebrar a tela
    return {
      pagina_atual: pagina,
      total_eventos: 0,
      dados: []
    };
  }
};