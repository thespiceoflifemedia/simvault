import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthTenant {
  id: number;
  name: string;
  slug: string;
  plan: string;
}

interface AuthState {
  user: AuthUser | null;
  tenant: AuthTenant | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: { facilityName: string; email: string; password: string; name: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const API_BASE = "/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, tenant: null, loading: true });

  useEffect(() => {
    fetch(`${API_BASE}/auth/me`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setState({ user: data.user, tenant: data.tenant, loading: false });
        } else {
          setState({ user: null, tenant: null, loading: false });
        }
      })
      .catch(() => setState({ user: null, tenant: null, loading: false }));
  }, []);

  const login = async (email: string, password: string) => {
    const r = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) {
      const err = await r.json();
      throw new Error(err.error ?? "Login failed");
    }
    const data = await r.json();
    setState({ user: data.user, tenant: data.tenant, loading: false });
  };

  const register = async (payload: { facilityName: string; email: string; password: string; name: string }) => {
    const r = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      const err = await r.json();
      throw new Error(err.error ?? "Registration failed");
    }
    const data = await r.json();
    setState({ user: data.user, tenant: data.tenant, loading: false });
  };

  const logout = async () => {
    await fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" });
    setState({ user: null, tenant: null, loading: false });
  };

  return <AuthContext.Provider value={{ ...state, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
