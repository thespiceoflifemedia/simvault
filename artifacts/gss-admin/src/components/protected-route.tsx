import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [location, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Save intended path so login can redirect back
      const returnTo = location !== "/login" ? location : "/admin";
      navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    }
  }, [loading, user, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b14] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3b82f6] animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
