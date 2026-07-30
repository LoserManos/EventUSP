import { useState, useEffect } from 'react';
import { eventsService } from '../services/eventService';
import { Event } from '../types/event';

export function useFollowingEventsFeed(limite: number = 20) {
  const [data, setData] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreEvents = async (resetPage = false) => {
    const currentPage = resetPage ? 1 : page;
    
    if (loading || (!hasMore && !resetPage)) return;
    setLoading(true);

    try {
      const response = await eventsService.getFollowingEvents(currentPage, limite);

      setData((prevData) => {
        const newData = resetPage ? response.dados : [...prevData, ...response.dados];
        // Remove duplicatas
        return newData.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
      });

      setHasMore(response.dados.length === limite);
      if (!resetPage) setPage((p) => p + 1);
      
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    loadMoreEvents(true);
  }, []);

  return {
    data,
    loading,
    hasMore,
    loadMoreEvents
  };
}
