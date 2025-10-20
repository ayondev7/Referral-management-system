import { create } from 'zustand';

type AuthStore = {
	isAuthenticated?: boolean;
};

export const useAuthStore = create<AuthStore>(() => ({ isAuthenticated: false }));
