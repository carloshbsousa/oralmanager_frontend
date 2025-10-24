/**
 * Format a number as Brazilian currency (BRL)
 */
export function formatCurrency(
  value: number | string | null | undefined,
  compact = false
): string {
  if (value === null || value === undefined) return 'R$ 0,00';

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return 'R$ 0,00';

  if (compact && Math.abs(numValue) >= 1000) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(numValue);
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
}

/**
 * Format a date string to Brazilian format
 */
export function formatDate(
  date: string | Date | null | undefined,
  includeTime = false
): string {
  if (!date) return '-';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '-';

  if (includeTime) {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Format a time string
 */
export function formatTime(time: string | Date | null | undefined): string {
  if (!time) return '-';

  const dateObj = typeof time === 'string' ? new Date(time) : time;

  if (isNaN(dateObj.getTime())) return '-';

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Format a date to relative time (e.g., "2 horas atrás")
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '-';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '-';

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'agora há pouco';
  if (diffMins < 60) return `há ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
  if (diffHours < 24) return `há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  if (diffDays < 7) return `há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
  
  return formatDate(dateObj);
}

/**
 * Format a CPF (Brazilian individual taxpayer registry number)
 */
export function formatCPF(cpf: string | null | undefined): string {
  if (!cpf) return '-';
  
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return cpf;
  
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Format a CNPJ (Brazilian company registry number)
 */
export function formatCNPJ(cnpj: string | null | undefined): string {
  if (!cnpj) return '-';
  
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length !== 14) return cnpj;
  
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Format a phone number (Brazilian format)
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '-';
  
  const cleaned = phone.replace(/\D/g, '');
  
  // Mobile: (11) 98765-4321
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  // Landline: (11) 3456-7890
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
}

/**
 * Format a CEP (Brazilian postal code)
 */
export function formatCEP(cep: string | null | undefined): string {
  if (!cep) return '-';
  
  const cleaned = cep.replace(/\D/g, '');
  
  if (cleaned.length !== 8) return cep;
  
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Format a number as percentage
 */
export function formatPercentage(
  value: number | string | null | undefined,
  decimals = 1
): string {
  if (value === null || value === undefined) return '0%';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0%';
  
  return `${numValue.toFixed(decimals)}%`;
}

/**
 * Format a file size
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format a duration in minutes to human readable format
 */
export function formatDuration(minutes: number | null | undefined): string {
  if (!minutes || minutes === 0) return '0 min';
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${mins}min`;
}

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate: string | Date | null | undefined): number {
  if (!birthDate) return 0;
  
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  
  if (isNaN(birth.getTime())) return 0;
  
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Format age with label
 */
export function formatAge(birthDate: string | Date | null | undefined): string {
  const age = calculateAge(birthDate);
  
  if (age === 0) return '-';
  
  return `${age} ${age === 1 ? 'ano' : 'anos'}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '0';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0';
  
  return new Intl.NumberFormat('pt-BR').format(numValue);
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  if (!value) return 0;
  
  // Remove currency symbol and spaces
  let cleaned = value.replace(/[R$\s]/g, '');
  
  // Replace comma with dot for decimal
  cleaned = cleaned.replace(',', '.');
  
  // Remove any remaining non-numeric characters except dot
  cleaned = cleaned.replace(/[^\d.]/g, '');
  
  return parseFloat(cleaned) || 0;
}

/**
 * Format appointment status
 */
export function formatAppointmentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    scheduled: 'Agendado',
    confirmed: 'Confirmado',
    completed: 'Concluído',
    cancelled: 'Cancelado',
    no_show: 'Faltou',
  };
  
  return statusMap[status] || status;
}

/**
 * Format payment status
 */
export function formatPaymentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Pendente',
    paid: 'Pago',
    overdue: 'Atrasado',
    partial: 'Parcial',
    cancelled: 'Cancelado',
  };
  
  return statusMap[status] || status;
}

/**
 * Format budget status
 */
export function formatBudgetStatus(status: string): string {
  const statusMap: Record<string, string> = {
    draft: 'Rascunho',
    sent: 'Enviado',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
    expired: 'Expirado',
  };
  
  return statusMap[status] || status;
}