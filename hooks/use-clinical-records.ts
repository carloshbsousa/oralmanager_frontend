import useSWR from 'swr';
import { api } from '@/lib/api';
import { ClinicalRecord, PaginatedResponse } from '@/types';
import { useAuth } from '@/context/auth-context';

export function useClinicalRecords(params?: {
  patientId?: string;
  dentistId?: string;
  page?: number;
  limit?: number;
}) {
  const { clinic } = useAuth();

  const queryParams = new URLSearchParams();
  if (params?.patientId) queryParams.append('patientId', params.patientId);
  if (params?.dentistId) queryParams.append('dentistId', params.dentistId);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const { data, error, mutate } = useSWR(
    clinic ? `/clinics/${clinic.id}/clinical-records?${queryParams.toString()}` : null,
    async (url) => {
      const response = await api.get<{ success: boolean; data: PaginatedResponse<ClinicalRecord> }>(url);
      return response.data.data;
    }
  );

  return {
    records: data?.records || [],
    pagination: data?.pagination,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useClinicalRecord(id?: string) {
  const { clinic } = useAuth();

  const { data, error, mutate } = useSWR(
    clinic && id ? `/clinics/${clinic.id}/clinical-records/${id}` : null,
    async (url) => {
      const response = await api.get<{ success: boolean; data: ClinicalRecord }>(url);
      return response.data.data;
    }
  );

  return {
    record: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useCreateClinicalRecord() {
  const { clinic } = useAuth();

  const createRecord = async (recordData: Partial<ClinicalRecord>) => {
    const response = await api.post(`/clinics/${clinic?.id}/clinical-records`, recordData);
    return response.data.data;
  };

  return { createRecord };
}