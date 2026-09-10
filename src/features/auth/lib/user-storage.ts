import { User } from '@/types';

const STORAGE_KEYS = {
  USER: 'ict_lms_user_v1',
};

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function saveStoredUser(user: User): User {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      window.dispatchEvent(new Event('ict-user-updated'));
    } catch (e) {
      console.error('Failed to save user in localStorage', e);
    }
  }
  return user;
}

export function logoutStoredUser(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {
      console.error('Failed to clear user from localStorage', e);
    }
  }
}
