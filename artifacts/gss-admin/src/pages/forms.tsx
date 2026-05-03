import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, ClipboardList, Search, ChevronRight, GripVertical, X } from "lucide-react";

interface Question {
  id: string;
  label: string;
  type: "text" | "email" | "phone" | "textarea" | "select" | "checkbox" | "date";
  required: boolean;
  options?: string[];
}

interface Form {
  id: number;
  name: string;
  description: string;
  type: string;
  active: boolean;
  questions: Question[];
  linkedTo: string | null;
  submissionCount: number;
  createdAt: string;
}

const FORM_TYPES = [
  { value: "intake", label: "Customer Intake" },
  { value: "waiver", label: "Waiver / Release" },
  { value: "event", label: "Event Form" },
  { value: "birthday", label: "Birthday Party" },
  { value: "membership", label: "Membership Form" },
];

const QUESTION_TYPES = [
  { value: "text", label: "Short Text" },
  { value: "textarea", label: "Long Text" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "date", label: "Date" },
  { value: "select", label: "Dropdown" },
  { value: "checkbox", label: "Checkbox Acceptance" },
];

const typeColors: Record<string, string> = {
  intake: "bg-blue-50 text-blue-700 border-blue-200",
  waiver: "bg-amber-50 text-amber-700 border-amber-200",
  event: "bg-purple-50 text-purple-700 border-purple-200",
  birthday: "bg-pink-50 text-pink-700 border-pink-200",
  membership: "bg-green-50 text-green-700 border-green-200",
};

const emptyForm = { name: "", description: "", type: "intake", active: true, linkedTo: "" };

