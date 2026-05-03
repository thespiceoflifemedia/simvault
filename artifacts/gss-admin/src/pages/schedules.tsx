import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, CalendarClock, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TimeBlock {
  id: number;
  label: string;
  startTime: string;
  endTime: string;
  ratePerHour: number;
  days: string[];
  active: boolean;
}

interface BusinessHours {
  day: string;
  open: boolean;
  openTime: string;
  closeTime: string;
}

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const initBlocks: TimeBlock[] = [
  { id: 1, label: "Morning", startTime: "08:00", endTime: "12:00", ratePerHour: 35, days: ["Mon","Tue","Wed","Thu","Fri"], active: true },
  { id: 2, label: "Afternoon", startTime: "12:00", endTime: "17:00", ratePerHour: 45, days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], active: true },
  { id: 3, label: "Evening", startTime: "17:00", endTime: "22:00", ratePerHour: 55, days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], active: true },
  { id: 4, label: "Weekend Morning", startTime: "08:00", endTime: "12:00", ratePerHour: 50, days: ["Sat","Sun"], active: true },
];

const initHours: BusinessHours[] = [
  { day: "Monday", open: true, openTime: "08:00", closeTime: "22:00" },
  { day: "Tuesday", open: true, openTime: "08:00", closeTime: "22:00" },
  { day: "Wednesday", open: true, openTime: "08:00", closeTime: "22:00" },
  { day: "Thursday", open: true, openTime: "08:00", closeTime: "22:00" },
  { day: "Friday", open: true, openTime: "08:00", closeTime: "23:00" },
  { day: "Saturday", open: true, openTime: "07:00", closeTime: "23:00" },
  { day: "Sunday", open: true, openTime: "08:00", closeTime: "21:00" },
];

let nextId = 5;
const emptyForm = { label: "", startTime: "09:00", endTime: "17:00", ratePerHour: "", days: ALL_DAYS, active: true };

