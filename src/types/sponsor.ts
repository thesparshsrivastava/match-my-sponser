import { EventCategory } from './event';

export interface Sponsor {
  id: string;
  userId: string;
  companyName: string;
  industry: string;
  budgetRange: {
    min: number;
    max: number;
  };
  location: string;
  logoUrl?: string;
  preferences: {
    categories: EventCategory[];
    audienceSize: {
      min: number;
      max: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}
