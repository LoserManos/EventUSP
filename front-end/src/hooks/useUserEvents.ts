import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';

export function useUserEvents(userId: number) {
  const [eventTab, setEventTab] = useState<'criados' | 'interesses' | 'curtidos'>('criados');
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    async function fetchUserEvents() {
      if (!userId) return;
      setEventsLoading(true);
      try {
        let data = [];
        if (eventTab === 'criados') data = await userService.getUserCreatedEvents(userId);
        else if (eventTab === 'interesses') data = await userService.getUserInterestedEvents(userId);
        else if (eventTab === 'curtidos') data = await userService.getUserLikedEvents(userId);
        setEventsList(data);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        setEventsList([]);
      } finally {
        setEventsLoading(false);
      }
    }
    fetchUserEvents();
  }, [userId, eventTab]);

  return { eventTab, setEventTab, eventsList, eventsLoading };
}