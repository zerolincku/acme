import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

export interface Toast {
  id: string;
  title?: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success';
}

export type Theme = 'light' | 'dark' | 'system';
export type ThemeColor = 'zinc' | 'red' | 'blue' | 'green' | 'orange';

interface AppState {
  // UI State
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Counter State (Legacy)
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;

  // Auth State
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;

  // Toast State
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;

  // Theme State
  theme: Theme;
  themeColor: ThemeColor;
  setTheme: (theme: Theme) => void;
  setThemeColor: (color: ThemeColor) => void;
}

export const useStore = create<AppState>((set) => ({
  // UI
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  // Counter
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),

  // Auth
  isAuthenticated: false,
  currentUser: null,
  login: (email) => set({
    isAuthenticated: true,
    currentUser: {
      id: '1',
      name: 'Admin User',
      email: email,
      role: 'Administrator',
      status: 'Active'
    }
  }),
  logout: () => set({ isAuthenticated: false, currentUser: null }),
  updateUser: (data) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, ...data } : null
  })),

  // Toast
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  // Theme
  theme: 'system',
  themeColor: 'blue',
  setTheme: (theme) => set({ theme }),
  setThemeColor: (themeColor) => set({ themeColor }),
}));
