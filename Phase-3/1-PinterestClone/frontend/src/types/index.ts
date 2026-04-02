export interface User {
  _id: string;
  username: string;
  email: string;
  followers: string[];
  following: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Pin {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  createdBy: User;
  board?: Board;
  likes: string[];
  saves: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  _id: string;
  name: string;
  description?: string;
  createdBy: User;
  pins: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  text: string;
  userId: User | string;  
  pinId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'follow' | 'like' | 'comment' | 'save';
  fromUser: User;
  pinId?: Pin;
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface CreatePinData {
  title: string;
  description?: string;
  imageUrl: string;
  board?: string;
}

export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
  };
  alt_description: string;
  description: string;
  likes: number;
}