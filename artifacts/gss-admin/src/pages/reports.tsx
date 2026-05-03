import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, LayoutList, DollarSign, Clock, ChevronLeft, TrendingUp, Users, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Booking {
  id: number;
  customerName: string;
  bayName: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number | null;
}

type ReportView =
  | null
  | "booking-history"
  | "billing-history"
  | "end-of-day"
  | "open-bills"
  | "shift-report"
  | "monthly-revenue"
  | "quarterly-revenue"
  | "category-performance"
  | "peak-hours"
  | "peak-days"
  | "player-counts";

const sections = [
  {
    title: "History",
    icon: <History className="h-5 w-5 text-primary" />,
    reports: [
      { id: "booking-history" as ReportView, name: "Booking History", description: "View past booking records and details" },
      { id: "billing-history" as ReportView, name: "Billing History", description: "View transaction and billing history" },
    ],
  },
  {
    title: "Daily Operations",
    icon: <LayoutList className="h-5 w-5 text-primary" />,
    reports: [
      { id: "end-of-day" as ReportView, name: "End of Day", description: "Daily closing and summary reports" },
      { id: "open-bills" as ReportView, name: "Open Bills", description: "Currently open and unsettled bills" },
      { id: "shift-report" as ReportView, name: "Shift Report", description: "Employee shift operations and tills" },
    ],
  },
  {
    title: "Sales & Revenue",
    icon: <DollarSign className="h-5 w-5 text-primary" />,
    reports: [
      { id: "monthly-revenue" as ReportView, name: "Monthly Revenue", description: "Revenue breakdown by month" },
      { id: "quarterly-revenue" as ReportView, name: "Quarterly Revenue", description: "High level quarterly performance" },
      { id: "category-performance" as ReportView, name: "Category Performance", description: "Sales categorized by type" },
    ],
  },
  {
    title: "Time & Trends",
    icon: <Clock className="h-5 w-5 text-primary" />,
    reports: [
      { id: "peak-hours" as ReportView, name: "Peak Hours", description: "Busiest times of the day" },
      { id: "peak-days" as ReportView, name: "Peak Days", description: "Busiest days of the week" },
      { id: "player-counts" as ReportView, name: "Player Counts", description: "Average and total player metrics" },
    ],
  },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
};

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtTime = (d: string) =>
  new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
const fmtDT = (d: string) => `${fmt(d)} ${fmtTime(d)}`;

function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/bookings", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => { setBookings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  return { bookings, loading };
}

function ReportHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}><ChevronLeft className="h-4 w-4" /></Button>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
    </div>
  );
}

