import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Edit2, Save, Loader2, Eye } from "lucide-react";

interface NotifTemplate {
  id: number;
  type: string;
  label: string;
  description: string;
  activeEmail: boolean;
  activeSms: boolean;
  subject: string;
  body: string;
}

const VARIABLES = [
  { key: "{courseName}", desc: "Facility name" },
  { key: "{bayName}", desc: "Bay name" },
  { key: "{startDate}", desc: "Booking date" },
  { key: "{startTime}", desc: "Start time" },
  { key: "{endTime}", desc: "End time" },
  { key: "{duration}", desc: "Duration" },
  { key: "{bookingStatus}", desc: "Status" },
  { key: "{bookingDetails}", desc: "Full details" },
  { key: "{bookingLink}", desc: "Booking link" },
  { key: "{extendLink}", desc: "Extend link" },
  { key: "{membershipName}", desc: "Membership name" },
  { key: "{membershipPrice}", desc: "Membership price" },
  { key: "{membershipDescription}", desc: "Membership description" },
  { key: "{loginLink}", desc: "Login link" },
  { key: "{customerName}", desc: "Customer name" },
];

export default function Notifications() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<NotifTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState<"email" | "sms">("email");
  const [editing, setEditing] = useState<NotifTemplate | null>(null);
  const [editForm, setEditForm] = useState<NotifTemplate | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/notification-templates", { credentials: "include" });
    if (res.ok) setTemplates(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const activeField = channel === "email" ? "activeEmail" : "activeSms";

  const toggle = async (tpl: NotifTemplate) => {
    const update = { ...tpl, [activeField]: !tpl[activeField] };
    setTemplates((prev) => prev.map((t) => t.id === tpl.id ? update : t));
    await fetch(`/api/notification-templates/${tpl.id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [activeField]: !tpl[activeField] }),
    });
  };

  const openEdit = (tpl: NotifTemplate) => {
    setEditing(tpl);
    setEditForm({ ...tpl });
  };

  const handleSave = async () => {
    if (!editForm) return;
    setSaving(true);
    const res = await fetch(`/api/notification-templates/${editForm.id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: editForm.subject, body: editForm.body, activeEmail: editForm.activeEmail, activeSms: editForm.activeSms }),
    });
    setSaving(false);
    if (res.ok) {
      const updated = await res.json();
      setTemplates((prev) => prev.map((t) => t.id === updated.id ? updated : t));
      setEditing(null);
      toast({ title: "Template saved", description: `${editForm.label} updated.` });
    }
  };

  const insertVar = (key: string) => {
    if (!editForm) return;
    setEditForm({ ...editForm, body: editForm.body + key });
  };

  const previewBody = (body: string) => {
    return body
      .replace(/{courseName}/g, "Gametime Sports Suite")
      .replace(/{bayName}/g, "Bay 3")
      .replace(/{startDate}/g, "May 15, 2026")
      .replace(/{startTime}/g, "2:00 PM")
      .replace(/{endTime}/g, "3:00 PM")
      .replace(/{duration}/g, "1 hour")
      .replace(/{customerName}/g, "John Smith")
      .replace(/{bookingStatus}/g, "Confirmed")
      .replace(/{bookingDetails}/g, "Bay 3, May 15 2:00-3:00 PM")
      .replace(/{bookingLink}/g, "https://example.com/booking/abc123")
      .replace(/{extendLink}/g, "https://example.com/extend/abc123")
      .replace(/{membershipName}/g, "Monthly Unlimited")
      .replace(/{membershipPrice}/g, "$99/month")
      .replace(/{membershipDescription}/g, "Unlimited bay access")
      .replace(/{loginLink}/g, "https://example.com/login");
  };

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Automated messages sent to customers and staff</p>
        </div>
        <Select value={channel} onValueChange={(v) => setChannel(v as "email" | "sms")}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Notification</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">{channel === "email" ? "Email" : "SMS"}</TableHead>
              <TableHead className="text-right">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((tpl) => (
              <TableRow key={tpl.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="font-medium text-sm">{tpl.label}</div>
                  <Badge variant="outline" className="text-[10px] mt-1 bg-secondary text-secondary-foreground capitalize">{channel}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-xs">{tpl.description}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Switch checked={tpl[activeField]} onCheckedChange={() => toggle(tpl)} />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 text-primary" onClick={() => openEdit(tpl)}>
                    <Edit2 className="h-4 w-4 mr-1.5" />Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Variables panel */}
      <div className="bg-muted/30 border rounded-xl p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Available Template Variables</p>
        <div className="flex flex-wrap gap-1.5">
          {VARIABLES.map((v) => (
            <div key={v.key} className="group relative">
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono cursor-default">{v.key}</code>
              <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block bg-popover border rounded shadow text-xs px-2 py-1 whitespace-nowrap z-10">
                {v.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit template dialog */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Template — {editForm?.label}</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Switch id="edit-email" checked={editForm.activeEmail} onCheckedChange={(v) => setEditForm({ ...editForm, activeEmail: v })} />
                  <Label htmlFor="edit-email">Email active</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="edit-sms" checked={editForm.activeSms} onCheckedChange={(v) => setEditForm({ ...editForm, activeSms: v })} />
                  <Label htmlFor="edit-sms">SMS active</Label>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Subject Line</Label>
                <Input value={editForm.subject} onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })} placeholder="Email subject" />
              </div>
              <div className="space-y-1.5">
                <Label>Message Body</Label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {VARIABLES.slice(0, 8).map((v) => (
                    <button key={v.key} type="button" onClick={() => insertVar(v.key)} className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded hover:bg-primary/20 transition-colors">
                      {v.key}
                    </button>
                  ))}
                </div>
                <Textarea
                  className="min-h-[200px] font-mono text-sm resize-y"
                  value={editForm.body}
                  onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                />
              </div>
              <div className="border rounded-lg bg-muted/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Preview (with sample data)</p>
                </div>
                <div className="text-xs font-semibold mb-1 text-foreground">Subject: {previewBody(editForm.subject)}</div>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">{previewBody(editForm.body)}</pre>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-1.5" />{saving ? "Saving…" : "Save Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
