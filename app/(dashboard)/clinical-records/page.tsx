'use client';

import { useState } from 'react';
import { useClinicalRecords } from '@/hooks/use-clinical-records';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, FileText, Eye } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function ClinicalRecordsPage() {
  const [page, setPage] = useState(1);
  const { records, pagination, isLoading } = useClinicalRecords({ page, limit: 10 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prontuários</h1>
          <p className="text-gray-500 mt-1">Registros clínicos dos pacientes</p>
        </div>
        <Link href="/clinical-records/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Prontuário
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar prontuários..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {pagination?.total || 0} prontuário(s) encontrado(s)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-4">Nenhum prontuário encontrado</p>
              <Link href="/clinical-records/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Prontuário
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{record.patient?.name}</p>
                      <span className="text-sm text-gray-500">•</span>
                      <p className="text-sm text-gray-600">Dr. {record.dentist?.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDate(record.recordDate)}
                    </p>
                    {record.diagnosis && (
                      <p className="text-sm text-gray-600 mt-1">
                        Diagnóstico: {record.diagnosis}
                      </p>
                    )}
                  </div>
                  <Link href={`/clinical-records/${record.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Página {pagination.page} de {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}