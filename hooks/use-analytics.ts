import useSWR from 'swr';
import { api } from '@/lib/api';
import { useAuth } from '@/context/auth-context';

export function useAnalytics(period: 'week' | 'month' | 'quarter' | 'year' = 'month') {
  const { clinic } = useAuth();

  const { data, error } = useSWR(
    clinic ? `/clinics/${clinic.id}/analytics?period=${period}` : null,
    async (url) => {
      const response = await api.get<{ success: boolean; data: any }>(url);
      return response.data.data;
    }
  );

  return {
    analytics: data,
    kpis: data?.kpis,
    trends: data?.trends,
    isLoading: !error && !data,
    isError: error,
  };
}