export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'photo' | 'video' | 'checkin' | 'activity';
  completed: boolean;
  evidence?: {
    type: 'photo' | 'video';
    url: string;
    uploadedAt: string;
  };
  points: number;
}

export interface Post {
  id: string;
  stopId: string;
  type: 'photo' | 'video' | 'note';
  content: string;
  mediaUrl?: string;
  createdAt: string;
  author: string;
}

export interface ItineraryStop {
  id: string;
  destinationId: string;
  name: string;
  image: string;
  coordinates: [number, number];
  scheduledTime: string;
  duration: string; // e.g., "2 hours"
  challenges: Challenge[];
  posts: Post[];
  notes?: string;
}

export interface Itinerary {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  stops: ItineraryStop[];
  createdAt: string;
  updatedAt: string;
}

export interface UploadData {
  type: 'photo' | 'video';
  file: File;
  preview: string;
}