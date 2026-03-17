import api from './apiClient';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export const authService = {
  fetchMe: async (): Promise<AuthUser | null> => {
    const response = await api.get('/api/auth/me');
    return response.data?.user ?? null;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },
};
