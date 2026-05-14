import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-redirect on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      Cookies.remove("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { username: string; email: string; password: string; full_name?: string; age?: number }) =>
    api.post("/api/auth/register", data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post("/api/auth/login", data).then((r) => r.data),

  me: () => api.get("/api/auth/me").then((r) => r.data),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardApi = {
  get: () => api.get("/api/dashboard/").then((r) => r.data),
};

// ── Profile ───────────────────────────────────────────────────────────────────
export const profileApi = {
  get: () => api.get("/api/profile/").then((r) => r.data),
  update: (data: { full_name?: string; age?: number; avatar?: string }) =>
    api.patch("/api/profile/", data).then((r) => r.data),
};

// ── AI Tutor ──────────────────────────────────────────────────────────────────
export const aiApi = {
  hint: (data: { module: string; puzzle_description: string; student_attempt?: string; skill_level?: string }) =>
    api.post("/api/ai/hint", data).then((r) => r.data),
  chat: (message: string) =>
    api.post("/api/ai/chat", { message }).then((r) => r.data),
};
