export const TOOTH_CONDITIONS = [
  { value: 'healthy', label: 'Hígido', color: '#22c55e' },
  { value: 'caries', label: 'Cárie', color: '#ef4444' },
  { value: 'restoration', label: 'Restauração', color: '#3b82f6' },
  { value: 'missing', label: 'Ausente', color: '#6b7280' },
  { value: 'implant', label: 'Implante', color: '#8b5cf6' },
  { value: 'crown', label: 'Coroa', color: '#f59e0b' },
  { value: 'root_canal', label: 'Canal Tratado', color: '#10b981' },
  { value: 'fracture', label: 'Fratura', color: '#dc2626' },
  { value: 'bridge', label: 'Ponte', color: '#6366f1' },
  { value: 'prosthesis', label: 'Prótese', color: '#ec4899' },
] as const;

export const PROCEDURE_CATEGORIES = [
  'preventive',
  'restorative',
  'surgical',
  'orthodontic',
  'endodontic',
  'periodontic',
  'prosthetic',
  'aesthetic',
  'pediatric',
  'emergency',
] as const;

export const USER_ROLES = {
  owner: 'Proprietário',
  admin: 'Administrador',
  dentist: 'Dentista',
  assistant: 'Auxiliar',
  receptionist: 'Recepcionista',
} as const;

export const PAYMENT_METHODS = [
  { value: 'credit_card', label: 'Cartão de Crédito' },
  { value: 'debit_card', label: 'Cartão de Débito' },
  { value: 'cash', label: 'Dinheiro' },
  { value: 'pix', label: 'PIX' },
  { value: 'bank_transfer', label: 'Transferência' },
  { value: 'bank_slip', label: 'Boleto' },
] as const;

export const GENDERS = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Feminino' },
  { value: 'other', label: 'Outro' },
  { value: 'prefer_not_to_say', label: 'Prefiro não informar' },
] as const;