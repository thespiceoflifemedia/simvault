import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function Login() {
  const { login, register } = useAuth();
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const returnTo = params.get("returnTo") ?? "/admin";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    facilityName: "",
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register({ facilityName: form.facilityName, name: form.name, email: form.email, password: form.password });
      }
      navigate(returnTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b14] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-9 h-9 bg-[#3b82f6] rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" fill="white" />
                <rect x="14" y="3" width="7" height="7" rx="1" fill="white" opacity="0.7" />
                <rect x="3" y="14" width="7" height="7" rx="1" fill="white" opacity="0.7" />
                <rect x="14" y="14" width="7" height="7" rx="1" fill="white" />
              </svg>
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">SimVault</span>
          </div>
          <h1 className="text-white text-2xl font-bold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-white/50 mt-1 text-sm">
            {mode === "login" ? "Sign in to your facility dashboard" : "Start managing your sim facility"}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">Facility Name</Label>
                  <Input
                    name="facilityName"
                    value={form.facilityName}
                    onChange={handleChange}
                    placeholder="e.g. Ace Golf Simulators"
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#3b82f6]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">Your Name</Label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#3b82f6]"
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label className="text-white/70 text-sm">Email</Label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@yourfacility.com"
                required
                autoComplete="username"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#3b82f6]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-white/70 text-sm">Password</Label>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder={mode === "register" ? "At least 8 characters" : "••••••••"}
                required
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                minLength={mode === "register" ? 8 : 1}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#3b82f6]"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-lg py-2.5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            {mode === "login" ? "New to SimVault?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              className="text-[#3b82f6] hover:text-blue-400 font-medium"
            >
              {mode === "login" ? "Create a free account" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          <a href="/" className="hover:text-white/40 transition-colors">← Back to SimVault.io</a>
        </p>
      </div>
    </div>
  );
}
