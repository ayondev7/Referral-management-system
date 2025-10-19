import { create } from 'zustand';

interface DashboardData {
  totalReferredUsers: number;
  convertedUsers: number;
  totalCredits: number;
  referralLink: string;
}

interface DashboardStore {
  dashboard: DashboardData | null;
  loading: boolean;
  setDashboard: (data: DashboardData) => void;
  setLoading: (loading: boolean) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  dashboard: null,
  loading: false,
  setDashboard: (data) => set({ dashboard: data }),
  setLoading: (loading) => set({ loading }),
}));
