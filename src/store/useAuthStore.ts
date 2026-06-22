import { create } from 'zustand';
import type { User } from '@/types';
import { getUsers } from '@/data/seed';
import { getStorageItem, setStorageItem, removeStorageItem, AUTH_STORAGE_KEY } from '@/utils/storage';

interface AuthState {
  user: User | null;
  login: (username: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  checkAuth: () => User | null;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: getStorageItem<User | null>(AUTH_STORAGE_KEY, null),

  login: (username: string, password: string) => {
    const users = getUsers();
    const foundUser = users.find(
      (u: { username: string; password: string }) => u.username === username && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      const user = userWithoutPassword as User;
      setStorageItem(AUTH_STORAGE_KEY, user);
      set({ user });
      return { success: true };
    }

    return { success: false, message: '用户名或密码错误' };
  },

  logout: () => {
    removeStorageItem(AUTH_STORAGE_KEY);
    set({ user: null });
  },

  checkAuth: () => {
    const user = getStorageItem<User | null>(AUTH_STORAGE_KEY, null);
    set({ user });
    return user;
  },
}));
