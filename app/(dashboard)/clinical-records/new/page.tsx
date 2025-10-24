'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCreateClinicalRecord } from '@/hooks/use-clinical-records';
import { usePatients } from '@/hooks/use-patients';
import { useDentists } from '@/hooks/use-dentists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function NewClinicalRecordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createRecord } = useCreateClinicalRecord();
  const { patients } = usePatients();
  const { dentists } = useDentists();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: searchParams.get('patientId') || '',
    dentistId: '',
    appointmentId: searchParams.get('appointmentId') || '',
    recordDate: format(new Date(), 'yyyy-MM-dd'),
    chiefComplaint: '',
    clinicalExamination: '',
    diagnosis: '',
    treatmentPlan: '',
    proceduresPerformed: '',
    prescriptions: '',
    observations: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createRecord(formData);
      toast.success('Prontuário criado com sucesso!');
      router.push('/clinical-records');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao criar prontuário');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/clinical-records">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Novo Prontuário</h1>
          <p className="text-gray-500 mt-1">Registrar atendimento clínico</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Básicos */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Atendimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Paciente *</Label>
                <Select
                  value={formData.patientId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, patientId: value }))}
                  disabled={isLoading || !!searchParams.get('patientId')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Dentista *</Label>
                <Select
                  value={formData.dentistId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, dentistId: value }))}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o dentista" />
                  </SelectTrigger>
                  <SelectContent>
                    {dentists.map((dentist) => (
                      <SelectItem key={dentist.id} value={dentist.id}>
                        Dr. {dentist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recordDate">Data do Atendimento *</Label>
                <Input
                  id="recordDate"
                  type="date"
                  value={formData.recordDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, recordDate: e.target.value }))}
                  required
                  disabled={isLoading}
                  max={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Queixa e Exame */}
        <Card>
          <CardHeader>
            <CardTitle>Anamnese e Exame Clínico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chiefComplaint">Queixa Principal</Label>
              <Textarea
                id="chiefComplaint"
                rows={2}
                placeholder="Descreva a queixa principal do paciente..."
                value={formData.chiefComplaint}
                onChange={(e) => setFormData(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinicalExamination">Exame Clínico</Label>
              <Textarea
                id="clinicalExamination"
                rows={3}
                placeholder="Registre os achados do exame clínico..."
                value={formData.clinicalExamination}
                onChange={(e) => setFormData(prev => ({ ...prev, clinicalExamination: e.target.value }))}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Diagnóstico e Tratamento */}
        <Card>
          <CardHeader>
            <CardTitle>Diagnóstico e Plano de Tratamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnóstico</Label>
              <Textarea
                id="diagnosis"
                rows={2}
                placeholder="Diagnóstico baseado no exame clínico..."
                value={formData.diagnosis}
                onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatmentPlan">Plano de Tratamento</Label>
              <Textarea
                id="treatmentPlan"
                rows={3}
                placeholder="Descreva o plano de tratamento proposto..."
                value={formData.treatmentPlan}
                onChange={(e) => setFormData(prev => ({ ...prev, treatmentPlan: e.target.value }))}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proceduresPerformed">Procedimentos Realizados</Label>
              <Textarea
                id="proceduresPerformed"
                rows={3}
                placeholder="Liste os procedimentos realizados nesta consulta..."
                value={formData.proceduresPerformed}
                onChange={(e) => setFormData(prev => ({ ...prev, proceduresPerformed: e.target.value }))}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Prescrições e Observações */}
        <Card>
          <CardHeader>
            <CardTitle>Prescrições e Observações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prescriptions">Prescrições</Label>
              <Textarea
                id="prescriptions"
                rows={3}
                placeholder="Medicamentos prescritos, dosagem e instruções..."
                value={formData.prescriptions}
                onChange={(e) => setFormData(prev => ({ ...prev, prescriptions: e.target.value }))}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observações Gerais</Label>
              <Textarea
                id="observations"
                rows={3}
                placeholder="Observações adicionais sobre o atendimento..."
                value={formData.observations}
                onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/clinical-records">
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading || !formData.patientId || !formData.dentistId}>
            {isLoading ? 'Salvando...' : 'Salvar Prontuário'}
          </Button>
        </div>
      </form>
    </div>
  );
}