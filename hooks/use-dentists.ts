import useSWR from 'swr';
import { api } from '@/lib/api';
import { Dentist } from '@/types';
import { useAuth } from '@/context/auth-context';

export function useDentists() {
  const { clinic } = useAuth();

  const { data, error, mutate } = useSWR(
    clinic ? `/clinics/${clinic.id}/dentists` : null,
    async (url) => {
      const response = await api.get<{ success: boolean; data: Dentist[] }>(url);
      return response.data.data;
    }
  );

  return {
    dentists: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}