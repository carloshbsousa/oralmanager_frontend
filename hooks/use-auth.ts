import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/auth-context';
import { api } from '@/lib/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  clinicName: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  slug: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface Clinic {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  subscriptionStatus: string;
}

interface AuthResponse {
  token: string;
  user: User;
  clinic: Clinic;
}

export function useAuth() {
  const context = useContext(AuthContext);
  const router = useRouter();

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, clinic, isAuthenticated, isLoading, setUser, setClinic } = context;

  /**
   * Login do usuário
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { token, user, clinic } = response;

      // Salvar token no localStorage
      localStorage.setItem('token', token);
      
      // Configurar token no axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Atualizar contexto
      setUser(user);
      setClinic(clinic);

      // Redirecionar para dashboard
      router.push('/');
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  };

  /**
   * Registro de novo usuário e clínica
   */
  const register = async (data: RegisterData): Promise<void> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      const { token, user, clinic } = response;

      // Salvar token no localStorage
      localStorage.setItem('token', token);
      
      // Configurar token no axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Atualizar contexto
      setUser(user);
      setClinic(clinic);

      // Redirecionar para dashboard
      router.push('/');
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error.response?.data?.message || 'Erro ao criar conta');
    }
  };

  /**
   * Logout do usuário
   */
  const logout = async (): Promise<void> => {
    try {
      // Remover token do localStorage
      localStorage.removeItem('token');
      
      // Remover token do axios
      delete api.defaults.headers.common['Authorization'];

      // Limpar contexto
      setUser(null);
      setClinic(null);

      // Redirecionar para login
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Verificar e carregar dados do usuário autenticado
   */
  const loadUser = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found');
      }

      // Configurar token no axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Buscar dados do usuário
      const response = await api.get<User & { clinic: Clinic }>('/auth/me');
      
      setUser(response.user);
      setClinic(response.clinic);
    } catch (error) {
      console.error('Load user error:', error);
      // Se falhar, fazer logout
      logout();
    }
  };

  /**
   * Atualizar perfil do usuário
   */
  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      const response = await api.patch<User>('/auth/profile', data);
      setUser(response);
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error.response?.data?.message || 'Erro ao atualizar perfil');
    }
  };

  /**
   * Alterar senha
   */
  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error: any) {
      console.error('Change password error:', error);
      throw new Error(error.response?.data?.message || 'Erro ao alterar senha');
    }
  };

  /**
   * Solicitar recuperação de senha
   */
  const requestPasswordReset = async (email: string): Promise<void> => {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error: any) {
      console.error('Request password reset error:', error);
      throw new Error(error.response?.data?.message || 'Erro ao solicitar recuperação de senha');
    }
  };

  /**
   * Resetar senha com token
   */
  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword,
      });
      
      // Redirecionar para login
      router.push('/login');
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw new Error(error.response?.data?.message || 'Erro ao resetar senha');
    }
  };

  /**
   * Verificar se o usuário tem uma permissão específica
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Owners e admins têm todas as permissões
    if (user.role === 'owner' || user.role === 'admin') {
      return true;
    }

    // Lógica adicional de permissões pode ser implementada aqui
    return false;
  };

  /**
   * Verificar se o usuário tem um dos papéis especificados
   */
  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  return {
    // Estado
    user,
    clinic,
    isAuthenticated,
    isLoading,
    
    // Métodos de autenticação
    login,
    register,
    logout,
    loadUser,
    
    // Métodos de perfil
    updateProfile,
    changePassword,
    
    // Métodos de recuperação de senha
    requestPasswordReset,
    resetPassword,
    
    // Métodos de permissão
    hasPermission,
    hasRole,
  };
}

// Hook para proteção de rotas
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (!isLoading && !isAuthenticated) {
    router.push('/login');
  }

  return { isAuthenticated, isLoading };
}

// Hook para redirecionar usuários autenticados
export function useRedirectIfAuthenticated() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (!isLoading && isAuthenticated) {
    router.push('/');
  }

  return { isAuthenticated, isLoading };
}