function BookingHistoryReport({ onBack }: { onBack: () => void }) {
  const { bookings, loading } = useBookings();
  const sorted = [...bookings].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  return (
    <div>
      <ReportHeader title="Booking History" onBack={onBack} />
      {loading ? (
        <div className="space-y-3">{[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : sorted.length === 0 ? (
        <div className="border border-dashed rounded-xl p-12 text-center">
          <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No bookings on record.</p>
        </div>
      ) : (
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Bay</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((b) => (
                <TableRow key={b.id} className="hover:bg-muted/30">
                  <TableCell className="text-muted-foreground text-xs">#{b.id}</TableCell>
                  <TableCell className="font-medium">{b.customerName}</TableCell>
                  <TableCell className="text-sm">{b.bayName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{fmtDT(b.startTime)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] uppercase tracking-wide ${statusColors[b.status] ?? ""}`}>{b.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {b.totalPrice != null ? `$${Number(b.totalPrice).toFixed(2)}` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function BillingHistoryReport({ onBack }: { onBack: () => void }) {
  const { bookings, loading } = useBookings();
  const billed = bookings.filter((b) => b.totalPrice != null && b.status !== "cancelled");
  const total = billed.reduce((s, b) => s + Number(b.totalPrice), 0);
  return (
    <div>
      <ReportHeader title="Billing History" onBack={onBack} />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">${total.toFixed(2)}</div><div className="text-xs text-muted-foreground">Total collected</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{billed.length}</div><div className="text-xs text-muted-foreground">Transactions</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{billed.length > 0 ? `$${(total / billed.length).toFixed(2)}` : "—"}</div><div className="text-xs text-muted-foreground">Avg transaction</div></CardContent></Card>
      </div>
      {loading ? <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div> : (
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Bay</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billed.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()).map((b) => (
                <TableRow key={b.id} className="hover:bg-muted/30">
                  <TableCell className="text-sm text-muted-foreground">{fmtDT(b.startTime)}</TableCell>
                  <TableCell className="font-medium">{b.customerName}</TableCell>
                  <TableCell className="text-sm">{b.bayName}</TableCell>
                  <TableCell className="text-right font-bold">${Number(b.totalPrice).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function MonthlyRevenueReport({ onBack }: { onBack: () => void }) {
  const { bookings, loading } = useBookings();
  const byMonth: Record<string, number> = {};
  bookings.filter((b) => b.totalPrice && b.status !== "cancelled").forEach((b) => {
    const key = new Date(b.startTime).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    byMonth[key] = (byMonth[key] ?? 0) + Number(b.totalPrice);
  });
  const data = Object.entries(byMonth).map(([month, revenue]) => ({ month, revenue })).slice(-6);
  const total = data.reduce((s, d) => s + d.revenue, 0);
  return (
    <div>
      <ReportHeader title="Monthly Revenue" onBack={onBack} />
      {loading ? <Skeleton className="h-64 w-full" /> : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card><CardContent className="pt-4"><div className="text-2xl font-bold">${total.toFixed(2)}</div><div className="text-xs text-muted-foreground">Total (last 6 months)</div></CardContent></Card>
            <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{data.length > 0 ? `$${(total / data.length).toFixed(2)}` : "—"}</div><div className="text-xs text-muted-foreground">Monthly avg</div></CardContent></Card>
          </div>
          {data.length === 0 ? (
            <div className="border border-dashed rounded-xl p-12 text-center">
              <TrendingUp className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No revenue data to display yet.</p>
            </div>
          ) : (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Revenue by Month</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                    <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function PeakHoursReport({ onBack }: { onBack: () => void }) {
  const { bookings, loading } = useBookings();
  const byHour: Record<number, number> = {};
  bookings.filter((b) => b.status !== "cancelled").forEach((b) => {
    const h = new Date(b.startTime).getHours();
    byHour[h] = (byHour[h] ?? 0) + 1;
  });
  const data = Array.from({ length: 16 }, (_, i) => {
    const h = i + 6;
    const label = h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`;
    return { hour: label, bookings: byHour[h] ?? 0 };
  });
  return (
    <div>
      <ReportHeader title="Peak Hours" onBack={onBack} />
      {loading ? <Skeleton className="h-64 w-full" /> : (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Bookings by Hour of Day</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [v, "Bookings"]} />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PeakDaysReport({ onBack }: { onBack: () => void }) {
  const { bookings, loading } = useBookings();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const byDay: Record<number, number> = {};
  bookings.filter((b) => b.status !== "cancelled").forEach((b) => {
    const d = new Date(b.startTime).getDay();
    byDay[d] = (byDay[d] ?? 0) + 1;
  });
  const data = dayNames.map((day, i) => ({ day: day.slice(0, 3), bookings: byDay[i] ?? 0 }));
  return (
    <div>
      <ReportHeader title="Peak Days" onBack={onBack} />
      {loading ? <Skeleton className="h-64 w-full" /> : (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Bookings by Day of Week</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [v, "Bookings"]} />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PlayerCountsReport({ onBack }: { onBack: () => void }) {
  const { bookings, loading } = useBookings();
  const confirmed = bookings.filter((b) => b.status !== "cancelled");
  return (
    <div>
      <ReportHeader title="Player Counts" onBack={onBack} />
      {loading ? <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-20" />)}</div> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card><CardContent className="pt-4 flex flex-col gap-1"><Users className="h-5 w-5 text-primary mb-1" /><div className="text-2xl font-bold">{confirmed.length}</div><div className="text-xs text-muted-foreground">Total sessions booked</div></CardContent></Card>
          <Card><CardContent className="pt-4 flex flex-col gap-1"><Calendar className="h-5 w-5 text-primary mb-1" /><div className="text-2xl font-bold">{bookings.filter((b) => b.status === "confirmed").length}</div><div className="text-xs text-muted-foreground">Upcoming confirmed</div></CardContent></Card>
          <Card><CardContent className="pt-4 flex flex-col gap-1"><TrendingUp className="h-5 w-5 text-primary mb-1" /><div className="text-2xl font-bold">{bookings.filter((b) => b.status === "cancelled").length}</div><div className="text-xs text-muted-foreground">Cancellations</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}

function EndOfDayReport({ onBack }: { onBack: () => void }) {
  const { bookings, loading } = useBookings();
  const today = new Date().toDateString();
  const todaysBookings = bookings.filter((b) => new Date(b.startTime).toDateString() === today);
  const todaysRevenue = todaysBookings.filter((b) => b.totalPrice && b.status !== "cancelled").reduce((s, b) => s + Number(b.totalPrice), 0);
  return (
    <div>
      <ReportHeader title="End of Day" onBack={onBack} />
      <p className="text-sm text-muted-foreground mb-4">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      {loading ? <div className="space-y-3">{[1,2].map((i) => <Skeleton key={i} className="h-20" />)}</div> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{todaysBookings.length}</div><div className="text-xs text-muted-foreground">Today's bookings</div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-2xl font-bold">${todaysRevenue.toFixed(2)}</div><div className="text-xs text-muted-foreground">Today's revenue</div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{todaysBookings.filter((b) => b.status === "cancelled").length}</div><div className="text-xs text-muted-foreground">Cancellations today</div></CardContent></Card>
        </div>
      )}
      {!loading && todaysBookings.length > 0 && (
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Bay</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todaysBookings.map((b) => (
                <TableRow key={b.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{b.customerName}</TableCell>
                  <TableCell className="text-sm">{b.bayName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{fmtTime(b.startTime)} – {fmtTime(b.endTime)}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] uppercase tracking-wide ${statusColors[b.status] ?? ""}`}>{b.status}</Badge></TableCell>
                  <TableCell className="text-right font-medium">{b.totalPrice != null ? `$${Number(b.totalPrice).toFixed(2)}` : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function OpenBillsReport({ onBack }: { onBack: () => void }) {
  const { bookings, loading } = useBookings();
  const open = bookings.filter((b) => b.status === "pending");
  const total = open.reduce((s, b) => s + (b.totalPrice ? Number(b.totalPrice) : 0), 0);
  return (
    <div>
      <ReportHeader title="Open Bills" onBack={onBack} />
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{open.length}</div><div className="text-xs text-muted-foreground">Open bills</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">${total.toFixed(2)}</div><div className="text-xs text-muted-foreground">Outstanding balance</div></CardContent></Card>
      </div>
      {loading ? <Skeleton className="h-48 w-full" /> : open.length === 0 ? (
        <div className="border border-dashed rounded-xl p-12 text-center">
          <p className="text-muted-foreground text-sm">No open bills at the moment.</p>
        </div>
      ) : (
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Bay</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {open.map((b) => (
                <TableRow key={b.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{b.customerName}</TableCell>
                  <TableCell>{b.bayName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{fmtDT(b.startTime)}</TableCell>
                  <TableCell className="text-right font-bold">{b.totalPrice != null ? `$${Number(b.totalPrice).toFixed(2)}` : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function ShiftReport({ onBack }: { onBack: () => void }) {
  const { bookings, loading } = useBookings();
  const today = new Date().toDateString();
  const todaysRevenue = bookings.filter((b) => new Date(b.startTime).toDateString() === today && b.totalPrice && b.status !== "cancelled").reduce((s, b) => s + Number(b.totalPrice), 0);
  return (
    <div>
      <ReportHeader title="Shift Report" onBack={onBack} />
      <p className="text-sm text-muted-foreground mb-4">Current shift summary — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
      {loading ? <Skeleton className="h-48 w-full" /> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card><CardContent className="pt-4"><div className="text-2xl font-bold">${todaysRevenue.toFixed(2)}</div><div className="text-xs text-muted-foreground">Revenue this shift</div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{bookings.filter((b) => new Date(b.startTime).toDateString() === today).length}</div><div className="text-xs text-muted-foreground">Bookings processed</div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-2xl font-bold">0</div><div className="text-xs text-muted-foreground">Discounts applied</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}

function QuarterlyRevenueReport({ onBack }: { onBack: () => void }) {
  const { bookings, loading } = useBookings();
  const byQ: Record<string, number> = {};
  bookings.filter((b) => b.totalPrice && b.status !== "cancelled").forEach((b) => {
    const d = new Date(b.startTime);
    const q = Math.ceil((d.getMonth() + 1) / 3);
    const key = `Q${q} ${d.getFullYear()}`;
    byQ[key] = (byQ[key] ?? 0) + Number(b.totalPrice);
  });
  const data = Object.entries(byQ).map(([quarter, revenue]) => ({ quarter, revenue }));
  const total = data.reduce((s, d) => s + d.revenue, 0);
  return (
    <div>
      <ReportHeader title="Quarterly Revenue" onBack={onBack} />
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">${total.toFixed(2)}</div><div className="text-xs text-muted-foreground">Total revenue</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{data.length}</div><div className="text-xs text-muted-foreground">Quarters with data</div></CardContent></Card>
      </div>
      {loading ? <Skeleton className="h-64 w-full" /> : data.length === 0 ? (
        <div className="border border-dashed rounded-xl p-12 text-center">
          <p className="text-muted-foreground text-sm">No revenue data yet.</p>
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Revenue by Quarter</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CategoryPerformanceReport({ onBack }: { onBack: () => void }) {
  const { bookings, loading } = useBookings();
  const byStatus: Record<string, { count: number; revenue: number }> = {};
  bookings.forEach((b) => {
    if (!byStatus[b.status]) byStatus[b.status] = { count: 0, revenue: 0 };
    byStatus[b.status].count++;
    if (b.totalPrice) byStatus[b.status].revenue += Number(b.totalPrice);
  });
  const data = Object.entries(byStatus).map(([status, { count, revenue }]) => ({ status, count, revenue }));
  return (
    <div>
      <ReportHeader title="Category Performance" onBack={onBack} />
      {loading ? <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-20" />)}</div> : (
        <div className="space-y-4">
          <div className="border rounded-md bg-card">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.status} className="hover:bg-muted/30">
                    <TableCell><Badge variant="outline" className={`text-[10px] uppercase tracking-wide ${statusColors[row.status] ?? ""}`}>{row.status}</Badge></TableCell>
                    <TableCell className="font-medium">{row.count}</TableCell>
                    <TableCell className="text-right font-bold">${row.revenue.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Reports() {
  const [view, setView] = useState<ReportView>(null);

  if (view === "booking-history") return <BookingHistoryReport onBack={() => setView(null)} />;
  if (view === "billing-history") return <BillingHistoryReport onBack={() => setView(null)} />;
  if (view === "end-of-day") return <EndOfDayReport onBack={() => setView(null)} />;
  if (view === "open-bills") return <OpenBillsReport onBack={() => setView(null)} />;
  if (view === "shift-report") return <ShiftReport onBack={() => setView(null)} />;
  if (view === "monthly-revenue") return <MonthlyRevenueReport onBack={() => setView(null)} />;
  if (view === "quarterly-revenue") return <QuarterlyRevenueReport onBack={() => setView(null)} />;
  if (view === "category-performance") return <CategoryPerformanceReport onBack={() => setView(null)} />;
  if (view === "peak-hours") return <PeakHoursReport onBack={() => setView(null)} />;
  if (view === "peak-days") return <PeakDaysReport onBack={() => setView(null)} />;
  if (view === "player-counts") return <PlayerCountsReport onBack={() => setView(null)} />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Select a Report</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section, index) => (
          <Card key={index} className="border-none shadow-md">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center gap-2">
                {section.icon}
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {section.reports.map((report, rIndex) => (
                  <button
                    key={rIndex}
                    className="w-full text-left p-4 hover:bg-muted/50 cursor-pointer transition-colors group"
                    onClick={() => setView(report.id)}
                  >
                    <div className="font-medium group-hover:text-primary transition-colors">{report.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">{report.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
