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
};
