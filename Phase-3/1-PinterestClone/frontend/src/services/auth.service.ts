import api from './api';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types';

export const authService = {
  async register(data: RegisterCredentials): Promise<{ message: string }> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(data: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    const { token } = response.data;
    localStorage.setItem('token', token);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('current_user');
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};