import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Users, CreditCard, CalendarDays, TrendingUp, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface ChartPoint { label: string; count?: number; revenue?: number }

interface DashboardData {
  totalCustomers: number;
  totalBays: number;
  activeMemberships: number;
  todayBookings: number;
  charts: {
    customers: ChartPoint[];
    bookings: ChartPoint[];
    revenue: ChartPoint[];
  };
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

const CHART_TOOLTIP_STYLE = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: 12,
};

const AXIS_TICK = { fontSize: 10, fill: "hsl(var(--muted-foreground))" };

function MonthlyChart({
  title,
  legend,
  data,
  dataKey,
  formatter,
}: {
  title: string;
  legend: string;
  data: ChartPoint[];
  dataKey: string;
  formatter: (v: number) => string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barSize={10}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="label"
              tick={AXIS_TICK}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={AXIS_TICK}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatter}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(v: number) => [formatter(v), legend]}
              contentStyle={CHART_TOOLTIP_STYLE}
            />
            <Legend
              formatter={() => legend}
              iconType="square"
              iconSize={10}
              wrapperStyle={{ fontSize: 11 }}
            />
            <Bar dataKey={dataKey} fill="#3b82f6" radius={[3, 3, 0, 0]} name={legend} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user, tenant } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bays, setBays] = useState<Bay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard", { credentials: "include" }).then((r) => r.ok ? r.json() : Promise.reject("Failed to load dashboard")),
      fetch("/api/bookings", { credentials: "include" }).then((r) => r.ok ? r.json() : []),
      fetch("/api/bays", { credentials: "include" }).then((r) => r.ok ? r.json() : []),
    ])
      .then(([dashData, bookingData, bayData]) => {
        setData(dashData);
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

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 6);

  const statCards = [
    { label: "Customers", value: data?.totalCustomers ?? 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Today's Bookings", value: data?.todayBookings ?? 0, icon: CalendarDays, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Bays", value: data?.totalBays ?? 0, icon: LayoutGrid, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active Memberships", value: data?.activeMemberships ?? 0, icon: CreditCard, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {tenant?.name ?? "Your facility"}
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

      {/* Monthly charts — Customers + Revenue side by side */}
      {!loading && !error && data && (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <MonthlyChart
              title="Customers"
              legend="Customer by month"
              data={data.charts.customers}
              dataKey="count"
              formatter={(v) => String(v)}
            />
            <MonthlyChart
              title="Revenue"
              legend="Revenue by month"
              data={data.charts.revenue}
              dataKey="revenue"
              formatter={(v) => `$${v.toFixed(0)}`}
            />
          </div>

          {/* Bookings chart */}
          <MonthlyChart
            title="Bookings"
            legend="Booking by month"
            data={data.charts.bookings}
            dataKey="count"
            formatter={(v) => String(v)}
          />
        </>
      )}

      {/* Loading skeleton for charts */}
      {loading && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
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
      {!loading && !error && recentBookings.length === 0 && data && data.totalBays === 0 && (
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

      {!loading && !error && recentBookings.length === 0 && data && data.totalBays > 0 && (
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
