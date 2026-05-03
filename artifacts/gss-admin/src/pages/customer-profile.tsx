import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronLeft, Mail, Phone, FileText, CalendarDays, CreditCard,
  Edit2, Trash2, MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  notes: string | null;
  createdAt?: string;
}

interface Booking {
  id: number;
  bayId: number | null;
  bayName?: string;
  customerName: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: string | null;
}

interface Membership {
  id: number;
  customerName: string;
  plan: string;
  status: string;
  startDate: string;
  endDate: string | null;
  autoRenew: boolean;
}

interface Bay { id: number; name: string; }

const statusColors: Record<string, string> = {
  confirmed: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
};
const membershipStatusColors: Record<string, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  inactive: "bg-gray-50 text-gray-500 border-gray-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
};

const fmtDT = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
  " · " + new Date(d).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function CustomerProfile({ params }: { params?: { id?: string } }) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const customerId = params?.id ? parseInt(params.id) : null;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [bays, setBays] = useState<Bay[]>([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const load = async () => {
    if (!customerId) return;
    setLoading(true);
    const [cust, allBookings, allMemberships, allBays] = await Promise.all([
      fetch(`/api/customers/${customerId}`, { credentials: "include" }).then((r) => r.ok ? r.json() : null),
      fetch("/api/bookings", { credentials: "include" }).then((r) => r.ok ? r.json() : []),
      fetch("/api/memberships", { credentials: "include" }).then((r) => r.ok ? r.json() : []),
      fetch("/api/bays", { credentials: "include" }).then((r) => r.ok ? r.json() : []),
    ]);
    setCustomer(cust);
    setBays(allBays);
    if (cust) {
      const name = cust.name.toLowerCase();
      setBookings(
        (allBookings as Booking[])
          .filter((b) => b.customerName.toLowerCase() === name)
          .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      );
      setMemberships(
        (allMemberships as Membership[]).filter((m) => m.customerName.toLowerCase() === name)
      );
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [customerId]);

  const getBayName = (id: number | null) => {
    if (id == null) return "—";
    return bays.find((b) => b.id === id)?.name ?? `Bay #${id}`;
  };

  const openEdit = () => {
    if (!customer) return;
    setForm({ name: customer.name, email: customer.email, phone: customer.phone ?? "", notes: customer.notes ?? "" });
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!customer) return;
    setSaving(true);
    await fetch(`/api/customers/${customer.id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone || null, notes: form.notes || null }),
    });
    setSaving(false);
    setEditOpen(false);
    toast({ title: "Customer updated" });
    load();
  };

  const handleDelete = async () => {
    if (!customer) return;
    await fetch(`/api/customers/${customer.id}`, { method: "DELETE", credentials: "include" });
    toast({ title: "Customer removed" });
    navigate("/admin/customers");
  };

  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled" && b.totalPrice)
    .reduce((s, b) => s + Number(b.totalPrice), 0);

  const initials = customer?.name
    ? customer.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" size="sm" className="mb-4 gap-1" onClick={() => navigate("/admin/customers")}>
          <ChevronLeft className="h-4 w-4" /> Back to Customers
        </Button>
        <p className="text-muted-foreground">Customer not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" className="mb-4 gap-1 text-muted-foreground" onClick={() => navigate("/admin/customers")}>
          <ChevronLeft className="h-4 w-4" /> Customers
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold flex-shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>
              <p className="text-muted-foreground text-sm">{customer.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={openEdit}>
              <Edit2 className="h-4 w-4 mr-1.5" /> Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Customer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Bookings</span>
            </div>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Upcoming</span>
            </div>
            <div className="text-2xl font-bold">
              {bookings.filter((b) => b.status === "confirmed" && new Date(b.startTime) > new Date()).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-muted-foreground">Memberships</span>
            </div>
            <div className="text-2xl font-bold">{memberships.filter((m) => m.status === "active").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Total Revenue</span>
            </div>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: contact info */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <a href={`mailto:${customer.email}`} className="text-primary hover:underline break-all">{customer.email}</a>
              </div>
              {customer.phone && (
                <div className="flex items-start gap-2.5">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <a href={`tel:${customer.phone}`} className="hover:underline">{customer.phone}</a>
                </div>
              )}
              {customer.notes && (
                <div className="flex items-start gap-2.5">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{customer.notes}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active memberships */}
          {memberships.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Memberships</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {memberships.map((m) => (
                  <div key={m.id} className="border rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate">{m.plan}</span>
                      <Badge variant="outline" className={`text-[10px] uppercase tracking-wide ${membershipStatusColors[m.status] ?? ""}`}>
                        {m.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Since {fmtDate(m.startDate)}
                      {m.autoRenew ? " · Auto-renew" : m.endDate ? ` · Ends ${fmtDate(m.endDate)}` : ""}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: booking history */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Booking History ({bookings.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {bookings.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <CalendarDays className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No bookings yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Bay</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((b) => (
                      <TableRow key={b.id} className="hover:bg-muted/30">
                        <TableCell className="text-sm">{fmtDT(b.startTime)}</TableCell>
                        <TableCell className="text-sm">{getBayName(b.bayId)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] uppercase tracking-wide ${statusColors[b.status] ?? ""}`}>
                            {b.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium text-sm">
                          {b.totalPrice ? `$${Number(b.totalPrice).toFixed(2)}` : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Customer</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Name <span className="text-destructive">*</span></Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Email <span className="text-destructive">*</span></Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Optional" />
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name.trim() || !form.email.trim()}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete customer?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently remove {customer.name} from your facility. Their booking history will remain in the system.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
