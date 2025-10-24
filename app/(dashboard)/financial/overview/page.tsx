'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/formatters';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { ChartRevenue } from '@/components/reports/chart-revenue';

interface FinancialStats {
  revenue: {
    total: number;
    received: number;
    pending: number;
  };
  expenses: {
    total: number;
    paid: number;
    pending: number;
  };
  profit: number;
  profitMargin: string;
}

interface OverviewData {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: FinancialStats;
  receivables: {
    total: number;
    byStatus: {
      pending: number;
      paid: number;
      overdue: number;
      partial: number;
    };
  };
  payables: {
    total: number;
  };
  charts: {
    revenueByPeriod: Record<string, number>;
    expensesByPeriod: Record<string, number>;
  };
}

export default function FinancialOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<OverviewData | null>(null);
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();

      if (period === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else if (period === 'quarter') {
        startDate.setMonth(startDate.getMonth() - 3);
      } else {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }

      const params = new URLSearchParams({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        period: 'day',
      });

      const response = await api.get(`/reports/financial?${params}`);
      setData(response);
    } catch (error) {
      console.error('Failed to load financial overview:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Erro ao carregar dados financeiros</p>
      </div>
    );
  }

  const { summary, receivables, payables, charts } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Visão Geral Financeira</h1>
          <p className="text-muted-foreground">
            Acompanhe receitas, despesas e lucratividade
          </p>
        </div>

        <Tabs value={period} onValueChange={(v) => setPeriod(v as any)}>
          <TabsList>
            <TabsTrigger value="month">Mês</TabsTrigger>
            <TabsTrigger value="quarter">Trimestre</TabsTrigger>
            <TabsTrigger value="year">Ano</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas Recebidas</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.revenue.received)}
            </div>
            <p className="text-xs text-muted-foreground">
              de {formatCurrency(summary.revenue.total)} esperado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas Pagas</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.expenses.paid)}
            </div>
            <p className="text-xs text-muted-foreground">
              de {formatCurrency(summary.expenses.total)} previsto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(summary.profit)}
            </div>
            <p className="text-xs text-muted-foreground">
              Margem: {summary.profitMargin}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Receber Pendente</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(summary.revenue.pending)}
            </div>
            <p className="text-xs text-muted-foreground">
              {receivables.byStatus.overdue} em atraso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Receitas x Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartRevenue
              revenueData={charts.revenueByPeriod}
              expensesData={charts.expensesByPeriod}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status de Recebíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm">Pagos</span>
                </div>
                <span className="font-semibold">{receivables.byStatus.paid}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">Pendentes</span>
                </div>
                <span className="font-semibold">{receivables.byStatus.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm">Em Atraso</span>
                </div>
                <span className="font-semibold">{receivables.byStatus.overdue}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Parcial</span>
                </div>
                <span className="font-semibold">{receivables.byStatus.partial}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contas a Receber</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total:</span>
              <span className="font-semibold">{receivables.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Valor Total:</span>
              <span className="font-semibold">{formatCurrency(summary.revenue.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Recebido:</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(summary.revenue.received)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contas a Pagar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total:</span>
              <span className="font-semibold">{payables.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Valor Total:</span>
              <span className="font-semibold">{formatCurrency(summary.expenses.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Pago:</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(summary.expenses.paid)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Lucro:</span>
              <span className={`font-semibold ${summary.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summary.profit)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Margem:</span>
              <span className="font-semibold">{summary.profitMargin}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Taxa de Recebimento:</span>
              <span className="font-semibold">
                {summary.revenue.total > 0
                  ? ((summary.revenue.received / summary.revenue.total) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}