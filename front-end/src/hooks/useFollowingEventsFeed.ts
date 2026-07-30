// src/hooks/useFollowingEventsFeed.ts
import { useState, useEffect, useCallback } from 'react';
import { eventsService } from '@/services/eventService';
import { Event } from '@/types/event';

export function useFollowingEventsFeed(limite: number = 20) {
  const [data, setData] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchEvents = useCallback(async (pageToFetch: number, shouldReset: boolean = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await eventsService.getFollowingEvents(pageToFetch, limite);
      const newEvents = response.dados || [];

      setData(prev => shouldReset ? newEvents : [...prev, ...newEvents]);
      if (newEvents.length < limite) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erro ao buscar feed de seguindo:', error);
    } finally {
      setLoading(false);
    }
  }, [limite, loading]);

  useEffect(() => {
    fetchEvents(1, true);
  }, []);

  const loadMoreEvents = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchEvents(nextPage, false);
    }
  };

  return { data, loading, loadMoreEvents };
}