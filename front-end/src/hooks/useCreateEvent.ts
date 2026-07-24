import { useState } from 'react';
import { eventsService, EventCreateData } from '../services/eventService';

export function useCreateEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = async (eventData: EventCreateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventsService.createEvent(eventData);
      return response; // Retorna os dados para a tela poder exibir um Alerta de Sucesso
    } catch (err: any) {
      console.error(err);
      
      let errorMessage = 'Ocorreu um erro ao criar o evento. Tente novamente.';
      const detail = err.response?.data?.detail;
      
      if (typeof detail === 'string') {
        errorMessage = detail;
      } else if (Array.isArray(detail) && detail.length > 0) {
        // FastAPI validation errors (422) return an array of objects
        errorMessage = detail.map((errItem) => errItem.msg).join(', ');
      }
      
      setError(errorMessage);
      throw err; // Repassa o erro caso a tela queira fazer algo (ex: vibrar o celular)
    } finally {
      setLoading(false);
    }
  };

  return { createEvent, loading, error };
}
