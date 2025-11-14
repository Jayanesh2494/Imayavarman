import api from './api';
import { Event, CreateEventData } from '../types/event';

export const eventService = {
  async getAll(): Promise<Event[]> {
    try {
      return await api.get('/events');
    } catch (error) {
      throw error;
    }
  },

  async getById(id: string): Promise<Event> {
    try {
      return await api.get(`/events/${id}`);
    } catch (error) {
      throw error;
    }
  },

  async create(data: CreateEventData): Promise<Event> {
    try {
      return await api.post('/events', data);
    } catch (error) {
      throw error;
    }
  },

  async update(id: string, data: Partial<Event>): Promise<Event> {
    try {
      return await api.put(`/events/${id}`, data);
    } catch (error) {
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      return await api.delete(`/events/${id}`);
    } catch (error) {
      throw error;
    }
  },

  async getUpcoming(): Promise<Event[]> {
    try {
      return await api.get('/events/upcoming');
    } catch (error) {
      throw error;
    }
  },

  async getPast(): Promise<Event[]> {
    try {
      return await api.get('/events/past');
    } catch (error) {
      throw error;
    }
  },

  async getByCategory(category: string): Promise<Event[]> {
    try {
      return await api.get(`/events/category/${category}`);
    } catch (error) {
      throw error;
    }
  },

  async uploadImage(eventId: string, imageBase64: string): Promise<string> {
    try {
      const response = await api.post(`/events/${eventId}/upload-image`, {
        image: imageBase64,
      });
      return response.imageUrl;
    } catch (error) {
      throw error;
    }
  },
};
