import { useState, useEffect } from 'react';
import { eventsService } from '../services/eventService';
import { Event } from '../types/event';
import { User } from '../types/user';
import { Comment } from '../types/comment';

export function useEventDetails(id: number | string | undefined) {
  const [event, setEvent] = useState<Event | null>(null);
  const [likers, setLikers] = useState<User[]>([]);
  const [interested, setInterested] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const eventId = Number(id);
        const [
          eventData,
          likersData,
          interestedData,
          commentsData
        ] = await Promise.all([
          eventsService.getEventById(eventId),
          eventsService.getEventLikes(eventId),
          eventsService.getEventInterests(eventId),
          eventsService.getEventComments(eventId)
        ]);
        
        setEvent(eventData);
        setLikers(likersData);
        setInterested(interestedData);
        setComments(commentsData);
      } catch (error) {
        console.error("Erro no useEventDetails:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  const toggleInterest = async () => {
    if (!id) return;
    try {
      await eventsService.toggleInterest(Number(id));
    } catch (error) {
      console.error("Erro ao registrar interesse:", error);
    }
  };

  const toggleLike = async () => {
    if (!id) return;
    try {
      await eventsService.toggleLike(Number(id));
    } catch (error) {
      console.error("Erro ao registrar curtida:", error);
    }
  };

  const addComment = async (content: string) => {
    if (!id) return;
    try {
      await eventsService.addComment(Number(id), content);
      // Recarregar apenas comentários
      const commentsData = await eventsService.getEventComments(Number(id));
      setComments(commentsData);
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    }
  };

  return {
    event,
    likers,
    interested,
    comments,
    loading,
    toggleInterest,
    toggleLike,
    addComment
  };
}
