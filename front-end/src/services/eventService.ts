import { api } from './api'; 
import { Event } from '../types/event';

// Interface que define o que o Backend (EventCreateSchema) espera receber 
export interface EventCreateData {
  title: string;
  start_date: string; 
  duration: number; 
  local: string;
  category_id: number;
  organization_id?: number | null;
}

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
  }
};
