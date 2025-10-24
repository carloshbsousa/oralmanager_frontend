import useSWR from 'swr';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';

export function useFinancialReport(startDate: string, endDate: string) {
  const { clinic } = useAuth();

  const { data, error } = useSWR(
    clinic ? `/clinics/${clinic.id}/reports/financial?startDate=${startDate}&endDate=${endDate}` : null,
    async (url) => {
      const response = await api.get<{ success: boolean; data: any }>(url);
      return response.data.data;
    }
  );

  return {
    report: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useProductionReport(startDate: string, endDate: string, dentistId?: string) {
  const { clinic } = useAuth();

  const queryParams = new URLSearchParams({
    startDate,
    endDate,
  });
  if (dentistId) queryParams.append('dentistId', dentistId);

  const { data, error } = useSWR(
    clinic ? `/clinics/${clinic.id}/reports/production?${queryParams.toString()}` : null,
    async (url) => {
      const response = await api.get<{ success: boolean; data: any }>(url);
      return response.data.data;
    }
  );

  return {
    report: data,
    isLoading: !error && !data,
    isError: error,
  };
}
