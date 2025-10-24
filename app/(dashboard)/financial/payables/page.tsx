'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { DatePicker } from '@/components/shared/date-picker';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Plus, Search, AlertTriangle, CheckCircle2, Edit, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Payable {
  id: string;
  category: string;
  supplierName: string | null;
  description: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  paymentDate: string | null;
  paymentMethod: string | null;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  notes: string | null;
}

const CATEGORIES = [
  'Materiais',
  'Equipamentos',
  'Salários',
  'Impostos',
  'Aluguel',
  'Água/Luz',
  'Internet',
  'Marketing',
  'Manutenção',
  'Outros',
];

const PAYMENT_METHODS = [
  'Dinheiro',
  'Cartão de Débito',
  'Cartão de Crédito',
  'PIX',
  'Transferência Bancária',
  'Boleto',
];

export default function PayablesPage() {
  const [loading, setLoading] = useState(true);
  const [payables, setPayables] = useState<Payable[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingPayable, setEditingPayable] = useState<Payable | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    category: '',
    supplierName: '',
    description: '',
    dueDate: '',
    amount: '',
    paymentMethod: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, [statusFilter, categoryFilter, startDate, endDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }
      if (startDate) {
        params.append('startDate', startDate.toISOString().split('T')[0]);
      }
      if (endDate) {
        params.append('endDate', endDate.toISOString().split('T')[0]);
      }

      const response = await api.get(`/payables?${params}`);
      setPayables(response.payables || response);
    } catch (error) {
      console.error('Failed to load payables:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as contas a pagar',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPayable) {
        await api.patch(`/payables/${editingPayable.id}`, formData);
        toast({
          title: 'Sucesso',
          description: 'Conta atualizada com sucesso',
        });
      } else {
        await api.post('/payables', formData);
        toast({
          title: 'Sucesso',
          description: 'Conta criada com sucesso',
        });
      }
      setShowDialog(false);
      resetForm();
      loadData();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a conta',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAsPaid = async (payableId: string) => {
    try {
      await api.patch(`/payables/${payableId}/mark-as-paid`);
      toast({
        title: 'Sucesso',
        description: 'Pagamento registrado com sucesso',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível registrar o pagamento',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (payableId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta conta?')) return;
    
    try {
      await api.delete(`/payables/${payableId}`);
      toast({
        title: 'Sucesso',
        description: 'Conta excluída com sucesso',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a conta',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (payable: Payable) => {
    setEditingPayable(payable);
    setFormData({
      category: payable.category,
      supplierName: payable.supplierName || '',
      description: payable.description,
      dueDate: payable.dueDate.split('T')[0],
      amount: payable.amount.toString(),
      paymentMethod: payable.paymentMethod || '',
      notes: payable.notes || '',
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setEditingPayable(null);
    setFormData({
      category: '',
      supplierName: '',
      description: '',
      dueDate: '',
      amount: '',
      paymentMethod: '',
      notes: '',
    });
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

  const filteredPayables = payables.filter((p) =>
    (p.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totals = payables.reduce((acc, p) => {
    if (p.status === 'paid') {
      acc.paid += p.paidAmount;
    } else if (p.status === 'overdue') {
      acc.overdue += (p.amount - p.paidAmount);
    } else {
      acc.pending += (p.amount - p.paidAmount);
    }
    return acc;
  }, { pending: 0, paid: 0, overdue: 0 });

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
          <h1 className="text-3xl font-bold">Contas a Pagar</h1>
          <p className="text-muted-foreground">
            Gerencie despesas e pagamentos
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={(open) => {
          setShowDialog(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Despesa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPayable ? 'Editar Despesa' : 'Nova Despesa'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplierName">Fornecedor</Label>
                  <Input
                    id="supplierName"
                    value={formData.supplierName}
                    onChange={(e) =>
                      setFormData({ ...formData, supplierName: e.target.value })
                    }
                    placeholder="Nome do fornecedor"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descreva a despesa"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Data de Vencimento *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Valor *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentMethod: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Informações adicionais"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingPayable ? 'Atualizar' : 'Criar'} Despesa
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(totals.pending)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pago</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totals.paid)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atrasado</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totals.overdue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
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
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
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
                <TableHead>Categoria</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayables.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Nenhuma conta a pagar encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayables.map((payable) => (
                  <TableRow key={payable.id}>
                    <TableCell>
                      <Badge variant="outline">{payable.category}</Badge>
                    </TableCell>
                    <TableCell>{payable.supplierName || '-'}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {payable.description}
                    </TableCell>
                    <TableCell>{formatDate(payable.dueDate)}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(payable.amount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(payable.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {payable.status !== 'paid' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsPaid(payable.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(payable)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(payable.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}