import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid, Users, CreditCard, CalendarDays, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface DashboardStats {
  totalCustomers: number;
  totalBays: number;
  activeMemberships: number;
  todayBookings: number;
}

export default function Dashboard() {
  const { user, tenant } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard", { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load dashboard");
        return r.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const statCards = [
    {
      label: "Bays",
      value: stats?.totalBays ?? 0,
      icon: LayoutGrid,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Today's Bookings",
      value: stats?.todayBookings ?? 0,
      icon: CalendarDays,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      label: "Customers",
      value: stats?.totalCustomers ?? 0,
      icon: Users,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Active Memberships",
      value: stats?.activeMemberships ?? 0,
      icon: CreditCard,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {tenant?.name ?? "Your facility"} — here's what's happening today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
                  {loading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : error ? (
                    <p className="text-2xl font-bold text-destructive">–</p>
                  ) : (
                    <p className="text-3xl font-bold">{card.value}</p>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Getting started / empty state */}
      {!loading && !error && stats && stats.totalBays === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-8 pb-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Set up your facility</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Start by adding your bays, then invite customers and create bookings. Your dashboard stats will populate as you use the platform.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <a href="/admin/bays" className="text-sm text-primary underline underline-offset-2 hover:no-underline">
                Add bays →
              </a>
              <a href="/admin/customers" className="text-sm text-primary underline underline-offset-2 hover:no-underline">
                Add customers →
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6 text-center text-destructive text-sm">
            Could not load dashboard data. Please refresh the page.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
