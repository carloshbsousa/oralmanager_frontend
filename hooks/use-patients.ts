import useSWR from 'swr';
import { api } from '@/lib/api';
import { Patient, PaginatedResponse } from '@/types';
import { useAuth } from '@/context/auth-context';

export function usePatients(page = 1, limit = 10, search = '') {
  const { clinic } = useAuth();

  const { data, error, mutate } = useSWR(
    clinic ? `/clinics/${clinic.id}/patients?page=${page}&limit=${limit}&search=${search}` : null,
    async (url) => {
      const response = await api.get<{ success: boolean; data: PaginatedResponse<Patient> }>(url);
      return response.data.data;
    }
  );

  return {
    patients: data?.patients || [],
    pagination: data?.pagination,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function usePatient(id?: string) {
  const { clinic } = useAuth();

  const { data, error, mutate } = useSWR(
    clinic && id ? `/clinics/${clinic.id}/patients/${id}` : null,
    async (url) => {
      const response = await api.get<{ success: boolean; data: Patient }>(url);
      return response.data.data;
    }
  );

  return {
    patient: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useCreatePatient() {
  const { clinic } = useAuth();

  const createPatient = async (patientData: Partial<Patient>) => {
    const response = await api.post(`/clinics/${clinic?.id}/patients`, patientData);
    return response.data.data;
  };

  return { createPatient };
}

export function useUpdatePatient(id: string) {
  const { clinic } = useAuth();

  const updatePatient = async (patientData: Partial<Patient>) => {
    const response = await api.put(`/clinics/${clinic?.id}/patients/${id}`, patientData);
    return response.data.data;
  };

  return { updatePatient };
}

export function useDeletePatient() {
  const { clinic } = useAuth();

  const deletePatient = async (id: string) => {
    await api.delete(`/clinics/${clinic?.id}/patients/${id}`);
  };

  return { deletePatient };
}