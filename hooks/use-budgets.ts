import useSWR from 'swr';
import { api } from '@/lib/api';
import { Budget } from '@/types';
import { useAuth } from '@/context/auth-context';

export function useBudgets(patientId?: string, status?: string) {
  const { clinic } = useAuth();

  const queryParams = new URLSearchParams();
  if (patientId) queryParams.append('patientId', patientId);
  if (status) queryParams.append('status', status);

  const { data, error, mutate } = useSWR(
    clinic ? `/clinics/${clinic.id}/budgets?${queryParams.toString()}` : null,
    async (url) => {
      const response = await api.get<{ success: boolean; data: Budget[] }>(url);
      return response.data.data;
    }
  );

  return {
    budgets: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useBudget(id?: string) {
  const { clinic } = useAuth();

  const { data, error, mutate } = useSWR(
    clinic && id ? `/clinics/${clinic.id}/budgets/${id}` : null,
    async (url) => {
      const response = await api.get<{ success: boolean; data: Budget }>(url);
      return response.data.data;
    }
  );

  return {
    budget: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useCreateBudget() {
  const { clinic } = useAuth();

  const createBudget = async (budgetData: any) => {
    const response = await api.post(`/clinics/${clinic?.id}/budgets`, budgetData);
    return response.data.data;
  };

  return { createBudget };
}