import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, CreditCard, Edit2, Trash2 } from "lucide-react";

interface Membership {
  id: number;
  customerName: string;
  customerEmail: string | null;
  plan: string;
  status: string;
  startDate: string;
  endDate: string | null;
  autoRenew: boolean;
}

const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = {
  customerName: "",
  customerEmail: "",
  plan: "",
  status: "active",
  startDate: today(),
  endDate: "",
  autoRenew: true,
};

const statusColors: Record<string, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  inactive: "bg-gray-50 text-gray-500 border-gray-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
};

export default function Memberships() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState<Membership | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadMemberships = () => {
    setLoading(true);
    fetch("/api/memberships", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject("Failed to load")))
      .then((data) => { setMemberships(data); setLoading(false); })
      .catch((e) => { setError(String(e)); setLoading(false); });
  };

  useEffect(() => { loadMemberships(); }, []);

  const openCreate = () => {
    setEditingMembership(null);
    setForm({ ...emptyForm, startDate: today() });
    setDialogOpen(true);
  };

  const openEdit = (m: Membership) => {
    setEditingMembership(m);
    setForm({
      customerName: m.customerName,
      customerEmail: m.customerEmail ?? "",
      plan: m.plan,
      status: m.status,
      startDate: m.startDate.slice(0, 10),
      endDate: m.endDate ? m.endDate.slice(0, 10) : "",
      autoRenew: m.autoRenew,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const body = {
      customerName: form.customerName,
      customerEmail: form.customerEmail || null,
      plan: form.plan,
      status: form.status,
      startDate: new Date(form.startDate).toISOString(),
      endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
      autoRenew: form.autoRenew,
    };
    const url = editingMembership ? `/api/memberships/${editingMembership.id}` : "/api/memberships";
    const method = editingMembership ? "PUT" : "POST";
    await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    setDialogOpen(false);
    loadMemberships();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/memberships/${id}`, { method: "DELETE", credentials: "include" });
    setDeleteId(null);
    loadMemberships();
  };

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Memberships</h1>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Membership
        </Button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}

      {!loading && !error && memberships.length === 0 && (
        <div className="border border-dashed rounded-xl p-12 text-center">
          <CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No memberships yet</h3>
          <p className="text-muted-foreground text-sm mb-4">Create memberships for your customers to enable recurring access and loyalty benefits.</p>
          <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Membership</Button>
        </div>
      )}

      {!loading && memberships.length > 0 && (
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>Renews</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberships.map((m) => (
                <TableRow key={m.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="font-medium">{m.customerName}</div>
                    {m.customerEmail && <div className="text-xs text-muted-foreground">{m.customerEmail}</div>}
                  </TableCell>
                  <TableCell className="text-sm font-medium">{m.plan}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${statusColors[m.status] ?? ""} uppercase text-[10px] tracking-wider`}>
                      {m.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{fmt(m.startDate)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {m.autoRenew ? "Auto-renew" : m.endDate ? fmt(m.endDate) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(m)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(m.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMembership ? "Edit Membership" : "Add Membership"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Customer Name <span className="text-destructive">*</span></Label>
              <Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Full name" />
            </div>
            <div className="space-y-1.5">
              <Label>Customer Email</Label>
              <Input type="email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} placeholder="Optional" />
            </div>
            <div className="space-y-1.5">
              <Label>Plan <span className="text-destructive">*</span></Label>
              <Input value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} placeholder="e.g. Monthly Unlimited, Annual Premium" />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Start Date <span className="text-destructive">*</span></Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="auto-renew" checked={form.autoRenew} onCheckedChange={(v) => setForm({ ...form, autoRenew: v })} />
              <Label htmlFor="auto-renew">Auto-renew</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.customerName.trim() || !form.plan.trim() || !form.startDate}>
              {saving ? "Saving…" : editingMembership ? "Save Changes" : "Add Membership"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete membership?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently remove this membership record.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId !== null && handleDelete(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
