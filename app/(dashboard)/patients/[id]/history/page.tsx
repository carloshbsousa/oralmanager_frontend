// ==============================================
// src/app/(dashboard)/patients/[id]/history/page.tsx
// ==============================================

'use client';

import { useParams } from 'next/navigation';
import { usePatient } from '@/hooks/use-patients';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  DollarSign,
  Clock,
  User,
  Stethoscope,
  Receipt,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils';

export default function PatientHistoryPage() {
  const params = useParams();
  const patientId = params.id as string;
  const { clinic } = useAuth();
  const { patient, isLoading: loadingPatient } = usePatient(patientId);

  // Buscar histórico completo
  const { data: history, isLoading } = useSWR(
    clinic && patientId ? `/clinics/${clinic.id}/patients/${patientId}/history` : null,
    async (url) => {
      const response = await api.get(url);
      return response.data.data;
    }
  );

  if (loadingPatient || isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Paciente não encontrado</p>
      </div>
    );
  }

  const clinicalRecords = history?.clinicalRecords || [];
  const recentAppointments = history?.recentAppointments || [];
  const budgets = history?.budgets || [];

  // Calcular estatísticas
  const totalAppointments = recentAppointments.length;
  const completedAppointments = recentAppointments.filter((a: any) => a.status === 'completed').length;
  const totalBudgets = budgets.reduce((sum: number, b: any) => sum + Number(b.finalAmount), 0);
  const approvedBudgets = budgets.filter((b: any) => b.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/patients/${patientId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Histórico Completo</h1>
          <p className="text-gray-500 mt-1">{patient.name}</p>
        </div>
      </div>

      {/* Estatísticas Resumidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Consultas</p>
                <p className="text-2xl font-bold">{totalAppointments}</p>
                <p className="text-xs text-gray-500">
                  {completedAppointments} concluídas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Prontuários</p>
                <p className="text-2xl font-bold">{clinicalRecords.length}</p>
                <p className="text-xs text-gray-500">registros</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-2">
                <Receipt className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Orçamentos</p>
                <p className="text-2xl font-bold">{budgets.length}</p>
                <p className="text-xs text-gray-500">
                  {approvedBudgets} aprovados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Valor Total</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBudgets)}</p>
                <p className="text-xs text-gray-500">em orçamentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com Histórico */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
          <TabsTrigger value="clinical">Prontuários</TabsTrigger>
          <TabsTrigger value="appointments">Consultas</TabsTrigger>
          <TabsTrigger value="budgets">Orçamentos</TabsTrigger>
        </TabsList>

        {/* Linha do Tempo */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Linha do Tempo Completa</CardTitle>
            </CardHeader>
            <CardContent>
              {clinicalRecords.length === 0 && recentAppointments.length === 0 && budgets.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Nenhum registro encontrado</p>
                </div>
              ) : (
                <div className="relative space-y-6">
                  {/* Linha vertical */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

                  {/* Eventos mesclados e ordenados por data */}
                  {[
                    ...clinicalRecords.map((r: any) => ({ ...r, type: 'clinical', date: r.recordDate })),
                    ...recentAppointments.map((a: any) => ({ ...a, type: 'appointment', date: a.appointmentDate })),
                    ...budgets.map((b: any) => ({ ...b, type: 'budget', date: b.createdAt }))
                  ]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 20)
                    .map((event: any, index) => (
                      <div key={`${event.type}-${event.id}`} className="relative flex gap-4 pl-0">
                        {/* Ícone do evento */}
                        <div className={`
                          relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white
                          ${event.type === 'clinical' ? 'bg-green-100' : ''}
                          ${event.type === 'appointment' ? 'bg-blue-100' : ''}
                          ${event.type === 'budget' ? 'bg-purple-100' : ''}
                        `}>
                          {event.type === 'clinical' && <FileText className="h-6 w-6 text-green-600" />}
                          {event.type === 'appointment' && <Calendar className="h-6 w-6 text-blue-600" />}
                          {event.type === 'budget' && <Receipt className="h-6 w-6 text-purple-600" />}
                        </div>

                        {/* Conteúdo do evento */}
                        <div className="flex-1 pb-6">
                          <Card>
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold">
                                    {event.type === 'clinical' && 'Prontuário Clínico'}
                                    {event.type === 'appointment' && 'Consulta'}
                                    {event.type === 'budget' && 'Orçamento'}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {formatDate(event.date)}
                                  </p>
                                </div>
                                {event.type === 'appointment' && (
                                  <Badge className={getStatusColor(event.status)}>
                                    {getStatusLabel(event.status, 'appointment')}
                                  </Badge>
                                )}
                                {event.type === 'budget' && (
                                  <Badge className={getStatusColor(event.status)}>
                                    {getStatusLabel(event.status, 'budget')}
                                  </Badge>
                                )}
                              </div>

                              {/* Detalhes específicos */}
                              {event.type === 'clinical' && (
                                <div className="space-y-2 text-sm">
                                  {event.diagnosis && (
                                    <p className="text-gray-600">
                                      <span className="font-medium">Diagnóstico:</span> {event.diagnosis}
                                    </p>
                                  )}
                                  {event.dentist && (
                                    <p className="text-gray-500 flex items-center gap-1">
                                      <Stethoscope className="h-3 w-3" />
                                      Dr. {event.dentist.name}
                                    </p>
                                  )}
                                  <Link href={`/clinical-records/${event.id}`}>
                                    <Button variant="link" size="sm" className="h-auto p-0">
                                      Ver prontuário completo →
                                    </Button>
                                  </Link>
                                </div>
                              )}

                              {event.type === 'appointment' && (
                                <div className="space-y-2 text-sm">
                                  <p className="text-gray-600 flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    {event.startTime?.slice(0, 5)} - {event.endTime?.slice(0, 5)}
                                  </p>
                                  {event.dentist && (
                                    <p className="text-gray-600 flex items-center gap-2">
                                      <User className="h-3 w-3" />
                                      Dr. {event.dentist.name}
                                    </p>
                                  )}
                                  {event.procedure && (
                                    <p className="text-gray-500">
                                      Procedimento: {event.procedure.name}
                                    </p>
                                  )}
                                </div>
                              )}

                              {event.type === 'budget' && (
                                <div className="space-y-2 text-sm">
                                  <p className="text-gray-600">
                                    <span className="font-medium">Número:</span> {event.budgetNumber}
                                  </p>
                                  <p className="text-gray-600">
                                    <span className="font-medium">Valor:</span> {formatCurrency(event.finalAmount)}
                                  </p>
                                  {event.items && (
                                    <p className="text-gray-500">
                                      {event.items.length} item(ns)
                                    </p>
                                  )}
                                  <Link href={`/budgets/${event.id}`}>
                                    <Button variant="link" size="sm" className="h-auto p-0">
                                      Ver orçamento completo →
                                    </Button>
                                  </Link>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prontuários */}
        <TabsContent value="clinical">
          <Card>
            <CardHeader>
              <CardTitle>Prontuários Clínicos ({clinicalRecords.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {clinicalRecords.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Nenhum prontuário registrado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {clinicalRecords.map((record: any) => (
                    <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{formatDate(record.recordDate)}</p>
                          <p className="text-sm text-gray-600">Dr. {record.dentist?.name}</p>
                        </div>
                        <Link href={`/clinical-records/${record.id}`}>
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                        </Link>
                      </div>
                      {record.diagnosis && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Diagnóstico:</span> {record.diagnosis}
                        </p>
                      )}
                      {record.proceduresPerformed && (
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">Procedimentos:</span> {record.proceduresPerformed}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consultas */}
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Consultas ({recentAppointments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {recentAppointments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Nenhuma consulta registrada</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentAppointments.map((appointment: any) => (
                    <div key={appointment.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{formatDate(appointment.appointmentDate)}</p>
                            <Badge className={getStatusColor(appointment.status)}>
                              {getStatusLabel(appointment.status, 'appointment')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {appointment.startTime?.slice(0, 5)} - {appointment.endTime?.slice(0, 5)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Dr. {appointment.dentist?.name}
                          </p>
                          {appointment.procedure && (
                            <p className="text-sm text-gray-500 mt-1">
                              {appointment.procedure.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orçamentos */}
        <TabsContent value="budgets">
          <Card>
            <CardHeader>
              <CardTitle>Orçamentos ({budgets.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {budgets.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Nenhum orçamento criado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {budgets.map((budget: any) => (
                    <div key={budget.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{budget.budgetNumber}</p>
                            <Badge className={getStatusColor(budget.status)}>
                              {getStatusLabel(budget.status, 'budget')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {formatDate(budget.createdAt)}
                          </p>
                          {budget.dentist && (
                            <p className="text-sm text-gray-600">
                              Dr. {budget.dentist.name}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">
                            {formatCurrency(budget.finalAmount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {budget.items?.length || 0} item(ns)
                          </p>
                        </div>
                      </div>
                      <Link href={`/budgets/${budget.id}`}>
                        <Button variant="link" size="sm" className="h-auto p-0 mt-2">
                          Ver detalhes →
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}