export default function Schedules() {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<TimeBlock[]>(initBlocks);
  const [hours, setHours] = useState<BusinessHours[]>(initHours);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TimeBlock | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [hoursSaving, setHoursSaving] = useState(false);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (b: TimeBlock) => {
    setEditing(b);
    setForm({ label: b.label, startTime: b.startTime, endTime: b.endTime, ratePerHour: String(b.ratePerHour), days: b.days, active: b.active });
    setDialogOpen(true);
  };

  const toggleDay = (day: string) => {
    setForm((f) => ({ ...f, days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day] }));
  };

  const handleSave = () => {
    const rate = parseFloat(form.ratePerHour as string);
    if (!form.label.trim() || isNaN(rate) || form.days.length === 0) return;
    const data: TimeBlock = { id: editing?.id ?? nextId++, label: form.label, startTime: form.startTime, endTime: form.endTime, ratePerHour: rate, days: form.days, active: form.active };
    if (editing) {
      setBlocks(blocks.map((b) => b.id === editing.id ? data : b));
    } else {
      setBlocks([...blocks, data]);
    }
    setDialogOpen(false);
    toast({ title: editing ? "Rate block updated" : "Rate block created" });
  };

  const handleDelete = (id: number) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    setDeleteId(null);
    toast({ title: "Rate block removed" });
  };

  const toggleBlock = (id: number) => {
    setBlocks(blocks.map((b) => b.id === id ? { ...b, active: !b.active } : b));
  };

  const updateHours = (day: string, field: keyof BusinessHours, value: string | boolean) => {
    setHours(hours.map((h) => h.day === day ? { ...h, [field]: value } : h));
  };

  const saveHours = () => {
    setHoursSaving(true);
    setTimeout(() => {
      setHoursSaving(false);
      toast({ title: "Business hours saved" });
    }, 600);
  };

  const fmt12 = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Schedules & Pricing</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Time-based bay pricing and availability windows</p>
        </div>
      </div>

      <Tabs defaultValue="rates">
        <TabsList>
          <TabsTrigger value="rates"><CalendarClock className="h-3.5 w-3.5 mr-1.5" />Rate Blocks</TabsTrigger>
          <TabsTrigger value="hours"><Clock className="h-3.5 w-3.5 mr-1.5" />Business Hours</TabsTrigger>
        </TabsList>

        {/* Rate Blocks */}
        <TabsContent value="rates" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{blocks.filter((b) => b.active).length} active pricing blocks</p>
            <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1.5" />Add Rate Block</Button>
          </div>

          {/* Visual weekly grid */}
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-muted/50 px-4 py-3 flex items-center gap-2 border-b">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Weekly Rate Overview</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/20">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-40">Rate Block</th>
                    {ALL_DAYS.map((d) => (
                      <th key={d} className="px-2 py-2.5 font-medium text-muted-foreground text-center text-xs">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {blocks.map((block) => (
                    <tr key={block.id} className={`hover:bg-muted/20 ${!block.active ? "opacity-50" : ""}`}>
                      <td className="px-4 py-3">
                        <div className="font-medium">{block.label}</div>
                        <div className="text-xs text-muted-foreground">{fmt12(block.startTime)} – {fmt12(block.endTime)}</div>
                      </td>
                      {ALL_DAYS.map((d) => (
                        <td key={d} className="px-2 py-3 text-center">
                          {block.days.includes(d) ? (
                            <Badge variant="outline" className="text-xs whitespace-nowrap bg-primary/5 border-primary/20 text-primary">
                              ${block.ratePerHour}/hr
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground/30 text-xs">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rate block list */}
          <div className="border rounded-md bg-card divide-y">
            {blocks.map((block) => (
              <div key={block.id} className="flex items-center gap-4 px-4 py-3">
                <Switch checked={block.active} onCheckedChange={() => toggleBlock(block.id)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-medium ${!block.active ? "text-muted-foreground" : ""}`}>{block.label}</span>
                    <span className="text-xs text-muted-foreground">{fmt12(block.startTime)} – {fmt12(block.endTime)}</span>
                    <div className="flex gap-1 flex-wrap">
                      {block.days.map((d) => (
                        <Badge key={d} variant="secondary" className="text-[10px] px-1.5 py-0">{d}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-sm">${block.ratePerHour}/hr</div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(block)}><Edit2 className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(block.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Business Hours */}
        <TabsContent value="hours" className="mt-4 space-y-4">
          <div className="border rounded-md bg-card divide-y">
            {hours.map((h) => (
              <div key={h.day} className="flex items-center gap-4 px-4 py-3">
                <Switch checked={h.open} onCheckedChange={(v) => updateHours(h.day, "open", v)} />
                <div className="w-28 text-sm font-medium">{h.day}</div>
                {h.open ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input type="time" value={h.openTime} onChange={(e) => updateHours(h.day, "openTime", e.target.value)} className="w-32 h-8 text-sm" />
                    <span className="text-muted-foreground text-sm">to</span>
                    <Input type="time" value={h.closeTime} onChange={(e) => updateHours(h.day, "closeTime", e.target.value)} className="w-32 h-8 text-sm" />
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {fmt12(h.openTime)} – {fmt12(h.closeTime)}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">Closed</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={saveHours} disabled={hoursSaving}>{hoursSaving ? "Saving…" : "Save Business Hours"}</Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Rate Block" : "Add Rate Block"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Label <span className="text-destructive">*</span></Label>
              <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Evening, Happy Hour" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Start Time</Label>
                <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>End Time</Label>
                <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Rate per Hour ($) <span className="text-destructive">*</span></Label>
              <Input type="number" min="0" step="0.01" value={form.ratePerHour} onChange={(e) => setForm({ ...form, ratePerHour: e.target.value })} placeholder="e.g. 45" />
            </div>
            <div className="space-y-1.5">
              <Label>Days <span className="text-destructive">*</span></Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {ALL_DAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${form.days.includes(d) ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-input hover:bg-muted"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="block-active" checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              <Label htmlFor="block-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.label.trim() || !(form.ratePerHour as string) || form.days.length === 0}>
              {editing ? "Save Changes" : "Add Rate Block"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Remove rate block?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This pricing block will be permanently removed.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId !== null && handleDelete(deleteId)}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
