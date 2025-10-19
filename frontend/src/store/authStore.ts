import { create } from 'zustand';

// This store is now minimal and only used for UI state
// Authentication is handled by NextAuth
// User data is fetched via React Query (useUser hook)

interface AuthStore {
  // Add any auth-related UI state here if needed
  // Do NOT store tokens or user data here
}

export const useAuthStore = create<AuthStore>((set) => ({
  // Empty for now, can be used for auth-related UI state
}));
