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
import { Textarea } from "@/components/ui/textarea";
import { Plus, CreditCard, Trash2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MembershipPlan {
  id: number;
  name: string;
  description: string;
  price: string | null;
  hoursPerMonth: string | null;
  active: boolean;
  visibility: string;
  createdAt: string;
}

const emptyForm = {
  name: "",
  description: "",
  price: "",
  hoursPerMonth: "",
  active: true,
  visibility: "public",
};

export default function MembershipPlans() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MembershipPlan | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/membership-plans", { credentials: "include" });
      if (res.ok) setPlans(await res.json());
    } catch {
      toast({ title: "Failed to load membership plans", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { loadPlans(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: MembershipPlan) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price ?? "",
      hoursPerMonth: p.hoursPerMonth ?? "",
      active: p.active,
      visibility: p.visibility,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const body = {
      name: form.name.trim(),
      description: form.description,
      price: form.price ? parseFloat(form.price) : null,
      hoursPerMonth: form.hoursPerMonth ? parseFloat(form.hoursPerMonth) : null,
      active: form.active,
      visibility: form.visibility,
    };
    try {
      const url = editing ? `/api/membership-plans/${editing.id}` : "/api/membership-plans";
      const method = editing ? "PUT" : "POST";
      await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setDialogOpen(false);
      loadPlans();
      toast({ title: editing ? "Plan updated" : "Plan created" });
    } catch {
      toast({ title: "Error saving plan", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleToggleActive = async (plan: MembershipPlan) => {
    try {
      await fetch(`/api/membership-plans/${plan.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !plan.active }),
      });
      loadPlans();
    } catch {
      toast({ title: "Failed to update", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/membership-plans/${id}`, { method: "DELETE", credentials: "include" });
    setDeleteId(null);
    loadPlans();
    toast({ title: "Plan removed" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Membership Plans</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Define membership templates available to customers
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Plan
        </Button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      )}

      {!loading && plans.length === 0 && (
        <div className="border border-dashed rounded-xl p-12 text-center">
          <CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No membership plans yet</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Create plan templates that customers can subscribe to.
          </p>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> New Plan
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
                <TableHead>Price / mo</TableHead>
                <TableHead>Hours / mo</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Visibility</TableHead>
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
                  <TableCell className="text-sm">
                    {plan.price ? `$${parseFloat(plan.price).toFixed(2)}` : "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {plan.hoursPerMonth ? `${plan.hoursPerMonth} hrs` : "—"}
                  </TableCell>
                  <TableCell onClick={(e) => { e.stopPropagation(); handleToggleActive(plan); }}>
                    <Switch checked={plan.active} />
                  </TableCell>
                  <TableCell>
                    {plan.visibility === "public" ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 text-[10px] uppercase tracking-wide">
                        <Eye className="h-3 w-3" /> Public
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 gap-1 text-[10px] uppercase tracking-wide">
                        <EyeOff className="h-3 w-3" /> Private
                      </Badge>
                    )}
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
            <DialogTitle>{editing ? "Edit Membership Plan" : "New Membership Plan"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Plan Name <span className="text-destructive">*</span></Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Monthly Unlimited"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe what's included in this plan"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Price / month ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 99.00"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Hours / month</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.hoursPerMonth}
                  onChange={(e) => setForm({ ...form, hoursPerMonth: e.target.value })}
                  placeholder="e.g. 8"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Visibility</Label>
              <Select value={form.visibility} onValueChange={(v) => setForm({ ...form, visibility: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public — visible on booking page</SelectItem>
                  <SelectItem value="private">Private — staff only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="plan-active"
                checked={form.active}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
              />
              <Label htmlFor="plan-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name.trim()}>
              {saving ? "Saving…" : editing ? "Save Changes" : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete membership plan?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            This plan template will be permanently removed. Existing customer memberships are not affected.
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
