'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { usePatient } from '@/hooks/use-patients';
import { useOdontogram, useUpdateOdontogram } from '@/hooks/use-odontogram';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { TOOTH_CONDITIONS } from '@/lib/constants';

export default function OdontogramPage() {
  const params = useParams();
  const patientId = params.id as string;
  const { patient } = usePatient(patientId);
  const { odontogram, isLoading, mutate } = useOdontogram(patientId);
  const { updateOdontogram } = useUpdateOdontogram(patientId);
  
  const [selectedTeeth, setSelectedTeeth] = useState<Map<number, { condition: string; notes: string }>>(new Map());
  const [isUpdating, setIsUpdating] = useState(false);

  // Dentes permanentes
  const upperTeeth = Array.from({ length: 8 }, (_, i) => 11 + i).concat(
    Array.from({ length: 8 }, (_, i) => 21 + i)
  );
  const lowerTeeth = Array.from({ length: 8 }, (_, i) => 31 + i).concat(
    Array.from({ length: 8 }, (_, i) => 41 + i)
  );

  const handleToothClick = (toothNumber: number) => {
    if (selectedTeeth.has(toothNumber)) {
      const newMap = new Map(selectedTeeth);
      newMap.delete(toothNumber);
      setSelectedTeeth(newMap);
    } else {
      const newMap = new Map(selectedTeeth);
      newMap.set(toothNumber, { condition: 'healthy', notes: '' });
      setSelectedTeeth(newMap);
    }
  };

  const handleConditionChange = (toothNumber: number, condition: string) => {
    const newMap = new Map(selectedTeeth);
    const tooth = newMap.get(toothNumber);
    if (tooth) {
      newMap.set(toothNumber, { ...tooth, condition });
      setSelectedTeeth(newMap);
    }
  };

  const getToothCondition = (toothNumber: number) => {
    const conditions = odontogram?.all?.filter((c: any) => c.toothNumber === toothNumber);
    if (conditions && conditions.length > 0) {
      return conditions[0];
    }
    return null;
  };

  const getToothColor = (toothNumber: number) => {
    const condition = getToothCondition(toothNumber);
    if (!condition) return '#e5e7eb'; // gray-200
    
    const conditionConfig = TOOTH_CONDITIONS.find(c => c.value === condition.condition);
    return conditionConfig?.color || '#e5e7eb';
  };

  const handleSave = async () => {
    if (selectedTeeth.size === 0) {
      toast.error('Selecione pelo menos um dente');
      return;
    }

    setIsUpdating(true);
    try {
      const conditions = Array.from(selectedTeeth.entries()).map(([toothNumber, data]) => ({
        toothNumber,
        toothFace: 'all' as const,
        condition: data.condition,
        notes: data.notes,
      }));

      await updateOdontogram(conditions);
      toast.success('Odontograma atualizado com sucesso!');
      setSelectedTeeth(new Map());
      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar odontograma');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/patients/${patientId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Odontograma</h1>
            <p className="text-gray-500 mt-1">{patient?.name}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isUpdating || selectedTeeth.size === 0}>
          <Save className="h-4 w-4 mr-2" />
          {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      {/* Legenda */}
      <Card>
        <CardHeader>
          <CardTitle>Legenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {TOOTH_CONDITIONS.map((condition) => (
              <div key={condition.value} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: condition.color }}
                />
                <span className="text-sm">{condition.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Odontograma Visual */}
      <Card>
        <CardContent className="pt-6 space-y-8">
          {/* Arcada Superior */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-4">Arcada Superior</p>
            <div className="flex justify-center gap-1">
              {upperTeeth.map((toothNumber) => (
                <div key={toothNumber} className="flex flex-col items-center">
                  <button
                    onClick={() => handleToothClick(toothNumber)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      selectedTeeth.has(toothNumber)
                        ? 'border-blue-600 ring-2 ring-blue-200'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                    style={{ backgroundColor: getToothColor(toothNumber) }}
                  >
                    <span className="text-xs font-semibold">{toothNumber}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Arcada Inferior */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-4">Arcada Inferior</p>
            <div className="flex justify-center gap-1">
              {lowerTeeth.map((toothNumber) => (
                <div key={toothNumber} className="flex flex-col items-center">
                  <button
                    onClick={() => handleToothClick(toothNumber)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      selectedTeeth.has(toothNumber)
                        ? 'border-blue-600 ring-2 ring-blue-200'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                    style={{ backgroundColor: getToothColor(toothNumber) }}
                  >
                    <span className="text-xs font-semibold">{toothNumber}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dentes Selecionados */}
      {selectedTeeth.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Dentes Selecionados ({selectedTeeth.size})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from(selectedTeeth.entries()).map(([toothNumber, data]) => (
              <div key={toothNumber} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="text-center min-w-[60px]">
                  <div className="text-xl font-bold">Dente</div>
                  <div className="text-2xl font-bold text-blue-600">{toothNumber}</div>
                </div>
                <div className="flex-1">
                  <Select
                    value={data.condition}
                    onValueChange={(value) => handleConditionChange(toothNumber, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TOOTH_CONDITIONS.map((condition) => (
                        <SelectItem key={condition.value} value={condition.value}>
                          {condition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToothClick(toothNumber)}
                >
                  Remover
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Histórico */}
      {odontogram?.all && odontogram.all.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Condições</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {odontogram.all.slice(0, 10).map((condition: any) => (
                <div key={condition.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      Dente {condition.toothNumber} - {
                        TOOTH_CONDITIONS.find(c => c.value === condition.condition)?.label || condition.condition
                      }
                    </p>
                    {condition.notes && (
                      <p className="text-sm text-gray-600 mt-1">{condition.notes}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(condition.recordedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}