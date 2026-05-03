import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, Ticket, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Pass {
  id: number;
  type: string;
  quantity: number;
  price: number;
  remaining: number;
  expiresAt: string | null;
  status: string;
  customerName: string;
}

const emptyForm = { type: "", quantity: "", price: "", remaining: "", expiresAt: "", customerName: "" };

export default function Passes() {
  const { toast } = useToast();
  const [passes, setPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Pass | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [issueOpen, setIssueOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [issueForm, setIssueForm] = useState({ customerName: "", type: "", quantity: "" });

  const loadPasses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/passes", { credentials: "include" });
      if (res.ok) setPasses(await res.json());
    } catch (e) {
      toast({ title: "Failed to load passes", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { loadPasses(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (p: Pass) => {
    setEditing(p);
    setForm({ type: p.type, quantity: String(p.quantity), price: String(p.price), remaining: String(p.remaining), expiresAt: p.expiresAt ? p.expiresAt.slice(0, 10) : "", customerName: p.customerName });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const qty = parseInt(form.quantity);
    const price = parseFloat(form.price);
    if (!form.type.trim() || isNaN(qty) || isNaN(price)) return;
    setSaving(true);
    const body = { type: form.type, quantity: qty, price, remaining: form.remaining ? parseInt(form.remaining) : qty, expiresAt: form.expiresAt || null, customerName: form.customerName };
    try {
      if (editing) {
        await fetch(`/api/passes/${editing.id}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } else {
        await fetch("/api/passes", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      }
      setDialogOpen(false);
      loadPasses();
      toast({ title: editing ? "Pass updated" : "Pass created" });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/passes/${id}`, { method: "DELETE", credentials: "include" });
    setDeleteId(null);
    loadPasses();
    toast({ title: "Pass removed" });
  };

  const handleIssue = async () => {
    if (!issueForm.customerName.trim() || !issueForm.type || !issueForm.quantity) return;
    setSaving(true);
    try {
      await fetch("/api/passes", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: issueForm.type, quantity: parseInt(issueForm.quantity), customerName: issueForm.customerName, remaining: parseInt(issueForm.quantity), price: 0 }),
      });
      setIssueOpen(false);
      loadPasses();
      toast({ title: `Pass issued to ${issueForm.customerName}` });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
    setSaving(false);
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  const statusColors: Record<string, string> = {
    active: "bg-green-50 text-green-700 border-green-200",
    inactive: "bg-gray-50 text-gray-500 border-gray-200",
    expired: "bg-gray-50 text-gray-500 border-gray-200",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Passes</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Pre-purchased session packs and credit bundles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIssueOpen(true)}><Ticket className="h-4 w-4 mr-1.5" />Issue Pass</Button>
          <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1.5" />New Pass</Button>
        </div>
      </div>

      <Tabs defaultValue="issued">
        <TabsList>
          <TabsTrigger value="issued">Issued Passes ({passes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="issued" className="mt-4">
          {passes.length === 0 ? (
            <div className="border border-dashed rounded-xl p-12 text-center">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">No passes issued</h3>
              <p className="text-muted-foreground text-sm mb-4">Issue passes to customers to get started.</p>
              <Button onClick={() => setIssueOpen(true)}><Ticket className="h-4 w-4 mr-1.5" />Issue Pass</Button>
            </div>
          ) : (
            <div className="border rounded-md bg-card">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passes.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{p.customerName}</TableCell>
                      <TableCell className="text-sm">{p.type}</TableCell>
                      <TableCell className="text-sm">{p.quantity}</TableCell>
                      <TableCell className="text-sm font-medium">{p.remaining}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.expiresAt ? fmt(p.expiresAt) : "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] uppercase tracking-wide ${statusColors[p.status]}`}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}><Edit2 className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Pass" : "Create Pass"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Type <span className="text-destructive">*</span></Label>
              <Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="e.g. 10-Round Pack" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Quantity <span className="text-destructive">*</span></Label>
                <Input type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 10" />
              </div>
              <div className="space-y-1.5">
                <Label>Price ($) <span className="text-destructive">*</span></Label>
                <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Expiry Date</Label>
              <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.type.trim() || !form.quantity || !form.price}>{editing ? "Save Changes" : "Create Pass"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete pass?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This pass will be permanently removed.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId !== null && handleDelete(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Issue Pass</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Customer Name <span className="text-destructive">*</span></Label>
              <Input value={issueForm.customerName} onChange={(e) => setIssueForm({ ...issueForm, customerName: e.target.value })} placeholder="Customer name" />
            </div>
            <div className="space-y-1.5">
              <Label>Pass Type <span className="text-destructive">*</span></Label>
              <Input value={issueForm.type} onChange={(e) => setIssueForm({ ...issueForm, type: e.target.value })} placeholder="e.g. 10-Round Pack" />
            </div>
            <div className="space-y-1.5">
              <Label>Quantity <span className="text-destructive">*</span></Label>
              <Input type="number" min="1" value={issueForm.quantity} onChange={(e) => setIssueForm({ ...issueForm, quantity: e.target.value })} placeholder="1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIssueOpen(false)}>Cancel</Button>
            <Button onClick={handleIssue} disabled={saving || !issueForm.customerName.trim() || !issueForm.type || !issueForm.quantity}>Issue Pass</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
