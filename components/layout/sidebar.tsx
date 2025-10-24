// components/layout/sidebar.tsx
// (Nenhuma alteração necessária)

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Wallet,
  ClipboardList,
  BarChart3,
  Settings,
  Stethoscope,
  Receipt,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Pacientes', href: '/patients', icon: Users },
  { name: 'Agendamentos', href: '/appointments', icon: Calendar },
  { name: 'Prontuários', href: '/clinical-records', icon: FileText },
  { name: 'Orçamentos', href: '/budgets', icon: ClipboardList },
  {
    name: 'Financeiro',
    icon: Wallet,
    children: [
      { name: 'Contas a Receber', href: '/financial/receivables' },
      { name: 'Contas a Pagar', href: '/financial/payables' },
      { name: 'Visão Geral', href: '/financial/overview' },
    ],
  },
  { name: 'Relatórios', href: '/reports', icon: BarChart3 },
  { name: 'Analytics', href: '/analytics', icon: Receipt },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { clinic } = useAuth();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <Stethoscope className="h-8 w-8 text-blue-600" />
        <span className="ml-3 text-xl font-bold text-gray-900">
          {clinic?.name || 'OralManager'}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            if (item.children) {
              return (
                <li key={item.name}>
                  <div className="px-3 py-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </div>
                  </div>
                  <ul className="ml-9 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.name}>
                        <Link
                          href={child.href}
                          className={cn(
                            'block rounded-md px-3 py-2 text-sm font-medium',
                            pathname === child.href
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-700 hover:bg-gray-50'
                          )}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            }

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium',
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Clinic Info */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {clinic?.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{clinic?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{clinic?.subscriptionStatus}</p>
          </div>
        </div>
      </div>
    </div>
  );
}