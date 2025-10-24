import useSWR from 'swr';
import { api } from '@/lib/api';
import { OdontogramCondition } from '@/types';
import { useAuth } from '@/context/auth-context';

export function useOdontogram(patientId?: string) {
  const { clinic } = useAuth();

  const { data, error, mutate } = useSWR(
    clinic && patientId ? `/clinics/${clinic.id}/patients/${patientId}/odontogram` : null,
    async (url) => {
      const response = await api.get<{ success: boolean; data: any }>(url);
      return response.data.data;
    }
  );

  return {
    odontogram: data?.odontogram,
    patient: data?.patient,
    lastUpdate: data?.lastUpdate,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useUpdateOdontogram(patientId: string) {
  const { clinic } = useAuth();

  const updateOdontogram = async (conditions: Partial<OdontogramCondition>[]) => {
    const response = await api.post(`/clinics/${clinic?.id}/patients/${patientId}/odontogram`, {
      patientId,
      conditions,
    });
    return response.data.data;
  };

  return { updateOdontogram };
}