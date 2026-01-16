import { create } from 'zustand';

interface AppState {
  count: number;
  user: { name: string; role: string } | null;
  isAuthenticated: boolean;
  token: string | null;
  increment: () => void;
  decrement: () => void;
  setUser: (user: { name: string; role: string } | null) => void;
  reset: () => void;
}

export const useStore = create<AppState>((set) => ({
  count: 0,
  user: { name: "Guest", role: "Viewer" },
  isAuthenticated: true,
  token: null,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setUser: (user) => set({ user }),
  reset: () => set({ count: 0 }),
}));

