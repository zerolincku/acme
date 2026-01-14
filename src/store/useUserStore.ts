import { create } from 'zustand';

interface UserState {
  userInfo: { name: string; role: string } | null;
  setUserInfo: (info: never) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userInfo: null,
  setUserInfo: (info) => set({ userInfo: info }),
  logout: () => set({ userInfo: null }),
}));
