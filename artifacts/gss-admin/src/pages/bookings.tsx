import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Search, Plus, CalendarDays, Edit2, Trash2, ChevronLeft, ChevronRight, Filter, List } from "lucide-react";

interface Booking {
  id: number;
  bayId: number | null;
  customerName: string;
  customerEmail: string | null;
  startTime: string;
  endTime: string;
  status: string;
  notes: string | null;
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

const calendarBlockColors: Record<string, string> = {
  confirmed: "bg-green-500 text-white",
  pending: "bg-yellow-400 text-yellow-900",
  cancelled: "bg-red-400 text-white opacity-60",
  completed: "bg-blue-500 text-white",
};

// Hours displayed in the calendar: 6 AM – 10 PM
const START_HOUR = 6;
const END_HOUR = 22;
const SLOT_HEIGHT = 48; // px per hour

const toLocal = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
};

const toInputDateTime = (iso: string) => new Date(iso).toISOString().slice(0, 16);

const now = () => {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  return d.toISOString().slice(0, 16);
};
const oneHourLater = () => {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return d.toISOString().slice(0, 16);
};

const emptyForm = {
  customerName: "",
  customerEmail: "",
  bayId: "",
  startTime: now(),
  endTime: oneHourLater(),
  status: "confirmed",
  notes: "",
  totalPrice: "",
};

