// frontend/hooks/useAppointments.ts
import { useState, useEffect } from "react";
import api from "../utils/api";
import { Appointment } from "../types/appointment";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const normalize = (a: any): Appointment => ({
    id: a.id ?? a._id,
    _id: a._id,
    patientId: a.patientId,
    date: a.date,
    reason: a.reason,
    notes: a.notes,
    tenantId: a.tenantId,
  });

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/appointments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const normalized = (res.data || []).map((a: any) => normalize(a));
      setAppointments(normalized);
    } catch (error) {
      console.error("Erro ao carregar consultas:", error);
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointment: Partial<Appointment>) => {
    try {
      const res = await api.post("/appointments", appointment, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAppointments((prev) => [...prev, normalize(res.data)]);
    } catch (error) {
      console.error("Erro ao criar consulta:", error);
    }
  };

  const updateAppointment = async (id: string, appointment: Partial<Appointment>) => {
    try {
      const res = await api.put(`/appointments/${id}`, appointment, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAppointments((prev) => prev.map((a) => (a.id === id ? normalize(res.data) : a)));
    } catch (error) {
      console.error("Erro ao atualizar consulta:", error);
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await api.delete(`/appointments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Erro ao excluir consulta:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
};
