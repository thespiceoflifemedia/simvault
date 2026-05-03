import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Ticket, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PassPlan {
  id: number;
  name: string;
  description: string;
  price: string;
  creditsValue: number;
  status: string;
  createdAt: string;
}

const emptyForm = {
  name: "",
  description: "",
  price: "",
  creditsValue: "",
  status: "active",
};

const statusColors: Record<string, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  inactive: "bg-gray-50 text-gray-500 border-gray-200",
};

export default function PassPlans() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<PassPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PassPlan | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pass-plans", { credentials: "include" });
      if (res.ok) setPlans(await res.json());
    } catch {
      toast({ title: "Failed to load pass plans", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { loadPlans(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: PassPlan) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      creditsValue: String(p.creditsValue),
      status: p.status,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const price = parseFloat(form.price);
    if (!form.name.trim() || isNaN(price)) return;
    setSaving(true);
    const body = {
      name: form.name.trim(),
      description: form.description,
      price,
      creditsValue: form.creditsValue ? parseInt(form.creditsValue) : 0,
      status: form.status,
    };
    try {
      const url = editing ? `/api/pass-plans/${editing.id}` : "/api/pass-plans";
      const method = editing ? "PUT" : "POST";
      await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setDialogOpen(false);
      loadPlans();
      toast({ title: editing ? "Pass plan updated" : "Pass plan created" });
    } catch {
      toast({ title: "Error saving pass plan", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/pass-plans/${id}`, { method: "DELETE", credentials: "include" });
    setDeleteId(null);
    loadPlans();
    toast({ title: "Pass plan removed" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pass Plans</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Define pass products available for purchase
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Pass Plan
        </Button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      )}

      {!loading && plans.length === 0 && (
        <div className="border border-dashed rounded-xl p-12 text-center">
          <Ticket className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No pass plans yet</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Create pass product templates customers can buy.
          </p>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> New Pass Plan
          </Button>
        </div>
      )}

      {!loading && plans.length > 0 && (
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Credits Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => openEdit(plan)}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[220px] truncate">
                    {plan.description || "—"}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    ${parseFloat(plan.price).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {plan.creditsValue > 0 ? `${plan.creditsValue} credits` : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase tracking-wide ${statusColors[plan.status] ?? ""}`}
                    >
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteId(plan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
            <DialogTitle>{editing ? "Edit Pass Plan" : "New Pass Plan"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Plan Name <span className="text-destructive">*</span></Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. 10-Session Pack"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What does this pass include?"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Price ($) <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 199.00"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Credits Value</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.creditsValue}
                  onChange={(e) => setForm({ ...form, creditsValue: e.target.value })}
                  placeholder="e.g. 10"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name.trim() || !form.price}>
              {saving ? "Saving…" : editing ? "Save Changes" : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete pass plan?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            This pass plan template will be permanently removed. Existing customer passes are not affected.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId !== null && handleDelete(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
