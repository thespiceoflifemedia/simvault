import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, CalendarClock, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Schedule {
  id: number;
  dayOfWeek: number;
  rateType: string;
  rate: number;
  isOpen: number;
  openTime: string | null;
  closeTime: string | null;
}

const ALL_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const emptyForm = { dayOfWeek: 0, rateType: "", rate: "", isOpen: 1, openTime: "09:00", closeTime: "17:00" };

export default function Schedules() {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/schedules", { credentials: "include" });
      if (res.ok) setSchedules(await res.json());
    } catch (e) {
      toast({ title: "Failed to load schedules", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { loadSchedules(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (s: Schedule) => {
    setEditing(s);
    setForm({
      dayOfWeek: s.dayOfWeek,
      rateType: s.rateType,
      rate: String(s.rate),
      isOpen: s.isOpen,
      openTime: s.openTime || "09:00",
      closeTime: s.closeTime || "17:00",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const rate = parseFloat(form.rate);
    if (!form.rateType.trim() || isNaN(rate)) return;
    setSaving(true);
    const body = {
      dayOfWeek: form.dayOfWeek,
      rateType: form.rateType,
      rate,
      isOpen: form.isOpen,
      openTime: form.openTime,
      closeTime: form.closeTime,
    };
    try {
      if (editing) {
        await fetch(`/api/schedules/${editing.id}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } else {
        await fetch("/api/schedules", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      }
      setDialogOpen(false);
      loadSchedules();
      toast({ title: editing ? "Schedule updated" : "Schedule created" });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/schedules/${id}`, { method: "DELETE", credentials: "include" });
    setDeleteId(null);
    loadSchedules();
    toast({ title: "Schedule removed" });
  };

  const fmt12 = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Schedules & Pricing</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Time-based bay pricing and availability windows</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1.5" />Add Schedule</Button>
      </div>

      <div className="border rounded-md bg-card divide-y">
        {schedules.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No schedules configured</div>
        ) : (
          schedules.map((s) => (
            <div key={s.id} className="flex items-center gap-4 px-4 py-3">
              <div className="w-16 text-sm font-medium">{ALL_DAYS[s.dayOfWeek]}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{s.rateType}</div>
                {s.isOpen ? (
                  <div className="text-xs text-muted-foreground">
                    {fmt12(s.openTime || "09:00")} – {fmt12(s.closeTime || "17:00")} · ${s.rate}/hr
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground italic">Closed</div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)}><Edit2 className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Schedule" : "Add Schedule"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Day</Label>
              <div className="grid grid-cols-4 gap-2">
                {ALL_DAYS.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => setForm({ ...form, dayOfWeek: idx })}
                    className={`px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
                      form.dayOfWeek === idx
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-input hover:bg-muted"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Rate Type <span className="text-destructive">*</span></Label>
              <Input value={form.rateType} onChange={(e) => setForm({ ...form, rateType: e.target.value })} placeholder="e.g. Peak, Off-Peak" />
            </div>
            <div className="space-y-1.5">
              <Label>Rate per Hour ($) <span className="text-destructive">*</span></Label>
              <Input type="number" min="0" step="0.01" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} placeholder="45" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Switch id="open" checked={form.isOpen === 1} onCheckedChange={(v) => setForm({ ...form, isOpen: v ? 1 : 0 })} />
              <Label htmlFor="open">Open</Label>
            </div>
            {form.isOpen === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Open Time</Label>
                  <Input type="time" value={form.openTime} onChange={(e) => setForm({ ...form, openTime: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Close Time</Label>
                  <Input type="time" value={form.closeTime} onChange={(e) => setForm({ ...form, closeTime: e.target.value })} />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.rateType.trim() || !form.rate}>{editing ? "Save Changes" : "Add Schedule"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Remove schedule?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This schedule will be permanently removed.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId !== null && handleDelete(deleteId)}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
