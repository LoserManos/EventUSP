import { api } from './api'; 

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    // Como a 'api' já tem a baseURL, basta passar a rota '/auth/login'
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(data: any) {
    const response = await api.post('/auth/signup', data);
    return response.data;
  }
};