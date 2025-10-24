// app/(dashboard)/layout.tsx

'use client';

// Imports removidos: useState, Menu, Button, cn
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* 1. Sidebar (Apenas Desktop) */}
      {/* Fica visível em telas 'lg' ou maiores, e oculta ('hidden') abaixo disso */}
      <div className="hidden border-r border-gray-200 bg-white lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* 2. Main Content Area */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Header (Contém o botão de menu mobile e o resto do conteúdo) */}
        <Header />

        {/* Content */}
        <main className="flex-1 p-6 md:p-8 bg-gray-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}