function QuestionEditor({ questions, onChange }: { questions: Question[]; onChange: (q: Question[]) => void }) {
  const addQuestion = () => {
    const newQ: Question = { id: crypto.randomUUID(), label: "", type: "text", required: false };
    onChange([...questions, newQ]);
  };

  const updateQ = (id: string, updates: Partial<Question>) => {
    onChange(questions.map((q) => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQ = (id: string) => onChange(questions.filter((q) => q.id !== id));

  return (
    <div className="space-y-3">
      {questions.map((q, idx) => (
        <div key={q.id} className="border rounded-lg p-3 bg-muted/20 space-y-2">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs font-medium text-muted-foreground w-5">{idx + 1}</span>
            <Input
              value={q.label}
              onChange={(e) => updateQ(q.id, { label: e.target.value })}
              placeholder="Question label"
              className="flex-1 h-8 text-sm"
            />
            <Select value={q.type} onValueChange={(v) => updateQ(q.id, { type: v as Question["type"] })}>
              <SelectTrigger className="w-36 h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {QUESTION_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1.5 ml-1">
              <Switch
                checked={q.required}
                onCheckedChange={(v) => updateQ(q.id, { required: v })}
                className="scale-75"
              />
              <span className="text-xs text-muted-foreground">Req</span>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeQ(q.id)}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          {q.type === "select" && (
            <div className="ml-8 space-y-1">
              <p className="text-xs text-muted-foreground">Options (one per line)</p>
              <Textarea
                className="text-xs min-h-[60px] resize-none"
                placeholder="Option 1&#10;Option 2&#10;Option 3"
                value={(q.options || []).join("\n")}
                onChange={(e) => updateQ(q.id, { options: e.target.value.split("\n").filter(Boolean) })}
              />
            </div>
          )}
          {q.type === "checkbox" && (
            <div className="ml-8">
              <Input
                className="text-xs h-8"
                placeholder="Acceptance text shown to user"
                value={(q.options || [])[0] || ""}
                onChange={(e) => updateQ(q.id, { options: [e.target.value] })}
              />
            </div>
          )}
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addQuestion} className="w-full border-dashed">
        <Plus className="h-3.5 w-3.5 mr-1.5" />Add Question
      </Button>
    </div>
  );
}

export default function Forms() {
  const { toast } = useToast();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Form | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewForm, setPreviewForm] = useState<Form | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/forms", { credentials: "include" });
    if (res.ok) setForms(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = forms.filter((f) => {
    const q = search.toLowerCase();
    return f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q);
  });

  const openCreate = () => {
    setEditing(null);
    setFormData(emptyForm);
    setQuestions([]);
    setDialogOpen(true);
  };

  const openEdit = (f: Form) => {
    setEditing(f);
    setFormData({ name: f.name, description: f.description, type: f.type, active: f.active, linkedTo: f.linkedTo || "" });
    setQuestions(f.questions || []);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);
    const body = { ...formData, linkedTo: formData.linkedTo || null, questions };
    const url = editing ? `/api/forms/${editing.id}` : "/api/forms";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    if (res.ok) {
      setDialogOpen(false);
      load();
      toast({ title: editing ? "Form updated" : "Form created" });
    } else {
      toast({ title: "Error saving form", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/forms/${id}`, { method: "DELETE", credentials: "include" });
    setDeleteId(null);
    load();
    toast({ title: "Form deleted" });
  };

  const toggleActive = async (f: Form) => {
    await fetch(`/api/forms/${f.id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...f, active: !f.active }),
    });
    load();
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Forms</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Customer intake forms, waivers, event and membership forms</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1.5" />New Form</Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search forms…" className="pl-8 bg-card" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="border rounded-md bg-card p-8 text-center text-muted-foreground text-sm">Loading forms…</div>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed rounded-xl p-12 text-center">
          <ClipboardList className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No forms yet</h3>
          <p className="text-muted-foreground text-sm mb-4">Create forms to collect customer information, waivers, and event details.</p>
          <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1.5" />New Form</Button>
        </div>
      ) : (
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Form</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((f) => (
                <TableRow key={f.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">{f.name}</div>
                      {f.description && <div className="text-xs text-muted-foreground truncate max-w-xs">{f.description}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] uppercase tracking-wide ${typeColors[f.type] ?? ""}`}>
                      {FORM_TYPES.find((t) => t.value === f.type)?.label ?? f.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{(f.questions || []).length}</TableCell>
                  <TableCell className="text-sm">{f.submissionCount || 0}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{fmt(f.createdAt)}</TableCell>
                  <TableCell>
                    <Switch checked={f.active} onCheckedChange={() => toggleActive(f)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setPreviewForm(f)}>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(f)}><Edit2 className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(f.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Form" : "Create Form"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Form Name <span className="text-destructive">*</span></Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Customer Intake Form" />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FORM_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Short description shown to customers" className="resize-none min-h-[60px]" />
            </div>
            <div className="space-y-1.5">
              <Label>Link to</Label>
              <Select value={formData.linkedTo || "__none__"} onValueChange={(v) => setFormData({ ...formData, linkedTo: v === "__none__" ? "" : v })}>
                <SelectTrigger><SelectValue placeholder="Not linked" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Not linked</SelectItem>
                  <SelectItem value="booking">Booking Flow</SelectItem>
                  <SelectItem value="membership">Membership Sign-up</SelectItem>
                  <SelectItem value="event">Event Registration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="form-active" checked={formData.active} onCheckedChange={(v) => setFormData({ ...formData, active: v })} />
              <Label htmlFor="form-active">Active</Label>
            </div>
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-base">Questions</Label>
                <span className="text-xs text-muted-foreground">{questions.length} question{questions.length !== 1 ? "s" : ""}</span>
              </div>
              <QuestionEditor questions={questions} onChange={setQuestions} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !formData.name.trim()}>{saving ? "Saving…" : editing ? "Save Changes" : "Create Form"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewForm} onOpenChange={() => setPreviewForm(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview — {previewForm?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {previewForm?.description && <p className="text-sm text-muted-foreground">{previewForm.description}</p>}
            {(previewForm?.questions || []).length === 0 ? (
              <p className="text-sm text-muted-foreground italic text-center py-6">No questions added yet.</p>
            ) : (
              (previewForm?.questions || []).map((q, i) => (
                <div key={q.id} className="space-y-1.5">
                  <Label className="text-sm">
                    {q.label || `Question ${i + 1}`}
                    {q.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {q.type === "textarea" ? (
                    <Textarea className="resize-none" disabled placeholder="Customer response…" />
                  ) : q.type === "select" ? (
                    <Select disabled><SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger></Select>
                  ) : q.type === "checkbox" ? (
                    <div className="flex items-start gap-2 p-3 border rounded-md bg-muted/20">
                      <input type="checkbox" className="mt-0.5" disabled />
                      <span className="text-sm text-muted-foreground">{(q.options || [])[0] || "I agree to the terms"}</span>
                    </div>
                  ) : (
                    <Input type={q.type} disabled placeholder="Customer response…" />
                  )}
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewForm(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete form?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This form and all its submissions will be permanently deleted.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId !== null && handleDelete(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
