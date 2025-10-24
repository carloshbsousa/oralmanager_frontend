// ==============================================
// src/app/(dashboard)/appointments/page.tsx
// ==============================================

'use client';

import { useState } from 'react';
import { useAppointments } from '@/hooks/use-appointments';
import { useDentists } from '@/hooks/use-dentists';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Plus, Clock, User, Search } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getStatusColor, getStatusLabel, formatDate } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDentist, setSelectedDentist] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  
  const { appointments, isLoading } = useAppointments({
    date: format(selectedDate, 'yyyy-MM-dd'),
    dentistId: selectedDentist || undefined,
    status: selectedStatus || undefined,
  });
  
  const { dentists } = useDentists();

  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'scheduled', label: 'Agendado' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'in_progress', label: 'Em Andamento' },
    { value: 'completed', label: 'Concluído' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-500 mt-1">Gerencie a agenda da clínica</p>
        </div>
        <div className="flex gap-2">
          <Link href="/appointments/calendar">
            <Button variant="outline">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendário
            </Button>
          </Link>
          <Link href="/appointments/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, 'PPP', { locale: ptBR })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Dentist Filter */}
            <Select value={selectedDentist} onValueChange={setSelectedDentist}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os dentistas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os dentistas</SelectItem>
                {dentists.map((dentist) => (
                  <SelectItem key={dentist.id} value={dentist.id}>
                    Dr. {dentist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSelectedDate(new Date());
              setSelectedDentist('');
              setSelectedStatus('');
            }}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {appointments.length} agendamento(s) para {format(selectedDate, 'dd/MM/yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-4">Nenhum agendamento encontrado</p>
              <Link href="/appointments/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Agendamento
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <div className="text-2xl font-bold">
                        {appointment.startTime.slice(0, 5)}
                      </div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
         </CardContent>
        </Card>
        </div>
        );
      }