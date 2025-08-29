





export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string; // ISO string
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string; // ISO string
}

export interface ReadingPath {
  title: string;
  description: string;
  postIds: string[];
}

export interface Snippet {
  id: string;
  name: string;
  description: string;
  icon: string; // Name of the icon component from icons.tsx
  content: string; // HTML content to be inserted
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  isDeletable: boolean;
}

export interface User {
  id:string;
  name: string;
  email: string;
  avatarUrl: string;
  password?: string; // In a real app, this would be a hash
  isVerified: boolean;
  isAdmin?: boolean;
}

export interface Author {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  followers: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorAvatarUrl: string;
  text: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'spam';
}

export interface Post {
  id:string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: Author;
  category: Category;
  tags: Tag[];
  publishedDate: string;
  readingTime: number; // in minutes
  likes: number;
  featured?: boolean;
  status: 'published' | 'draft';
  history?: { content: string; timestamp: string }[];
}