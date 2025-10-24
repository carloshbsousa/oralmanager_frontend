import useSWR from 'swr';
import { api } from '@/lib/api';
import { Appointment } from '@/types';
import { useAuth } from '@/context/auth-context';

export function useAppointments(params?: {
  date?: string;
  dentistId?: string;
  patientId?: string;
  status?: string;
}) {
  const { clinic } = useAuth();

  const queryParams = new URLSearchParams();
  if (params?.date) queryParams.append('date', params.date);
  if (params?.dentistId) queryParams.append('dentistId', params.dentistId);
  if (params?.patientId) queryParams.append('patientId', params.patientId);
  if (params?.status) queryParams.append('status', params.status);

  const { data, error, mutate } = useSWR(
    clinic ? `/clinics/${clinic.id}/appointments?${queryParams.toString()}` : null,
    async (url) => {
      const response = await api.get<{ success: boolean; data: Appointment[] }>(url);
      return response.data.data;
    }
  );

  return {
    appointments: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useCreateAppointment() {
  const { clinic } = useAuth();

  const createAppointment = async (appointmentData: Partial<Appointment>) => {
    const response = await api.post(`/clinics/${clinic?.id}/appointments`, appointmentData);
    return response.data.data;
  };

  return { createAppointment };
}

export function useUpdateAppointmentStatus() {
  const { clinic } = useAuth();

  const updateStatus = async (appointmentId: string, status: string) => {
    const response = await api.patch(
      `/clinics/${clinic?.id}/appointments/${appointmentId}/status`,
      { status }
    );
    return response.data.data;
  };

  return { updateStatus };
}