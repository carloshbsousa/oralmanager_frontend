'use client';

import { usePatient } from '@/hooks/use-patients';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  FileText, 
  Wallet,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatDate, formatPhone, formatCPF, calculateAge } from '@/lib/utils';

export default function PatientDetailsPage() {
  const params = useParams();
  const patientId = params.id as string;
  const { patient, isLoading } = usePatient(patientId);

  if (isLoading) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/patients">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-gray-500 mt-1">
              {calculateAge(patient.birthDate)} anos • {patient.patientNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/patients/${patient.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Link href={`/appointments/new?patientId=${patient.id}`}>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Agendar Consulta
            </Button>
          </Link>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">CPF</p>
                <p className="font-medium">{patient.cpf ? formatCPF(patient.cpf) : 'Não informado'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefone</p>
                <p className="font-medium">
                  {patient.mobile ? formatPhone(patient.mobile) : 'Não informado'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-2">
                <Mail className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-sm">{patient.email || 'Não informado'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-2">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cadastro</p>
                <p className="font-medium">{formatDate(patient.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="odontogram">Odontograma</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
        </TabsList>

        {/* Informações Gerais */}
        <TabsContent value="info" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Data de Nascimento</p>
                  <p className="font-medium">{formatDate(patient.birthDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gênero</p>
                  <p className="font-medium capitalize">{patient.gender || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ocupação</p>
                  <p className="font-medium">{patient.occupation || 'Não informado'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.address ? (
                  <div className="space-y-1">
                    <p className="font-medium">{patient.address}</p>
                    <p className="text-sm text-gray-600">
                      {patient.city}, {patient.state} - {patient.postalCode}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">Endereço não informado</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contato de Emergência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nome</p>
                  <p className="font-medium">{patient.emergencyContactName || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-medium">
                    {patient.emergencyContactPhone 
                      ? formatPhone(patient.emergencyContactPhone)
                      : 'Não informado'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {patient.notes || 'Nenhuma observação registrada'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Histórico */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico Clínico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Nenhum registro clínico encontrado</p>
                <Link href={`/clinical-records/new?patientId=${patient.id}`}>
                  <Button variant="link" className="mt-2">
                    Criar primeiro prontuário
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Odontograma */}
        <TabsContent value="odontogram">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Odontograma</CardTitle>
                <Link href={`/patients/${patient.id}/odontogram`}>
                  <Button variant="outline" size="sm">
                    Ver Completo
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Odontograma não preenchido</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financeiro */}
        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Total em Orçamentos</p>
                  <p className="text-2xl font-bold">R$ 0,00</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Valor Pago</p>
                  <p className="text-2xl font-bold text-green-600">R$ 0,00</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Pendente</p>
                  <p className="text-2xl font-bold text-orange-600">R$ 0,00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}