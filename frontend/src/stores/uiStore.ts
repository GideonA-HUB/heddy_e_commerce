// Zustand store for global UI state (drawers, menus, assets)
import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  showSpinner: boolean;
  siteAssetLogo?: string;
  isMobileMenuOpen: boolean;
  isCartDrawerOpen: boolean;
  isSearchOpen: boolean;
  setLoading: (loading: boolean) => void;
  setShowSpinner: (show: boolean) => void;
  setSiteAssetLogo: (logo: string | undefined) => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  openSearch: () => void;
  closeSearch: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  showSpinner: false,
  siteAssetLogo: undefined,
  isMobileMenuOpen: false,
  isCartDrawerOpen: false,
  isSearchOpen: false,
  setLoading: (isLoading) => set({ isLoading, showSpinner: isLoading }),
  setShowSpinner: (showSpinner) => set({ showSpinner }),
  setSiteAssetLogo: (siteAssetLogo) => set({ siteAssetLogo }),
  openMobileMenu: () => set({ isMobileMenuOpen: true, isCartDrawerOpen: false }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () =>
    set((s) => ({
      isMobileMenuOpen: !s.isMobileMenuOpen,
      isCartDrawerOpen: false,
    })),
  openCartDrawer: () => set({ isCartDrawerOpen: true, isMobileMenuOpen: false }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  toggleCartDrawer: () =>
    set((s) => ({
      isCartDrawerOpen: !s.isCartDrawerOpen,
      isMobileMenuOpen: false,
    })),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
}));
