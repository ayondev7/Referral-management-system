import { create } from 'zustand';

type AuthStore = Record<string, unknown>;

export const useAuthStore = create<AuthStore>(() => ({ }));
