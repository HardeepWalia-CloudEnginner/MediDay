export type UserRole = 'doctor' | 'nurse' | 'billing_executive' | 'technician' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
  retrievalType?: 'Hybrid RAG' | 'SQL RAG';
  citations?: SourceCitation[];
}

export interface SourceCitation {
  documentName: string;
  sectionTitle: string;
  content?: string;
  sourceUrl?: string;
}

export interface CollectionAccess {
  role: UserRole;
  collections: string[];
}

export const ROLE_COLLECTIONS: Record<UserRole, string[]> = {
  doctor: ['General Hospital HR', 'Clinical Protocols', 'Drug Formulary', 'Diagnostic Reference', 'Nursing Procedures', 'Infection Control'],
  nurse: ['General Hospital HR', 'Nursing Procedures', 'ICU Guidelines', 'Infection Control'],
  billing_executive: ['General Hospital HR', 'Insurance Billing Codes', 'Claim Submission Guide'],
  technician: ['General Hospital HR', 'Equipment Manuals', 'Maintenance Schedules', 'Calibration Records'],
  admin: ['General Hospital HR', 'Clinical Protocols', 'Drug Formulary', 'Diagnostic Reference', 'Nursing Procedures', 'Infection Control', 'Insurance Billing', 'Claim Submission', 'Equipment Manuals', 'Maintenance Schedules'],
};
