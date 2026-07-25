import { useState, useEffect } from 'react';
import { eventsService } from '../services/eventService';
import { Event } from '../types/event';

export function useEventDetails(id: number | string | undefined) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await eventsService.getEventById(Number(id));
        setEvent(data);
      } catch (error) {
        console.error("Erro no useEventDetails:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const toggleInterest = async () => {
    if (!id) return;
    try {
      await eventsService.toggleInterest(Number(id));
      // TODO: Ideally we would update the event object locally here if we know the new state.
      // But for now, we just let the UI handle the toggle state.
    } catch (error) {
      console.error("Erro ao registrar interesse:", error);
    }
  };

  return {
    event,
    loading,
    toggleInterest
  };
}
