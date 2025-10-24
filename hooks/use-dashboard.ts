import useSWR from 'swr';
import { api } from '@/lib/api';
import { useAuth } from '@/context/auth-context';

export function useDashboard() {
  const { clinic } = useAuth();

  const { data, error } = useSWR(
    clinic ? `/clinics/${clinic.id}/dashboard` : null,
    async (url) => {
      const response = await api.get<{ success: boolean; data: any }>(url);
      return response.data.data;
    }
  );

  return {
    stats: data?.stats,
    recentAppointments: data?.recentAppointments || [],
    isLoading: !error && !data,
    isError: error,
  };
}