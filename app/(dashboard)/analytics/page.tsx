'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function MyPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Título</h1>
        <p className="text-gray-500 mt-1">Descrição</p>
      </div>

      {/* Content */}
      <Card>
        {/* Conteúdo aqui */}
      </Card>
    </div>
  );
}