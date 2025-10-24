'use client';

import { useState } from 'react';
import { usePatients } from '@/hooks/use-patients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Adicionada CardDescription
import { Plus, Search, Eye, Edit, Trash2, Phone, Mail, Calendar } from 'lucide-react'; // Adicionadas mais icons
import Link from 'next/link';
import { formatDate, formatPhone, calculateAge } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function PatientsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { patients, pagination, isLoading } = usePatients(page, 10, search);

  return (
    <div className="space-y-6">
      {/* Header (Mantido) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-500 mt-1">Gerencie os pacientes da clínica</p>
        </div>
        <Link href="/patients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Paciente
          </Button>
        </Link>
      </div>

      {/* Search (Mantido) */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por nome, CPF ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Grid de Cartões */}
      <Card>
        <CardHeader>
          <CardTitle>
            {pagination?.total || 0} paciente(s) encontrado(s)
          </CardTitle>
          <CardDescription>Clique no paciente para ver o prontuário completo.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum paciente encontrado
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {patients.map((patient) => (
                <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                  <Link href={`/patients/${patient.id}`} className="block">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            {/* Nome e Número do Paciente */}
                            <CardTitle className="text-lg font-bold">
                                {patient.name}
                            </CardTitle>
                            <CardDescription className="text-sm">
                                Nº: {patient.patientNumber}
                            </CardDescription>
                        </div>
                        {/* Avatar do Paciente */}
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-xl">
                                {patient.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="space-y-3">
                            {/* Idade */}
                            <div className="flex items-center text-sm text-gray-600">
                                <Badge variant="secondary" className="mr-2">
                                    {calculateAge(patient.birthDate)} anos
                                </Badge>
                            </div>

                            {/* Telefone */}
                            <div className="flex items-center text-sm">
                                <Phone className="mr-2 h-4 w-4 text-gray-500" />
                                {patient.mobile ? formatPhone(patient.mobile) : 'Não informado'}
                            </div>

                            {/* Email */}
                            <div className="flex items-center text-sm truncate">
                                <Mail className="mr-2 h-4 w-4 text-gray-500" />
                                <span title={patient.email || 'Não informado'}>
                                    {patient.email || 'Não informado'}
                                </span>
                            </div>

                            {/* Data de Cadastro */}
                            <div className="flex items-center text-xs text-gray-500 border-t pt-3 mt-3">
                                <Calendar className="mr-2 h-3.5 w-3.5" />
                                Cadastrado em: {formatDate(patient.createdAt)}
                            </div>
                        </div>
                    </CardContent>
                  </Link>
                  
                  {/* Ações de Edição/Visualização no Rodapé ou como ícones separados */}
                  <div className="flex justify-end p-4 border-t">
                      <Link href={`/patients/${patient.id}/edit`}>
                          <Button variant="ghost" size="icon" title="Editar">
                              <Edit className="h-4 w-4" />
                          </Button>
                      </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination (Mantido) */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
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