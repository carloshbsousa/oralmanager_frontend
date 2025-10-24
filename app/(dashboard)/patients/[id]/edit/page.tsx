'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
// Assumindo que usePatient e useUpdatePatient retornam os dados corretamente
import { usePatient, useUpdatePatient } from '@/hooks/use-patients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar'; // O componente do calendário
import { ArrowLeft, User, Mail, Home, HeartHandshake, FileText, Loader2, CalendarIcon } from 'lucide-react'; // Ícones padronizados
import Link from 'next/link';
import { toast } from 'sonner';
import { GENDERS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ptBR } from 'date-fns/locale'; // Importar o locale ptBR para o calendário

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  const { patient, isLoading: loadingPatient } = usePatient(patientId);
  const { updatePatient } = useUpdatePatient(patientId);
  const [isSubmitting, setIsSubmitting] = useState(false); // Renomeado para clareza
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    birthDate: '',
    gender: '',
    email: '',
    phone: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    occupation: '',
    notes: '',
  });

  useEffect(() => {
    if (patient) {
      // Ajuste: Certifica-se que birthDate é uma string de data válida (YYYY-MM-DD)
      const formattedBirthDate = patient.birthDate
        ? new Date(patient.birthDate).toISOString().split('T')[0]
        : '';

      setFormData({
        name: patient.name || '',
        cpf: patient.cpf || '',
        birthDate: formattedBirthDate, // Aplica a formatação
        gender: patient.gender || '',
        email: patient.email || '',
        phone: patient.phone || '',
        mobile: patient.mobile || '',
        address: patient.address || '',
        city: patient.city || '',
        state: patient.state || '',
        postalCode: patient.postalCode || '',
        emergencyContactName: patient.emergencyContactName || '',
        emergencyContactPhone: patient.emergencyContactPhone || '',
        occupation: patient.occupation || '',
        notes: patient.notes || '',
      });
    }
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Função para lidar com a mudança no Select (Gênero)
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updatePatient(formData);
      toast.success('Paciente atualizado com sucesso!');
      router.push(`/patients/${patientId}`);
    } catch (error: any) {
      // Usando toast.error com descrição mais limpa
      toast.error('Erro ao atualizar paciente', {
        description: error.response?.data?.error || 'Verifique sua conexão ou dados de entrada.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loader completo na primeira carga
  if (loadingPatient) {
    return (
      <div className="flex justify-center py-12">
        {/* Usando Loader2 e text-primary para padronizar com o tema */}
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4">
        <Link href={`/patients/${patientId}`}>
          <Button variant="outline" size="icon" className="text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          {/* Padronizando texto para text-foreground */}
          <h1 className="text-3xl font-bold text-foreground">Editar Paciente</h1>
          <p className="text-muted-foreground mt-1">Atualize os dados de {patient?.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Dados Pessoais */}
        <Card>
          <CardHeader className='flex flex-row items-center space-y-0 justify-between'>
            <CardTitle className="text-lg flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.birthDate && "text-muted-foreground",
                        isSubmitting && "opacity-50 pointer-events-none" // Desativa visualmente quando submetendo
                      )}
                      disabled={isSubmitting}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {/* Exibe a data no formato legível (ex: "1 de Janeiro de 1990") */}
                      {formData.birthDate
                        ? format(new Date(formData.birthDate), "PPP", { locale: ptBR })
                        : <span>Selecione a data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50">
                    <Calendar
                      mode="single"
                      // Converte a string YYYY-MM-DD do estado para um objeto Date para o Calendar
                      selected={formData.birthDate ? new Date(formData.birthDate) : undefined}
                      onSelect={(date) => {
                        // Quando uma data é selecionada, converte para string YYYY-MM-DD (compatível com o backend)
                        const dateString = date ? format(date, 'yyyy-MM-dd') : '';
                        setFormData((prev) => ({ ...prev, birthDate: dateString }));
                      }}
                      locale={ptBR} // Define o idioma para Português do Brasil
                      initialFocus
                      captionLayout="dropdown" // Permite selecionar ano/mês por dropdown
                      fromYear={1900}
                      toYear={new Date().getFullYear()} // Limita a data ao ano atual
                    />
                  </PopoverContent>
                </Popover>

              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gênero</Label>
                <Select
                  value={formData.gender}
                  // Chama a nova função de select
                  onValueChange={(value) => handleSelectChange('gender', value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((gender) => (
                      <SelectItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupation">Ocupação</Label>
                <Input
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card>
          <CardHeader className='flex flex-row items-center space-y-0'>
            <CardTitle className="text-lg flex items-center">
              <Mail className="mr-2 h-5 w-5 text-primary" />
              Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="(00) 0000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Celular</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  placeholder="(00) 00000-0000"
                  value={formData.mobile}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader className='flex flex-row items-center space-y-0'>
            <CardTitle className="text-lg flex items-center">
              <Home className="mr-2 h-5 w-5 text-primary" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  name="state"
                  maxLength={2}
                  placeholder="SP"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">CEP</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  placeholder="00000-000"
                  value={formData.postalCode}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contato de Emergência */}
        <Card>
          <CardHeader className='flex flex-row items-center space-y-0'>
            <CardTitle className="text-lg flex items-center">
              <HeartHandshake className="mr-2 h-5 w-5 text-primary" />
              Contato de Emergência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Nome</Label>
                <Input
                  id="emergencyContactName"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Telefone</Label>
                <Input
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader className='flex flex-row items-center space-y-0'>
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Observações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder="Observações adicionais sobre o paciente..."
              value={formData.notes}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 border-t pt-6">
          <Link href={`/patients/${patientId}`}>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}