'use client';

import { useParams } from 'next/navigation';
import { useClinicalRecord } from '@/hooks/use-clinical-records';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Printer, FileText, User, Calendar } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function ClinicalRecordDetailsPage() {
  const params = useParams();
  const recordId = params.id as string;
  const { record, isLoading } = useClinicalRecord(recordId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Prontuário não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/clinical-records">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prontuário Clínico</h1>
            <p className="text-gray-500 mt-1">
              {record.patient?.name} - {formatDate(record.recordDate)}
            </p>
          </div>
        </div>
        <Button variant="outline">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Paciente</p>
                <p className="font-medium">{record.patient?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Dentista</p>
                <p className="font-medium">Dr. {record.dentist?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-2">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Data</p>
                <p className="font-medium">{formatDate(record.recordDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prontuário Content */}
      <div className="grid gap-6">
        {/* Queixa Principal */}
        {record.chiefComplaint && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Queixa Principal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{record.chiefComplaint}</p>
            </CardContent>
          </Card>
        )}

        {/* Exame Clínico */}
        {record.clinicalExamination && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Exame Clínico</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{record.clinicalExamination}</p>
            </CardContent>
          </Card>
        )}

        {/* Diagnóstico */}
        {record.diagnosis && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Diagnóstico</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{record.diagnosis}</p>
            </CardContent>
          </Card>
        )}

        {/* Plano de Tratamento */}
        {record.treatmentPlan && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Plano de Tratamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{record.treatmentPlan}</p>
            </CardContent>
          </Card>
        )}

        {/* Procedimentos Realizados */}
        {record.proceduresPerformed && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Procedimentos Realizados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{record.proceduresPerformed}</p>
            </CardContent>
          </Card>
        )}

        {/* Prescrições */}
        {record.prescriptions && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prescrições</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{record.prescriptions}</p>
            </CardContent>
          </Card>
        )}

        {/* Observações */}
        {record.observations && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{record.observations}</p>
            </CardContent>
          </Card>
        )}

        {/* Anexos */}
        {record.attachments && Array.isArray(record.attachments) && record.attachments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Anexos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {record.attachments.map((attachment: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-medium">{attachment.name}</p>
                        <p className="text-sm text-gray-500">{attachment.type}</p>
                      </div>
                    </div>
                    {attachment.description && (
                      <p className="text-sm text-gray-600 mt-2">{attachment.description}</p>
                    )}
                    <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="link" size="sm" className="h-auto p-0 mt-2">
                        Visualizar →
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}