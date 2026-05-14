import { create } from "zustand";
import Cookies from "js-cookie";
import { authApi } from "@/lib/api";

interface AuthUser {
  user_id: number;
  username: string;
  avatar: string;
  skill_level: string;
  xp_points: number;
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string; full_name?: string; age?: number }) => Promise<void>;
  logout: () => void;
  init: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  init: () => {
    const token = Cookies.get("token");
    const userStr = Cookies.get("user");
    if (token && userStr) {
      try {
        set({ token, user: JSON.parse(userStr), isLoading: false });
      } catch {
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    const data = await authApi.login({ email, password });
    Cookies.set("token", data.access_token, { expires: 7 });
    Cookies.set("user", JSON.stringify(data), { expires: 7 });
    set({ token: data.access_token, user: data });
  },

  register: async (payload) => {
    const data = await authApi.register(payload);
    Cookies.set("token", data.access_token, { expires: 7 });
    Cookies.set("user", JSON.stringify(data), { expires: 7 });
    set({ token: data.access_token, user: data });
  },

  logout: () => {
    Cookies.remove("token");
    Cookies.remove("user");
    set({ user: null, token: null });
  },
}));
