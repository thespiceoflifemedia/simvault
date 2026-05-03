import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus, Trash2, Edit2, Phone, Briefcase } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const ROLES = [
  { value: "admin", label: "Admin", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "manager", label: "Manager", color: "bg-violet-50 text-violet-700 border-violet-200" },
  { value: "front-desk", label: "Front Desk", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { value: "coach", label: "Coach / Instructor", color: "bg-green-50 text-green-700 border-green-200" },
  { value: "staff", label: "Staff", color: "bg-gray-50 text-gray-700 border-gray-200" },
];

const roleColor = (role: string) => ROLES.find((r) => r.value === role)?.color ?? "bg-gray-50 text-gray-700";
const roleLabel = (role: string) => ROLES.find((r) => r.value === role)?.label ?? role;

const emptyForm = { name: "", email: "", password: "", role: "staff", phone: "", position: "" };

export default function Employees() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/employees", { credentials: "include" })
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setEmployees(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openInvite = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setForm({ name: emp.name, email: emp.email, password: "", role: emp.role, phone: "", position: "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (!editingId && form.password.length < 8) return;
    setSaving(true);
    const res = await fetch("/api/employees", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password || "placeholder", role: form.role, phone: form.phone || null, position: form.position || null }),
    });
    setSaving(false);
    if (res.ok) {
      setDialogOpen(false);
      load();
      toast({ title: editingId ? "Team member updated" : "Team member added", description: `${form.name} has been ${editingId ? "updated" : "added"} to your account.` });
    } else {
      const err = await res.json().catch(() => ({}));
      toast({ title: "Failed", description: err.error ?? "Please try again.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/employees/${id}`, { method: "DELETE", credentials: "include" });
    setDeleteId(null);
    load();
    toast({ title: "Team member removed" });
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Staff profiles, roles, and account access</p>
        </div>
        <Button onClick={openInvite}><Plus className="mr-2 h-4 w-4" />Add Team Member</Button>
      </div>

      {/* Role legend */}
      <div className="flex flex-wrap gap-2">
        {ROLES.map((r) => (
          <Badge key={r.value} variant="outline" className={`text-[10px] ${r.color}`}>{r.label}</Badge>
        ))}
      </div>

      {loading && <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>}

      {!loading && employees.length === 0 && (
        <div className="border border-dashed rounded-xl p-12 text-center">
          <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No team members yet</h3>
          <p className="text-muted-foreground text-sm mb-4">Add staff so they can log in and manage your SimVault account.</p>
          <Button onClick={openInvite}><Plus className="mr-2 h-4 w-4" />Add Team Member</Button>
        </div>
      )}

      {!loading && employees.length > 0 && (
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{emp.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{emp.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${roleColor(emp.role)} text-[10px] capitalize`}>
                      {roleLabel(emp.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{fmt(emp.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {emp.role !== "owner" && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(emp)}>
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(emp.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                      {emp.role === "owner" && (
                        <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200">Owner</Badge>
                      )}
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
          <DialogHeader><DialogTitle>{editingId ? "Edit Team Member" : "Add Team Member"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Full Name <span className="text-destructive">*</span></Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Jane Smith" />
            </div>
            <div className="space-y-1.5">
              <Label>Email <span className="text-destructive">*</span></Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@example.com" disabled={!!editingId} />
            </div>
            {!editingId && (
              <div className="space-y-1.5">
                <Label>Password <span className="text-destructive">*</span></Label>
                <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 8 characters" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label><Briefcase className="h-3.5 w-3.5 inline mr-1" />Position</Label>
                <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="e.g. Bay Assistant" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label><Phone className="h-3.5 w-3.5 inline mr-1" />Phone (optional)</Label>
              <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name.trim() || !form.email.trim() || (!editingId && form.password.length < 8)}>
              {saving ? "Saving…" : editingId ? "Save Changes" : "Add Team Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Remove team member?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will remove their access to your SimVault account immediately.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId !== null && handleDelete(deleteId)}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
