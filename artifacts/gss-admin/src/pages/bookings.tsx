import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, CalendarDays, Edit2, Trash2 } from "lucide-react";

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
    return (
      b.customerName.toLowerCase().includes(q) ||
      (b.customerEmail ?? "").toLowerCase().includes(q) ||
      getBayName(b.bayId).toLowerCase().includes(q)
    );
  });

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Create Booking
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bookings..."
            className="pl-8 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <div className="border border-dashed rounded-xl p-12 text-center">
          <CalendarDays className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No bookings yet</h3>
          <p className="text-muted-foreground text-sm mb-4">Create bookings to track bay usage and customer sessions.</p>
          <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Create Booking</Button>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
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
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No bookings match "{search}"
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((b) => (
                  <TableRow key={b.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="font-medium">{b.customerName}</div>
                      {b.customerEmail && <div className="text-xs text-muted-foreground">{b.customerEmail}</div>}
                    </TableCell>
                    <TableCell className="text-sm">{getBayName(b.bayId)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{toLocal(b.startTime)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{toLocal(b.endTime)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${statusColors[b.status] ?? ""} uppercase text-[10px] tracking-wider`}>
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {b.totalPrice ? `$${Number(b.totalPrice).toFixed(2)}` : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(b)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(b.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create / Edit dialog */}
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
                  {bays.map((bay) => (
                    <SelectItem key={bay.id} value={String(bay.id)}>{bay.name}</SelectItem>
                  ))}
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

      {/* Delete dialog */}
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
