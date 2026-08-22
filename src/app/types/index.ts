export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  fullDescription: string;
  tags: string[];
  coverImage: string;
  accentColor: string;
  images: string[];
}

export interface Experience {
  id: number;
  period: string;
  role: string;
  company: string;
  location: string;
  current?: boolean;
  highlights: string[];
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}
