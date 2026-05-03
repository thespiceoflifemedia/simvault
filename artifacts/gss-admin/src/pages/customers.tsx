import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Users, Edit2, Trash2, ExternalLink, Download, Upload } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  notes: string | null;
  createdAt: string;
}

const emptyForm = { name: "", email: "", phone: "", notes: "" };

export default function Customers() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadCustomers = () => {
    setLoading(true);
    fetch("/api/customers", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject("Failed to load")))
      .then((data) => { setCustomers(data); setLoading(false); })
      .catch((e) => { setError(String(e)); setLoading(false); });
  };

  useEffect(() => { loadCustomers(); }, []);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone ?? "").toLowerCase().includes(q)
    );
  });

  const openCreate = () => { setEditingCustomer(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (c: Customer) => { setEditingCustomer(c); setForm({ name: c.name, email: c.email, phone: c.phone ?? "", notes: c.notes ?? "" }); setDialogOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    const body = { name: form.name, email: form.email, phone: form.phone || null, notes: form.notes || null };
    const url = editingCustomer ? `/api/customers/${editingCustomer.id}` : "/api/customers";
    const method = editingCustomer ? "PUT" : "POST";
    await fetch(url, { method, credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    setDialogOpen(false);
    loadCustomers();
    toast({ title: editingCustomer ? "Customer updated" : "Customer added" });
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/customers/${id}`, { method: "DELETE", credentials: "include" });
    setDeleteId(null);
    loadCustomers();
    toast({ title: "Customer removed" });
  };

  const exportCSV = () => {
    const rows = [
      ["Name", "Email", "Phone", "Notes", "Joined"],
      ...customers.map((c) => [c.name, c.email, c.phone ?? "", c.notes ?? "", new Date(c.createdAt).toLocaleDateString()]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "customers.csv"; a.click();
    URL.revokeObjectURL(url);
    toast({ title: `Exported ${customers.length} customers` });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim().toLowerCase());
    const nameIdx = headers.indexOf("name");
    const emailIdx = headers.indexOf("email");
    const phoneIdx = headers.indexOf("phone");
    const notesIdx = headers.indexOf("notes");
    if (nameIdx < 0 || emailIdx < 0) { toast({ title: "CSV must have Name and Email columns", variant: "destructive" }); return; }
    let imported = 0;
    for (const line of lines.slice(1)) {
      const cols = line.split(",").map((c) => c.replace(/"/g, "").trim());
      const name = cols[nameIdx]; const email = cols[emailIdx];
      if (!name || !email) continue;
      await fetch("/api/customers", {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: phoneIdx >= 0 ? cols[phoneIdx] || null : null, notes: notesIdx >= 0 ? cols[notesIdx] || null : null }),
      });
      imported++;
    }
    loadCustomers();
    if (fileRef.current) fileRef.current.value = "";
    toast({ title: `Imported ${imported} customers` });
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{customers.length} customer{customers.length !== 1 ? "s" : ""} total</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-1.5" />Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4 mr-1.5" />Import CSV
          </Button>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleUpload} />
          <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1.5" />Add Customer</Button>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, email, or phone…" className="pl-8 bg-card" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading && <div className="space-y-3">{[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>}

      {error && <div className="border border-destructive/20 rounded-xl p-6 text-destructive text-sm text-center">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="border border-dashed rounded-xl p-12 text-center">
          <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-1">{search ? "No customers match your search" : "No customers yet"}</h3>
          <p className="text-muted-foreground text-sm mb-4">
            {search ? "Try a different search term." : "Add your first customer or import from a CSV file."}
          </p>
          {!search && <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1.5" />Add Customer</Button>}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow
                  key={c.id}
                  className="hover:bg-muted/30 cursor-pointer"
                  onClick={() => navigate(`/admin/customers/${c.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-sm">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{c.email}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.phone ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">{c.notes ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{fmt(c.createdAt)}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={(e) => { e.stopPropagation(); navigate(`/admin/customers/${c.id}`); }}>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); openEdit(c); }}>
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteId(c.id); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingCustomer ? "Edit Customer" : "Add Customer"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Full Name <span className="text-destructive">*</span></Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Jane Smith" />
            </div>
            <div className="space-y-1.5">
              <Label>Email <span className="text-destructive">*</span></Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
            </div>
            <div className="space-y-1.5">
              <Label>Internal Notes</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes visible only to staff…" className="resize-none min-h-[80px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name.trim() || !form.email.trim()}>
              {saving ? "Saving…" : editingCustomer ? "Save Changes" : "Add Customer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Remove customer?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This customer and all their data will be permanently removed.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId !== null && handleDelete(deleteId)}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
