import { create } from 'zustand';

interface OverlayLayer { id: string; name: string; geojson: any; }

interface UiState {
  selectedReportId:    string | null;
  selectedWetlandCode: string | null;
  isPanelOpen:         boolean;
  isSatelliteLayer:    boolean;
  isNdviLayer:         boolean;
  isNdwiLayer:         boolean;
  isLulcLayer:         boolean;
  isDemLayer:          boolean;
  isWetlandBoundaryLayer: boolean;
  isProtectedAreaLayer:   boolean;
  isDrainageLayer:        boolean;
  isHydroshedsLayer:      boolean;
  isAdminLayer:           boolean;
  overlayLayers:       OverlayLayer[];
  isKioskMode:         boolean;
  isVirtualPhoneOpen:  boolean;
  sidebarTab:          'reports' | 'analytics' | 'admin' | 'profile';

  selectReport:        (id: string | null) => void;
  selectWetland:       (code: string | null) => void;
  toggleSatellite:     () => void;
  toggleNdvi:          () => void;
  toggleNdwi:          () => void;
  toggleLulc:          () => void;
  toggleDem:           () => void;
  toggleWetlandBoundary: () => void;
  toggleProtectedArea:   () => void;
  toggleDrainage:        () => void;
  toggleHydrosheds:      () => void;
  toggleAdmin:           () => void;
  addOverlayLayer:     (name: string, geojson: any) => void;
  removeOverlayLayer:  (id: string) => void;
  toggleKioskMode:     () => void;
  toggleVirtualPhone:  () => void;
  setSidebarTab:       (tab: UiState['sidebarTab']) => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedReportId:    null,
  selectedWetlandCode: null,
  isPanelOpen:         false,
  isSatelliteLayer:    true,
  isNdviLayer:         false,
  isNdwiLayer:         false,
  isLulcLayer:         false,
  isDemLayer:          false,
  isWetlandBoundaryLayer: true,
  isProtectedAreaLayer:   false,
  isDrainageLayer:        false,
  isHydroshedsLayer:      false,
  isAdminLayer:           false,
  overlayLayers:       [],
  isKioskMode:         false,
  isVirtualPhoneOpen:  false,
  sidebarTab:          'reports',

  selectReport:        (id)   => set({ selectedReportId: id, isPanelOpen: !!id }),
  selectWetland:       (code) => set({ selectedWetlandCode: code }),
  toggleSatellite:     ()     => set((s) => ({ isSatelliteLayer: !s.isSatelliteLayer })),
  toggleNdvi:          ()     => set((s) => ({ isNdviLayer:      !s.isNdviLayer })),
  toggleNdwi:          ()     => set((s) => ({ isNdwiLayer:      !s.isNdwiLayer })),
  toggleLulc:          ()     => set((s) => ({ isLulcLayer:      !s.isLulcLayer })),
  toggleDem:           ()     => set((s) => ({ isDemLayer:       !s.isDemLayer })),
  toggleWetlandBoundary: ()   => set((s) => ({ isWetlandBoundaryLayer: !s.isWetlandBoundaryLayer })),
  toggleProtectedArea:   ()   => set((s) => ({ isProtectedAreaLayer:   !s.isProtectedAreaLayer })),
  toggleDrainage:        ()   => set((s) => ({ isDrainageLayer:        !s.isDrainageLayer })),
  toggleHydrosheds:      ()   => set((s) => ({ isHydroshedsLayer:      !s.isHydroshedsLayer })),
  toggleAdmin:           ()   => set((s) => ({ isAdminLayer:           !s.isAdminLayer })),
  addOverlayLayer:     (name, geojson) => set((s) => ({
    overlayLayers: [...s.overlayLayers, { id: crypto.randomUUID(), name, geojson }],
  })),
  removeOverlayLayer:  (id)   => set((s) => ({ overlayLayers: s.overlayLayers.filter((l) => l.id !== id) })),
  toggleKioskMode:     ()     => set((s) => ({ isKioskMode:        !s.isKioskMode })),
  toggleVirtualPhone:  ()     => set((s) => ({ isVirtualPhoneOpen: !s.isVirtualPhoneOpen })),
  setSidebarTab:       (tab)  => set({ sidebarTab: tab }),
}));
