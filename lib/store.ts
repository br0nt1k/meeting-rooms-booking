import { create } from 'zustand';

interface UserState {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
  } | null; 
  
  isLoading: boolean; 

  setUser: (user: UserState['user']) => void;
  clearUser: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null, 
  isLoading: true, 
  setUser: (user) => set({ user, isLoading: false }),
  clearUser: () => set({ user: null, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));