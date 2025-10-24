// ==============================================
// src/app/(dashboard)/budgets/[id]/page.tsx
// ==============================================

'use client';

import { useParams } from 'next/navigation';
import { useBudget } from '@/hooks/use-budgets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Printer, User, Calendar, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils';

export default function BudgetDetailsPage() {
  const params = useParams();
  const budgetId = params.id as string;
  const { budget, isLoading } = useBudget(budgetId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Orçamento não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/budgets">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orçamento {budget.budgetNumber}</h1>
            <p className="text-gray-500 mt-1">{budget.patient?.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Badge className={getStatusColor(budget.status)} className="text-lg px-4 py-2">
            {getStatusLabel(budget.status, 'budget')}
          </Badge>
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
                <p className="text-sm text-gray-500">Paciente</p>
                <p className="font-medium">{budget.patient?.name}</p>
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
                <p className="font-medium">
                  {budget.dentist?.name ? `Dr. ${budget.dentist.name}` : 'Não atribuído'}
                </p>
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
                <p className="text-sm text-gray-500">Criado em</p>
                <p className="font-medium">{formatDate(budget.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-2">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Válido até</p>
                <p className="font-medium">
                  {budget.validUntil ? formatDate(budget.validUntil) : 'Sem validade'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Itens do Orçamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Procedimento</TableHead>
                <TableHead className="text-center">Dente</TableHead>
                <TableHead className="text-center">Qtd</TableHead>
                <TableHead className="text-right">Valor Unit.</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budget.items?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.description}</p>
                      {item.procedure && (
                        <p className="text-sm text-gray-500">{item.procedure.name}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.toothNumber || '-'}
                  </TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.totalPrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Separator className="my-6" />

          {/* Totals */}
          <div className="space-y-3">
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(budget.totalAmount)}</span>
            </div>
            {budget.discountAmount > 0 && (
              <div className="flex justify-between text-lg text-green-600">
                <span>Desconto:</span>
                <span className="font-medium">- {formatCurrency(budget.discountAmount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-2xl">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-blue-600">
                {formatCurrency(budget.finalAmount)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {budget.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{budget.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {budget.status === 'draft' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Button>Enviar para Paciente</Button>
              <Button variant="outline">Aprovar Orçamento</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}