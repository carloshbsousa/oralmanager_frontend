export interface Patient {
  id: string;
  clinicId: string;
  patientNumber: string;
  name: string;
  cpf?: string;
  birthDate: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  photoUrl?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Dentist {
  id: string;
  clinicId: string;
  name: string;
  cro: string;
  croState: string;
  specialties?: string[];
  phone?: string;
  email?: string;
  commissionPercentage: number;
  isActive: boolean;
}

export interface Procedure {
  id: string;
  clinicId: string;
  code?: string;
  name: string;
  description?: string;
  category?: string;
  defaultPrice: number;
  estimatedDuration?: number;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  clinicId: string;
  patientId: string;
  dentistId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  procedureId?: string;
  notes?: string;
  patient?: Patient;
  dentist?: Dentist;
  procedure?: Procedure;
}

export interface ClinicalRecord {
  id: string;
  clinicId: string;
  patientId: string;
  dentistId: string;
  appointmentId?: string;
  recordDate: string;
  chiefComplaint?: string;
  clinicalExamination?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  proceduresPerformed?: string;
  prescriptions?: string;
  observations?: string;
  attachments?: Attachment[];
  patient?: Patient;
  dentist?: Dentist;
}

export interface Attachment {
  type: string;
  url: string;
  name: string;
  description?: string;
}

export interface OdontogramCondition {
  id: string;
  toothNumber: number;
  toothFace?: 'vestibular' | 'lingual' | 'mesial' | 'distal' | 'oclusal' | 'incisal' | 'all';
  condition: string;
  notes?: string;
  recordedAt: string;
  recordedBy?: string;
}

export interface Budget {
  id: string;
  clinicId: string;
  patientId: string;
  dentistId?: string;
  budgetNumber: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  validUntil?: string;
  items?: BudgetItem[];
  patient?: Patient;
  dentist?: Dentist;
}

export interface BudgetItem {
  id: string;
  budgetId: string;
  procedureId?: string;
  toothNumber?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  procedure?: Procedure;
}

export interface Receivable {
  id: string;
  clinicId: string;
  patientId: string;
  budgetId?: string;
  invoiceNumber?: string;
  installmentNumber?: number;
  description?: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  paymentDate?: string;
  paymentMethod?: string;
  status: 'pending' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  patient?: Patient;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}