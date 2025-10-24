// components/layout/header.tsx

'use client';

import { Bell, Search, User, LogOut, Menu } from 'lucide-react'; 
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { // Adicionados imports do Sheet
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle, 
  SheetTrigger,
} from '@/components/ui/sheet';
import { Sidebar } from '@/components/layout/sidebar'; 
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; 

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6">
      {/* Botão do Menu Sanduíche (Mobile) */}
      <Sheet>
        <SheetTrigger asChild>          
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          {/* Título para Acessibilidade (Oculto) */}
          <VisuallyHidden>
            <SheetHeader>
              <SheetTitle>Menu Principal</SheetTitle>
              <SheetDescription>Navegação principal do aplicativo</SheetDescription>
            </SheetHeader>
          </VisuallyHidden>
          {/* Reutilizamos o componente Sidebar aqui dentro */}
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Search */}
      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar pacientes, agendamentos..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="rounded-full" />
                ) : (
                  <User className="h-4 w-4 text-blue-600" />
                )}
              </div>
              {/* O nome do usuário é oculto em telas 'sm' (pequenas) ou menores */}
              <span className="hidden text-sm font-medium sm:block">{user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              Notificações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}