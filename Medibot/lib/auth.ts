import { User, UserRole } from './types';

// Demo accounts
const DEMO_ACCOUNTS: Record<string, { password: string; role: UserRole; name: string }> = {
  'dr.mehta': { password: 'doctor', role: 'doctor', name: 'Dr. Mehta' },
  'nurse.priya': { password: 'nurse', role: 'nurse', name: 'Nurse Priya' },
  'billing.ravi': { password: 'billing_executive', role: 'billing_executive', name: 'Ravi - Billing' },
  'tech.anand': { password: 'technician', role: 'technician', name: 'Anand - Tech' },
  'admin.sys': { password: 'admin', role: 'admin', name: 'Admin System' },
};

export function validateCredentials(username: string, password: string): User | null {
  const account = DEMO_ACCOUNTS[username];
  if (account && account.password === password) {
    return {
      id: username,
      username,
      role: account.role,
      name: account.name,
    };
  }
  return null;
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('medibot_user');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function storeUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('medibot_user', JSON.stringify(user));
}

export function clearUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('medibot_user');
}

export function isAuthenticated(): boolean {
  return getStoredUser() !== null;
}
