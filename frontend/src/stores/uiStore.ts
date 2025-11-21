// Zustand store for global UI state
import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  showSpinner: boolean;
  siteAssetLogo?: string;
  setLoading: (loading: boolean) => void;
  setShowSpinner: (show: boolean) => void;
  setSiteAssetLogo: (logo: string | undefined) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  showSpinner: false,
  siteAssetLogo: undefined,
  setLoading: (isLoading) => set({ isLoading, showSpinner: isLoading }),
  setShowSpinner: (showSpinner) => set({ showSpinner }),
  setSiteAssetLogo: (siteAssetLogo) => set({ siteAssetLogo }),
}));
