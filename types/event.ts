export interface Event {
  _id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  category: 'competition' | 'workshop' | 'ceremony' | 'practice' | 'other';
  participants?: string[];
  images?: string[];
  createdBy?: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  date: string;
  location?: string;
  category: 'competition' | 'workshop' | 'ceremony' | 'practice' | 'other';
}
