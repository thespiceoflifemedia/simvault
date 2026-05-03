import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, Tag, Search, Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DiscountCode {
  id: number;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  active: boolean;
}

const emptyForm = { code: "", type: "percent" as DiscountCode["type"], value: "", minOrder: "", maxUses: "", expiresAt: "", active: true };

export default function DiscountCodes() {
  const { toast } = useToast();
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<DiscountCode | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const loadCodes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/discount-codes", { credentials: "include" });
      if (res.ok) setCodes(await res.json());
    } catch (e) {
      toast({ title: "Failed to load codes", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { loadCodes(); }, []);

  const filtered = codes.filter((c) => {
    const q = search.toLowerCase();
    return c.code.toLowerCase().includes(q);
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, code: generateCode() });
    setDialogOpen(true);
  };

  const openEdit = (c: DiscountCode) => {
    setEditing(c);
    setForm({
      code: c.code,
      type: c.type,
      value: String(c.value),
      minOrder: c.minOrder !== null ? String(c.minOrder) : "",
      maxUses: c.maxUses !== null ? String(c.maxUses) : "",
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : "",
      active: c.active,
    });
    setDialogOpen(true);
  };

  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const handleSave = async () => {
    const val = parseFloat(form.value);
    if (!form.code.trim() || isNaN(val)) return;
    setSaving(true);
    const body = {
      code: form.code.toUpperCase().trim(),
      type: form.type,
      value: val,
      minOrder: form.minOrder ? parseFloat(form.minOrder) : null,
      maxUses: form.maxUses ? parseInt(form.maxUses) : null,
      expiresAt: form.expiresAt || null,
      active: form.active,
    };
    try {
      if (editing) {
        await fetch(`/api/discount-codes/${editing.id}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } else {
        await fetch("/api/discount-codes", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      }
      setDialogOpen(false);
      loadCodes();
      toast({ title: editing ? "Code updated" : "Code created" });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/discount-codes/${id}`, { method: "DELETE", credentials: "include" });
    setDeleteId(null);
    loadCodes();
    toast({ title: "Code deleted" });
  };

  const toggleActive = async (id: number) => {
    const code = codes.find((c) => c.id === id);
    if (!code) return;
    await fetch(`/api/discount-codes/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...code, active: !code.active }),
    });
    loadCodes();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => toast({ title: `Copied: ${code}` }));
  };

  const usagePercent = (c: DiscountCode) => {
    if (!c.maxUses) return null;
    return Math.round((c.usedCount / c.maxUses) * 100);
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Discount Codes</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Promo codes and coupon management</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1.5" />Create Code</Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search codes…" className="pl-8 bg-card" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed rounded-xl p-12 text-center">
          <Tag className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No discount codes</h3>
          <p className="text-muted-foreground text-sm mb-4">Create codes to offer discounts to your customers.</p>
          <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1.5" />Create Code</Button>
        </div>
      ) : (
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const pct = usagePercent(c);
                return (
                  <TableRow key={c.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-primary" />
                        <span className="font-mono font-bold text-primary">{c.code}</span>
                        <button onClick={() => copyCode(c.code)} className="text-muted-foreground hover:text-foreground transition-colors">
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {c.type === "percent" ? `${c.value}% off` : `$${c.value.toFixed(2)} off`}
                      {c.minOrder && <div className="text-[10px] text-muted-foreground">min ${c.minOrder} order</div>}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""} uses</div>
                      {pct !== null && (
                        <div className="mt-1 h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${pct >= 90 ? "bg-red-500" : pct >= 60 ? "bg-amber-500" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.expiresAt ? fmt(c.expiresAt) : "No expiry"}
                    </TableCell>
                    <TableCell>
                      <Switch checked={c.active} onCheckedChange={() => toggleActive(c.id)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Edit2 className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Code" : "Create Code"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>Code <span className="text-destructive">*</span></Label>
                <button type="button" className="text-xs text-primary hover:underline" onClick={() => setForm({ ...form, code: generateCode() })}>Generate random</button>
              </div>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. SUMMER25" className="font-mono font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as DiscountCode["type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Percentage off</SelectItem>
                    <SelectItem value="fixed">Fixed $ amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Value <span className="text-destructive">*</span></Label>
                <Input type="number" min="0" step={form.type === "percent" ? "1" : "0.01"} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="e.g. 20" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Min. Order ($)</Label>
                <Input type="number" min="0" step="0.01" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} placeholder="No minimum" />
              </div>
              <div className="space-y-1.5">
                <Label>Max Uses</Label>
                <Input type="number" min="1" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder="Unlimited" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Expiry Date</Label>
              <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
            </div>
            <div className="flex items-center gap-3">
              <Switch id="code-active" checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              <Label htmlFor="code-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.code.trim() || !form.value}>{editing ? "Save Changes" : "Create Code"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete code?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This code will be permanently removed.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId !== null && handleDelete(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
