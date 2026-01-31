export type EventCategory = 
  | 'college-fest'
  | 'competition'
  | 'sports'
  | 'hackathon'
  | 'cultural'
  | 'workshop';

export type EventStatus = 'draft' | 'published' | 'completed' | 'archived';

export interface Event {
  id: string;
  organizerId: string;
  name: string;
  category: EventCategory;
  location: string;
  audienceSize: number;
  date: Date;
  description: string;
  sponsorshipRequirements: string;
  bannerUrl?: string;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}
