import api from './api';
import { Event } from '../types/event';

export const eventService = {
  async getAll(): Promise<Event[]> {
    const response = await api.get('/events');
    // Handle both formats: direct array or { data: [] }
    return Array.isArray(response.data) ? response.data : (response.data.data || []);
  },

  async getById(id: string): Promise<Event> {
    const response = await api.get(`/events/${id}`);
    return response.data.data || response.data;
  },

  async create(data: Partial<Event>): Promise<Event> {
    const response = await api.post('/events', data);
    return response.data.data || response.data;
  },

  async update(id: string, data: Partial<Event>): Promise<Event> {
    const response = await api.put(`/events/${id}`, data);
    return response.data.data || response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },

  async getUpcoming(): Promise<Event[]> {
    const response = await api.get('/events/upcoming');
    return Array.isArray(response.data) ? response.data : (response.data.data || []);
  },

  async getPast(): Promise<Event[]> {
    const response = await api.get('/events/past');
    return Array.isArray(response.data) ? response.data : (response.data.data || []);
  },
};
