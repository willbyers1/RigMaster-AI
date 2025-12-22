
import { create } from 'zustand';

interface AppState {
  isConnected: boolean;
  isSettingsOpen: boolean;
  isInitialized: boolean;
  hasCustomKey: boolean;
  setConnected: (connected: boolean) => void;
  setSettingsOpen: (isOpen: boolean) => void;
  checkConnection: () => void;
  checkKeyStatus: () => void;
  disconnect: () => void;
}

export const useStore = create<AppState>((set) => ({
  isConnected: false,
  isSettingsOpen: false,
  isInitialized: false,
  hasCustomKey: false,
  setConnected: (connected) => set({ isConnected: connected }),
  setSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
  checkConnection: () => {
    // Check for API key availability exclusively through environment or managed context.
    const hasKey = !!process.env.API_KEY;
    set({ isConnected: hasKey, hasCustomKey: hasKey, isInitialized: true });
  },
  checkKeyStatus: () => {
    // Sync key status based on process.env.API_KEY.
    const hasKey = !!process.env.API_KEY;
    set({ hasCustomKey: hasKey, isConnected: hasKey });
  },
  disconnect: () => {
    // Clear local cache and reset connection status.
    localStorage.removeItem('rigmaster_api_key');
    set({ isConnected: false, hasCustomKey: false });
  }
}));
