import { useState, useEffect } from 'react';
import { eventsService } from '../services/eventService';
import { userService } from '../services/userService';
import { orgService } from '../services/orgService';
import { Event } from '../types/event';
import { User } from '../types/user';
import { Comment } from '../types/comment';

export function useEventDetails(id: number | string | undefined) {
  const [event, setEvent] = useState<Event | null>(null);
  const [likers, setLikers] = useState<User[]>([]);
  const [interested, setInterested] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState<User | null>(null);
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const eventId = Number(id);
        const eventData = await eventsService.getEventById(eventId);

        const [
          likersData,
          interestedData,
          commentsData,
          authorData,
          orgData
        ] = await Promise.all([
          eventsService.getEventLikes(eventId),
          eventsService.getEventInterests(eventId),
          eventsService.getEventComments(eventId),
          userService.getUser(eventData.user_id),
          eventData.organization_id ? orgService.getOrg(eventData.organization_id).catch(() => null) : Promise.resolve(null)
        ]);
        
        setEvent(eventData);
        setLikers(likersData);
        setInterested(interestedData);
        setComments(commentsData);
        setAuthor(authorData);
        setOrganization(orgData);
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

  const deleteEvent = async () => {
    if (!id) return;
    try {
      await eventsService.deleteEvent(Number(id));
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      throw error;
    }
  };

  const updateEvent = async (data: Partial<any>) => {
    if (!id) return;
    try {
      const updatedEvent = await eventsService.updateEvent(Number(id), data);
      setEvent(updatedEvent);
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      throw error;
    }
  };

  const uploadImage = async (formData: any) => {
    if (!id) return;
    try {
      await eventsService.uploadEventImage(Number(id), formData);
      const updatedEvent = await eventsService.getEventById(Number(id));
      setEvent(updatedEvent);
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      throw error;
    }
  };

  const uploadBanner = async (formData: any) => {
    if (!id) return;
    try {
      await eventsService.updateEventBanner(Number(id), formData);
      const updatedEvent = await eventsService.getEventById(Number(id));
      setEvent(updatedEvent);
    } catch (error) {
      console.error("Erro ao atualizar o banner:", error);
      throw error;
    }
  };

  return {
    event,
    likers,
    interested,
    comments,
    author,
    organization,
    loading,
    toggleInterest,
    toggleLike,
    addComment,
    deleteEvent,
    updateEvent,
    uploadImage,
    uploadBanner
  };
}
