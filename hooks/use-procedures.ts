import useSWR from 'swr';
import { api } from '@/lib/api';
import { Procedure } from '@/types';
import { useAuth } from '@/context/auth-context';

export function useProcedures(category?: string) {
  const { clinic } = useAuth();

  const queryParams = category ? `?category=${category}` : '';

  const { data, error, mutate } = useSWR(
    clinic ? `/clinics/${clinic.id}/procedures${queryParams}` : null,
    async (url) => {
      const response = await api.get<{ success: boolean; data: Procedure[] }>(url);
      return response.data.data;
    }
  );

  return {
    procedures: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}