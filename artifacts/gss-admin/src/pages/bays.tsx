import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit2, Trash2, LayoutGrid } from "lucide-react";

interface Bay {
  id: number;
  name: string;
  description: string | null;
  simulator: string | null;
  active: boolean;
}

const emptyForm = { name: "", description: "", simulator: "", active: true };

export default function Bays() {
  const [bays, setBays] = useState<Bay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBay, setEditingBay] = useState<Bay | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadBays = () => {
    setLoading(true);
    fetch("/api/bays", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject("Failed to load")))
      .then((data) => { setBays(data); setLoading(false); })
      .catch((e) => { setError(String(e)); setLoading(false); });
  };

  useEffect(() => { loadBays(); }, []);

  const openCreate = () => {
    setEditingBay(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (bay: Bay) => {
    setEditingBay(bay);
    setForm({
      name: bay.name,
      description: bay.description ?? "",
      simulator: bay.simulator ?? "",
      active: bay.active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const body = {
      name: form.name,
      description: form.description || null,
      simulator: form.simulator || null,
      active: form.active,
    };
    const url = editingBay ? `/api/bays/${editingBay.id}` : "/api/bays";
    const method = editingBay ? "PUT" : "POST";
    await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    setDialogOpen(false);
    loadBays();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/bays/${id}`, { method: "DELETE", credentials: "include" });
    setDeleteId(null);
    loadBays();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Bays</h1>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Bay
        </Button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}

      {!loading && !error && bays.length === 0 && (
        <div className="border border-dashed rounded-xl p-12 text-center">
          <LayoutGrid className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No bays yet</h3>
          <p className="text-muted-foreground text-sm mb-4">Add your simulator bays to start taking bookings.</p>
          <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Bay</Button>
        </div>
      )}

      {!loading && bays.length > 0 && (
        <div className="border rounded-md bg-card shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Simulator</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bays.map((bay) => (
                <TableRow key={bay.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{bay.name}</TableCell>
                  <TableCell>
                    {bay.active ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 uppercase text-[10px] tracking-wider">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 uppercase text-[10px] tracking-wider">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{bay.simulator ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{bay.description ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(bay)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(bay.id)}>
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
            <DialogTitle>{editingBay ? "Edit Bay" : "Add Bay"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="bay-name">Name</Label>
              <Input id="bay-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Bay 1" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bay-sim">Simulator Type</Label>
              <Input id="bay-sim" value={form.simulator} onChange={(e) => setForm({ ...form, simulator: e.target.value })} placeholder="e.g. Trackman, Full Swing" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bay-desc">Description</Label>
              <Input id="bay-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional" />
            </div>
            <div className="flex items-center gap-3">
              <Switch id="bay-active" checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              <Label htmlFor="bay-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name.trim()}>
              {saving ? "Saving…" : editingBay ? "Save Changes" : "Add Bay"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete bay?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently remove the bay. Any associated bookings will remain in the system.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId !== null && handleDelete(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
