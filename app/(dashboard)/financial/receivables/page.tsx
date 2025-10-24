'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { DatePicker } from '@/components/shared/date-picker';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Plus, Search, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Receivable {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  paymentDate: string | null;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  patient: {
    id: string;
    name: string;
  };
  budget?: {
    id: string;
    budgetNumber: string;
  };
}

interface ReceivablesData {
  receivables: Receivable[];
  totals: {
    pending: number;
    paid: number;
    overdue: number;
  };
}

export default function ReceivablesPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReceivablesData | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedReceivable, setSelectedReceivable] = useState<Receivable | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [statusFilter, startDate, endDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (startDate) {
        params.append('startDate', startDate.toISOString().split('T')[0]);
      }
      if (endDate) {
        params.append('endDate', endDate.toISOString().split('T')[0]);
      }

      const response = await api.get(`/receivables?${params}`);
      setData(response);
    } catch (error) {
      console.error('Failed to load receivables:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as contas a receber',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (receivableId: string) => {
    try {
      await api.patch(`/receivables/${receivableId}/mark-as-paid`);
      toast({
        title: 'Sucesso',
        description: 'Pagamento registrado com sucesso',
      });
      loadData();
      setShowPaymentDialog(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível registrar o pagamento',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: any }> = {
      pending: { label: 'Pendente', variant: 'outline' },
      paid: { label: 'Pago', variant: 'default' },
      overdue: { label: 'Atrasado', variant: 'destructive' },
      partial: { label: 'Parcial', variant: 'secondary' },
    };

    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredReceivables = data?.receivables.filter((r) =>
    r.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contas a Receber</h1>
          <p className="text-muted-foreground">
            Gerencie pagamentos e recebimentos
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Conta
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(data?.totals.pending || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recebido</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(data?.totals.paid || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atrasado</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(data?.totals.overdue || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por paciente ou número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="overdue">Atrasado</SelectItem>
                <SelectItem value="partial">Parcial</SelectItem>
              </SelectContent>
            </Select>

            <DatePicker
              date={startDate}
              onSelect={setStartDate}
              placeholder="Data inicial"
            />

            <DatePicker
              date={endDate}
              onSelect={setEndDate}
              placeholder="Data final"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Pago</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReceivables.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    Nenhuma conta a receber encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredReceivables.map((receivable) => (
                  <TableRow key={receivable.id}>
                    <TableCell className="font-mono text-sm">
                      {receivable.invoiceNumber}
                    </TableCell>
                    <TableCell>{receivable.patient.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {receivable.description}
                    </TableCell>
                    <TableCell>{formatDate(receivable.dueDate)}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(receivable.amount)}
                    </TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      {formatCurrency(receivable.paidAmount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(receivable.status)}</TableCell>
                    <TableCell className="text-right">
                      {receivable.status !== 'paid' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedReceivable(receivable);
                            setShowPaymentDialog(true);
                          }}
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Registrar Pagamento
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
          </DialogHeader>
          {selectedReceivable && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Paciente</p>
                <p className="font-semibold">{selectedReceivable.patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(selectedReceivable.amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Restante</p>
                <p className="text-xl font-semibold text-orange-600">
                  {formatCurrency(selectedReceivable.amount - selectedReceivable.paidAmount)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => handleMarkAsPaid(selectedReceivable.id)}
                >
                  Confirmar Pagamento Total
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentDialog(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}