const hourLabel = (h: number) => {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
};

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bays, setBays] = useState<Bay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedBay, setSelectedBay] = useState<string>("all");

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/bookings", { credentials: "include" }).then((r) => r.ok ? r.json() : []),
      fetch("/api/bays", { credentials: "include" }).then((r) => r.ok ? r.json() : []),
    ]).then(([bookingsData, baysData]) => {
      setBookings(bookingsData);
      setBays(baysData);
      setLoading(false);
    }).catch((e) => { setError(String(e)); setLoading(false); });
  };

  useEffect(() => { loadData(); }, []);

  const getBayName = (id: number | null) => {
    if (id == null) return "—";
    return bays.find((b) => b.id === id)?.name ?? `Bay #${id}`;
  };

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const bayMatch = selectedBay === "all" || String(b.bayId ?? "") === selectedBay;
    return bayMatch && (
      b.customerName.toLowerCase().includes(q) ||
      (b.customerEmail ?? "").toLowerCase().includes(q) ||
      getBayName(b.bayId).toLowerCase().includes(q)
    );
  });

  const dayBookings = useMemo(() => {
    const dateKey = selectedDate.toDateString();
    return filtered.filter((b) => new Date(b.startTime).toDateString() === dateKey);
  }, [filtered, selectedDate]);

  // Bays to show in calendar (max 6)
  const calendarBays = bays.length > 0 ? bays.slice(0, 6) : [
    { id: -1, name: "Bay 1" }, { id: -2, name: "Bay 2" }, { id: -3, name: "Bay 3" },
  ];

  const openCreate = () => {
    setEditingBooking(null);
    setForm({ ...emptyForm, startTime: now(), endTime: oneHourLater() });
    setDialogOpen(true);
  };

  const openEdit = (b: Booking) => {
    setEditingBooking(b);
    setForm({
      customerName: b.customerName,
      customerEmail: b.customerEmail ?? "",
      bayId: b.bayId != null ? String(b.bayId) : "",
      startTime: toInputDateTime(b.startTime),
      endTime: toInputDateTime(b.endTime),
      status: b.status,
      notes: b.notes ?? "",
      totalPrice: b.totalPrice ?? "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const body = {
      customerName: form.customerName,
      customerEmail: form.customerEmail || null,
      bayId: form.bayId ? Number(form.bayId) : null,
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString(),
      status: form.status,
      notes: form.notes || null,
      totalPrice: form.totalPrice || null,
    };
    const url = editingBooking ? `/api/bookings/${editingBooking.id}` : "/api/bookings";
    const method = editingBooking ? "PUT" : "POST";
    await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    setDialogOpen(false);
    loadData();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/bookings/${id}`, { method: "DELETE", credentials: "include" });
    setDeleteId(null);
    loadData();
  };

  // Position a booking as a CSS block within the calendar grid column
  const getBookingStyle = (booking: Booking) => {
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    const clampedStart = Math.max(startHour, START_HOUR);
    const clampedEnd = Math.min(endHour, END_HOUR);
    const top = (clampedStart - START_HOUR) * SLOT_HEIGHT;
    const height = Math.max((clampedEnd - clampedStart) * SLOT_HEIGHT - 2, 20);
    return { top, height };
  };

  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
  const totalHeight = (END_HOUR - START_HOUR) * SLOT_HEIGHT;

  const currentTime = new Date();
  const todayCurrentOffset =
    selectedDate.toDateString() === currentTime.toDateString()
      ? (currentTime.getHours() + currentTime.getMinutes() / 60 - START_HOUR) * SLOT_HEIGHT
      : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Booking Calendar</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Schedule bays, search bookings, and manage events in one view</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Create Booking / Event
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email or bay"
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedBay} onValueChange={setSelectedBay}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="All bays" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All bays</SelectItem>
                {bays.map((bay) => <SelectItem key={bay.id} value={String(bay.id)}>{bay.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
            <div className="flex items-center rounded-md overflow-hidden border">
              <Button variant={view === "calendar" ? "default" : "ghost"} size="sm" className="rounded-none" onClick={() => setView("calendar")}>
                <CalendarDays className="h-4 w-4 mr-2" />Calendar
              </Button>
              <Button variant={view === "list" ? "default" : "ghost"} size="sm" className="rounded-none" onClick={() => setView("list")}>
                <List className="h-4 w-4 mr-2" />List
              </Button>
            </div>
          </div>
        </div>

        {view === "calendar" && (
          <div className="flex flex-col xl:flex-row gap-4">
            {/* Mini calendar */}
            <div className="xl:w-[290px] rounded-xl border p-3 bg-muted/20 flex-shrink-0">
              <Calendar mode="single" selected={selectedDate} onSelect={(d) => d && setSelectedDate(d)} className="w-full" />
            </div>

            {/* Main grid */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setSelectedDate((d) => new Date(d.getTime() - 86400000))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>Today</Button>
                  <Button variant="outline" size="icon" onClick={() => setSelectedDate((d) => new Date(d.getTime() + 86400000))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {loading && <Skeleton className="h-64 w-full" />}

              {!loading && (
                <div className="overflow-x-auto rounded-xl border bg-background">
                  <div style={{ minWidth: `${60 + calendarBays.length * 160}px` }}>
                    {/* Header row */}
                    <div
                      className="grid border-b bg-muted/30 text-xs font-semibold uppercase tracking-wide sticky top-0 z-10"
                      style={{ gridTemplateColumns: `60px repeat(${calendarBays.length}, minmax(160px, 1fr))` }}
                    >
                      <div className="px-3 py-2 text-muted-foreground" />
                      {calendarBays.map((bay) => (
                        <div key={bay.id} className="px-3 py-2.5 text-center border-l truncate">{bay.name}</div>
                      ))}
                    </div>

                    {/* Time grid body */}
                    <div className="relative" style={{ height: totalHeight }}>
                      {/* Hour lines + labels */}
                      {hours.map((h) => (
                        <div
                          key={h}
                          className="absolute left-0 right-0 border-t border-border/40 flex"
                          style={{ top: (h - START_HOUR) * SLOT_HEIGHT }}
                        >
                          <div className="w-[60px] px-2 text-[11px] text-muted-foreground -mt-2 select-none">
                            {hourLabel(h)}
                          </div>
                          {calendarBays.map((bay) => (
                            <div
                              key={bay.id}
                              className="flex-1 border-l border-border/20"
                              style={{ height: SLOT_HEIGHT }}
                            />
                          ))}
                        </div>
                      ))}

                      {/* Current time indicator */}
                      {todayCurrentOffset !== null && todayCurrentOffset >= 0 && todayCurrentOffset <= totalHeight && (
                        <div
                          className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
                          style={{ top: todayCurrentOffset }}
                        >
                          <div className="w-[60px] flex justify-end pr-1">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                          </div>
                          <div className="flex-1 border-t-2 border-red-500" />
                        </div>
                      )}

                      {/* Booking blocks */}
                      {calendarBays.map((bay, colIdx) => {
                        const bayBookings = dayBookings.filter((b) => b.bayId === bay.id);
                        return bayBookings.map((booking) => {
                          const { top, height } = getBookingStyle(booking);
                          if (top >= totalHeight || top + height <= 0) return null;
                          const colorClass = calendarBlockColors[booking.status] ?? "bg-gray-500 text-white";
                          const colStart = 60 + colIdx * (100 / calendarBays.length) + "%";
                          return (
                            <div
                              key={booking.id}
                              className={`absolute z-10 rounded-md px-2 py-1 text-xs font-medium cursor-pointer shadow-sm overflow-hidden ${colorClass}`}
                              style={{
                                top: top + 1,
                                height: height,
                                left: `calc(60px + ${(colIdx / calendarBays.length) * 100}%)`,
                                width: `calc(${(1 / calendarBays.length) * 100}% - 4px)`,
                              }}
                              onClick={() => openEdit(booking)}
                              title={`${booking.customerName} — ${getBayName(booking.bayId)}`}
                            >
                              <div className="font-semibold truncate leading-tight">{booking.customerName}</div>
                              {height > 30 && (
                                <div className="opacity-80 truncate leading-tight mt-0.5">
                                  {new Date(booking.startTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                                  {" – "}
                                  {new Date(booking.endTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                                </div>
                              )}
                            </div>
                          );
                        });
                      })}
                    </div>
                  </div>
                </div>
              )}

              {!loading && dayBookings.length === 0 && (
                <div className="border border-dashed rounded-xl p-8 text-center mt-3">
                  <CalendarDays className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No bookings on this date. <button className="text-primary underline underline-offset-2" onClick={openCreate}>Create one →</button></p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {loading && view === "list" && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}

      {!loading && !error && view === "list" && bookings.length === 0 && (
        <div className="border border-dashed rounded-xl p-12 text-center">
          <CalendarDays className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No bookings yet</h3>
          <p className="text-muted-foreground text-sm mb-4">Create bookings to track bay usage and customer sessions.</p>
          <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Create Booking</Button>
        </div>
      )}

      {!loading && !error && view === "list" && bookings.length > 0 && (
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Bay</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No bookings match "{search}"</TableCell>
                </TableRow>
              ) : filtered.map((b) => (
                <TableRow key={b.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="font-medium">{b.customerName}</div>
                    {b.customerEmail && <div className="text-xs text-muted-foreground">{b.customerEmail}</div>}
                  </TableCell>
                  <TableCell className="text-sm">{getBayName(b.bayId)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{toLocal(b.startTime)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{toLocal(b.endTime)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${statusColors[b.status] ?? ""} uppercase text-[10px] tracking-wider`}>{b.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{b.totalPrice ? `$${Number(b.totalPrice).toFixed(2)}` : "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(b)}><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(b.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingBooking ? "Edit Booking" : "Create Booking"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Customer Name <span className="text-destructive">*</span></Label>
                <Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Full name" />
              </div>
              <div className="space-y-1.5">
                <Label>Customer Email</Label>
                <Input type="email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} placeholder="Optional" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Bay</Label>
              <Select value={form.bayId} onValueChange={(v) => setForm({ ...form, bayId: v })}>
                <SelectTrigger><SelectValue placeholder="Select a bay" /></SelectTrigger>
                <SelectContent>
                  {bays.map((bay) => <SelectItem key={bay.id} value={String(bay.id)}>{bay.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Start Time <span className="text-destructive">*</span></Label>
                <Input type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>End Time <span className="text-destructive">*</span></Label>
                <Input type="datetime-local" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Total Price ($)</Label>
                <Input type="number" min="0" step="0.01" value={form.totalPrice} onChange={(e) => setForm({ ...form, totalPrice: e.target.value })} placeholder="e.g. 75.00" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.customerName.trim() || !form.startTime || !form.endTime}>
              {saving ? "Saving…" : editingBooking ? "Save Changes" : "Create Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete booking?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently remove this booking.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId !== null && handleDelete(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
