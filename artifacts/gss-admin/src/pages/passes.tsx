import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, Ticket, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PassType {
  id: number;
  name: string;
  type: "sessions" | "hours" | "unlimited";
  value: number | null;
  price: number;
  validityDays: number | null;
  description: string;
}

interface IssuedPass {
  id: number;
  passType: string;
  customer: string;
  remaining: string;
  issuedDate: string;
  expiryDate: string | null;
  status: "active" | "expired" | "used";
}

const initTypes: PassType[] = [
  { id: 1, name: "10-Round Punch Card", type: "sessions", value: 10, price: 399, validityDays: 365, description: "Good for 10 hourly bay sessions. Credits never expire within validity period." },
  { id: 2, name: "Monthly Hour Block", type: "hours", value: 20, price: 299, validityDays: 30, description: "20 hours of bay time within a rolling 30-day window." },
  { id: 3, name: "Season Pass", type: "unlimited", value: null, price: 599, validityDays: 90, description: "Unlimited access for a full 90-day season." },
];

const initIssued: IssuedPass[] = [
  { id: 1, passType: "10-Round Punch Card", customer: "John Smith", remaining: "7 sessions", issuedDate: "2025-03-01", expiryDate: "2026-03-01", status: "active" },
  { id: 2, passType: "Monthly Hour Block", customer: "Sarah Johnson", remaining: "14.5 hrs", issuedDate: "2025-04-15", expiryDate: "2025-05-15", status: "active" },
  { id: 3, passType: "Season Pass", customer: "Mike Davis", remaining: "Unlimited", issuedDate: "2025-01-10", expiryDate: "2025-04-10", status: "expired" },
  { id: 4, passType: "10-Round Punch Card", customer: "Emily Clark", remaining: "0 sessions", issuedDate: "2025-02-01", expiryDate: "2026-02-01", status: "used" },
];

let nextId = 5;
const emptyForm = { name: "", type: "sessions" as PassType["type"], value: "", price: "", validityDays: "", description: "" };

const typeLabel = (t: PassType) => {
  if (t.type === "sessions") return `${t.value} sessions`;
  if (t.type === "hours") return `${t.value} hours`;
  return "Unlimited";
};

const statusColors: Record<string, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  expired: "bg-gray-50 text-gray-500 border-gray-200",
  used: "bg-blue-50 text-blue-700 border-blue-200",
};

const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function Passes() {
  const { toast } = useToast();
  const [passTypes, setPassTypes] = useState<PassType[]>(initTypes);
  const [issued] = useState<IssuedPass[]>(initIssued);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PassType | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [issueOpen, setIssueOpen] = useState(false);
  const [issuePassType, setIssuePassType] = useState("");
  const [issueCustomer, setIssueCustomer] = useState("");

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (p: PassType) => {
    setEditing(p);
    setForm({ name: p.name, type: p.type, value: p.value !== null ? String(p.value) : "", price: String(p.price), validityDays: p.validityDays !== null ? String(p.validityDays) : "", description: p.description });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const price = parseFloat(form.price);
    if (!form.name.trim() || isNaN(price)) return;
    const data: PassType = {
      id: editing?.id ?? nextId++,
      name: form.name,
      type: form.type,
      value: form.type !== "unlimited" && form.value ? parseFloat(form.value) : null,
      price,
      validityDays: form.validityDays ? parseInt(form.validityDays) : null,
      description: form.description,
    };
    if (editing) {
      setPassTypes(passTypes.map((p) => p.id === editing.id ? data : p));
    } else {
      setPassTypes([...passTypes, data]);
    }
    setDialogOpen(false);
    toast({ title: editing ? "Pass type updated" : "Pass type created" });
  };

  const handleDelete = (id: number) => {
    setPassTypes(passTypes.filter((p) => p.id !== id));
    setDeleteId(null);
    toast({ title: "Pass type removed" });
  };

  const handleIssue = () => {
    if (!issueCustomer.trim() || !issuePassType) return;
    toast({ title: `Pass issued to ${issueCustomer}`, description: issuePassType });
    setIssueOpen(false);
    setIssueCustomer(""); setIssuePassType("");
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
          <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1.5" />New Pass Type</Button>
        </div>
      </div>

      <Tabs defaultValue="types">
        <TabsList>
          <TabsTrigger value="types">Pass Types</TabsTrigger>
          <TabsTrigger value="issued">Issued Passes ({issued.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="mt-4">
          {passTypes.length === 0 ? (
            <div className="border border-dashed rounded-xl p-12 text-center">
              <Ticket className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">No pass types yet</h3>
              <p className="text-muted-foreground text-sm mb-4">Create pass types to sell to your customers.</p>
              <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1.5" />Create Pass Type</Button>
            </div>
          ) : (
            <div className="border rounded-md bg-card">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passTypes.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{typeLabel(p)}</Badge>
                      </TableCell>
                      <TableCell className="font-bold">${p.price.toFixed(2)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {p.validityDays ? `${p.validityDays} days` : "No expiry"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{p.description || "—"}</TableCell>
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

        <TabsContent value="issued" className="mt-4">
          {issued.length === 0 ? (
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
                    <TableHead>Pass</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issued.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{p.customer}</TableCell>
                      <TableCell className="text-sm">{p.passType}</TableCell>
                      <TableCell className="text-sm font-medium">{p.remaining}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{fmt(p.issuedDate)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.expiryDate ? fmt(p.expiryDate) : "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] uppercase tracking-wide ${statusColors[p.status]}`}>
                          {p.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Pass Type" : "Create Pass Type"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Name <span className="text-destructive">*</span></Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. 10-Round Punch Card" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as PassType["type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sessions">Sessions (count)</SelectItem>
                    <SelectItem value="hours">Hours (time)</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.type !== "unlimited" && (
                <div className="space-y-1.5">
                  <Label>{form.type === "sessions" ? "Sessions" : "Hours"} <span className="text-destructive">*</span></Label>
                  <Input type="number" min="1" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="e.g. 10" />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Price ($) <span className="text-destructive">*</span></Label>
                <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
              </div>
              <div className="space-y-1.5">
                <Label>Validity (days)</Label>
                <Input type="number" min="1" value={form.validityDays} onChange={(e) => setForm({ ...form, validityDays: e.target.value })} placeholder="Leave blank = no expiry" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional short description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name.trim() || !form.price}>{editing ? "Save Changes" : "Create Pass Type"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete pass type?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will remove the pass type. Existing issued passes will not be affected.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId !== null && handleDelete(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Issue pass dialog */}
      <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Issue Pass</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Pass Type <span className="text-destructive">*</span></Label>
              <Select value={issuePassType} onValueChange={setIssuePassType}>
                <SelectTrigger><SelectValue placeholder="Select a pass type" /></SelectTrigger>
                <SelectContent>
                  {passTypes.map((p) => <SelectItem key={p.id} value={p.name}>{p.name} — ${p.price.toFixed(2)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Customer Name <span className="text-destructive">*</span></Label>
              <Input value={issueCustomer} onChange={(e) => setIssueCustomer(e.target.value)} placeholder="Customer name" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIssueOpen(false)}>Cancel</Button>
            <Button onClick={handleIssue} disabled={!issueCustomer.trim() || !issuePassType}>Issue Pass</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
