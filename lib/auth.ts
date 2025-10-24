import { api } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  clinicName: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  slug: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  subscriptionStatus: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  clinic: Clinic;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', credentials);
    
    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('clinic', JSON.stringify(data.data.clinic));
      return data.data;
    }
    
    throw new Error('Login failed');
  },

  async register(registerData: RegisterData): Promise<AuthResponse> {
    const { data } = await api.post('/auth/register', registerData);
    
    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('clinic', JSON.stringify(data.data.clinic));
      return data.data;
    }
    
    throw new Error('Registration failed');
  },

  async me(): Promise<User> {
    const { data } = await api.get('/auth/me');
    return data.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('clinic');
    window.location.href = '/login';
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getClinic(): Clinic | null {
    const clinic = localStorage.getItem('clinic');
    return clinic ? JSON.parse(clinic) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};