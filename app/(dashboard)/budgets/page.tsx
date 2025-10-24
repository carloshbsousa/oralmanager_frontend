'use client';

import { useState } from 'react';
import { useBudgets } from '@/hooks/use-budgets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Eye, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils';

export default function BudgetsPage() {
  const [status, setStatus] = useState('');
  const { budgets, isLoading } = useBudgets(undefined, status || undefined);

  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'draft', label: 'Rascunho' },
    { value: 'sent', label: 'Enviado' },
    { value: 'approved', label: 'Aprovado' },
    { value: 'rejected', label: 'Rejeitado' },
    { value: 'expired', label: 'Expirado' },
  ];

  // Calcular totais
  const totalValue = budgets.reduce((sum, b) => sum + Number(b.finalAmount), 0);
  const approvedValue = budgets
    .filter(b => b.status === 'approved')
    .reduce((sum, b) => sum + Number(b.finalAmount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orçamentos</h1>
          <p className="text-gray-500 mt-1">Gerencie os orçamentos da clínica</p>
        </div>
        <Link href="/budgets/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Orçamento
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total em Orçamentos</p>
                <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Aprovados</p>
                <p className="text-2xl font-bold">{formatCurrency(approvedValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Quantidade</p>
                <p className="text-2xl font-bold">{budgets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Buscar orçamentos..." className="pl-10" />
            </div>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Budgets List */}
      <Card>
        <CardHeader>
          <CardTitle>{budgets.length} orçamento(s) encontrado(s)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="mb-4">Nenhum orçamento encontrado</p>
              <Link href="/budgets/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Orçamento
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {budgets.map((budget) => (
                <div
                  key={budget.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{budget.budgetNumber}</p>
                      <Badge className={getStatusColor(budget.status)}>
                        {getStatusLabel(budget.status, 'budget')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{budget.patient?.name}</p>
                    {budget.dentist && (
                      <p className="text-sm text-gray-500">Dr. {budget.dentist.name}</p>
                    )}
                    <p className="text-sm text-gray-500">{formatDate(budget.createdAt)}</p>
                  </div>

                  <div className="text-right mr-4">
                    <p className="text-2xl font-bold">{formatCurrency(budget.finalAmount)}</p>
                    <p className="text-sm text-gray-500">
                      {budget.items?.length || 0} item(ns)
                    </p>
                  </div>

                  <Link href={`/budgets/${budget.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}