// frontend/hooks/usePatients.ts
import { useState, useEffect, useRef } from "react";
import api from "../utils/api"; // Importa sua instância Axios padronizada
import { Patient } from "../types/patient";
// O import * as PatientService from '../lib/api/patientService'; não é usado aqui,
// pois o hook está chamando a API diretamente. Vou removê-lo.

/**
 * Hook para pacientes com suporte a:
 * - Paginação (page + limit)
 * - Pesquisa com debounce
 */
export function usePatients(
  search: string = "",
  page: number = 1,
  limit: number = 10
) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch {}
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const skip = (page - 1) * limit;
        const params: Record<string, any> = { skip, limit };
        if (search) params.search = search;

        // *** MUDANÇA 1: Removendo o cabeçalho de autenticação, pois o 'api' já faz isso ***
        const res = await api.get("/patients", {
          params,
          signal: controller.signal as any,
        });

        // Lógica de normalização de resposta (mantida para robustez)
        let data: any[] = [];
        let total: number | undefined;

        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data?.data) {
          data = res.data.data;
          total = res.data.total;
        } else if (res.data?.patients) {
          data = res.data.patients;
          total = res.data.total;
          // Seu backend retorna totalPages e currentPage, vamos usá-los se existirem
          if (res.data.totalPages !== undefined) setTotalPages(res.data.totalPages);
          if (res.data.total !== undefined) setTotalCount(res.data.total);
        }

        const normalized: Patient[] = data.map((p: any) => ({
          id: p.id ?? p._id,
          name: p.name,
          email: p.email,
          phone: p.phone,
          // Mapeie outros campos aqui se o backend os retornar (ex: createdAt)
        }));

        setPatients(normalized);

        // Se o backend não enviou totalPages explicitamente, usamos a lógica de fallback
        if (res.data.totalPages === undefined && total !== undefined) {
             const totalCountValue = total ?? normalized.length + skip;
             setTotalCount(totalCountValue);
             setTotalPages(Math.max(1, Math.ceil(totalCountValue / limit)));
        }
        
      } catch (err: any) {
        if (!controller.signal.aborted) {
          console.error("Erro ao buscar pacientes:", err);
          // Melhor tratamento de erro para exibir ao usuário
          const errorMsg = err.response?.data?.error || "Erro ao buscar pacientes";
          setError(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      try {
        controller.abort();
      } catch {}
    };
  }, [search, page, limit]);

  // CRUD
  const createPatient = async (payload: Partial<Patient>) => {
    // *** MUDANÇA 2: Removendo o cabeçalho de autenticação ***
    const res = await api.post("/patients", payload);
    const p = res.data;
    const normalized = {
      id: p.id ?? p._id,
      name: p.name,
      email: p.email,
      phone: p.phone,
    };

    setPatients((prev) => [normalized, ...prev]);
    return normalized;
  };

  const updatePatient = async (id: string, payload: Partial<Patient>) => {
    // *** MUDANÇA 3: Removendo o cabeçalho de autenticação ***
    const res = await api.put(`/patients/${id}`, payload);
    const p = res.data;
    const normalized = {
      id: p.id ?? p._id,
      name: p.name,
      email: p.email,
      phone: p.phone,
    };

    setPatients((prev) =>
      prev.map((x) => (x.id === id ? normalized : x))
    );
    return normalized;
  };

  const deletePatient = async (id: string) => {
    // *** MUDANÇA 4: Removendo o cabeçalho de autenticação ***
    await api.delete(`/patients/${id}`);
    setPatients((prev) => prev.filter((x) => x.id !== id));
  };

  return {
    patients,
    loading,
    error,
    totalPages,
    totalCount,
    createPatient,
    updatePatient,
    deletePatient,
  };
}

export default usePatients;