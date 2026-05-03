import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Users, CreditCard, CalendarDays, TrendingUp, ArrowRight, DollarSign } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

interface DashboardStats {
  totalCustomers: number;
  totalBays: number;
  activeMemberships: number;
  todayBookings: number;
}

interface Booking {
  id: number;
  customerName: string;
  bayId: number | null;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: string | null;
}

interface Bay {
  id: number;
  name: string;
}

const statusColors: Record<string, string> = {
  confirmed: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildRevenueSeries(bookings: Booking[]) {
  const today = new Date();
  const days: { label: string; revenue: number; date: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const revenue = bookings
      .filter(
        (b) =>
          b.status !== "cancelled" &&
          b.totalPrice &&
          b.startTime.slice(0, 10) === dateStr
      )
      .reduce((s, b) => s + Number(b.totalPrice), 0);
    days.push({ label: DAY_LABELS[d.getDay()], revenue, date: dateStr });
  }
  return days;
}

export default function Dashboard() {
  const { user, tenant } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bays, setBays] = useState<Bay[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard", { credentials: "include" }).then((r) => r.ok ? r.json() : Promise.reject("Failed")),
      fetch("/api/bookings", { credentials: "include" }).then((r) => r.ok ? r.json() : []),
      fetch("/api/bays", { credentials: "include" }).then((r) => r.ok ? r.json() : []),
    ])
      .then(([dashData, bookingData, bayData]) => {
        setStats(dashData);
        setBookings(bookingData);
        setBays(bayData);
        setLoading(false);
      })
      .catch((e) => { setError(String(e)); setLoading(false); });
  }, []);

  const getBayName = (id: number | null) => {
    if (id == null) return "—";
    return bays.find((b) => b.id === id)?.name ?? `Bay #${id}`;
  };

  const revenueSeries = buildRevenueSeries(bookings);
  const totalRevenue7d = revenueSeries.reduce((s, d) => s + d.revenue, 0);
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 6);

  const statCards = [
    { label: "Bays", value: stats?.totalBays ?? 0, icon: LayoutGrid, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Today's Bookings", value: stats?.todayBookings ?? 0, icon: CalendarDays, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Customers", value: stats?.totalCustomers ?? 0, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active Memberships", value: stats?.activeMemberships ?? 0, icon: CreditCard, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-8">
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

      {/* Revenue chart + recent bookings */}
      {!loading && !error && (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Revenue chart */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Revenue — Last 7 Days</CardTitle>
                <p className="text-2xl font-bold mt-1">${totalRevenue7d.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
                  No booking data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={revenueSeries} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={24}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip
                      formatter={(v: number) => [`$${v.toFixed(2)}`, "Revenue"]}
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Bay status */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Bay Status</CardTitle>
            </CardHeader>
            <CardContent>
              {bays.length === 0 ? (
                <div className="text-center py-8">
                  <LayoutGrid className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No bays configured</p>
                  <Link href="/admin/bays">
                    <Button variant="link" size="sm" className="mt-1 text-xs">Add bays →</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {bays.map((bay) => {
                    const now = new Date();
                    const active = (bay as Bay & { active?: boolean });
                    const hasBookingNow = bookings.some(
                      (b) =>
                        b.bayId === bay.id &&
                        b.status === "confirmed" &&
                        new Date(b.startTime) <= now &&
                        new Date(b.endTime) >= now
                    );
                    return (
                      <div key={bay.id} className="flex items-center justify-between py-1.5 px-3 rounded-lg border bg-muted/20">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${hasBookingNow ? "bg-green-500" : "bg-gray-300"}`} />
                          <span className="text-sm font-medium">{bay.name}</span>
                        </div>
                        <span className={`text-xs font-medium ${hasBookingNow ? "text-green-600" : "text-muted-foreground"}`}>
                          {hasBookingNow ? "In Use" : "Available"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Bookings */}
      {!loading && !error && recentBookings.length > 0 && (
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Bookings</CardTitle>
            <Link href="/admin/bookings">
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between px-6 py-3 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {b.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{b.customerName}</div>
                      <div className="text-xs text-muted-foreground">
                        {getBayName(b.bayId)} · {new Date(b.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })} {new Date(b.startTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {b.totalPrice && (
                      <span className="text-sm font-semibold">${Number(b.totalPrice).toFixed(2)}</span>
                    )}
                    <Badge variant="outline" className={`${statusColors[b.status] ?? ""} uppercase text-[10px] tracking-wider`}>
                      {b.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Onboarding empty states */}
      {!loading && !error && recentBookings.length === 0 && stats && stats.totalBays === 0 && (
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
              <Link href="/admin/bays" className="text-sm text-primary underline underline-offset-2 hover:no-underline">
                Add bays →
              </Link>
              <Link href="/admin/customers" className="text-sm text-primary underline underline-offset-2 hover:no-underline">
                Add customers →
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && recentBookings.length === 0 && stats && stats.totalBays > 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-8 pb-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">No bookings yet</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Create your first booking to start tracking bay usage.
            </p>
            <Link href="/admin/bookings">
              <Button size="sm" className="mt-2">Create a booking</Button>
            </Link>
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
