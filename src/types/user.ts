export interface User {
  id: string;
  email: string;
  name: string;
  role: 'organizer' | 'sponsor';
  avatar?: string;
  bio?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile extends User {
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  contactInfo?: {
    phone?: string;
    address?: string;
  };
}
