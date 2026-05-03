import { useState } from "react";
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
import { Edit2, Save } from "lucide-react";

interface NotifConfig {
  type: string;
  label: string;
  description: string;
  activeEmail: boolean;
  activeSms: boolean;
  subject: string;
  body: string;
}

const initialNotifs: NotifConfig[] = [
  {
    type: "BookingConfirmation",
    label: "Booking Confirmation",
    description: "Sent when a booking is confirmed",
    activeEmail: true,
    activeSms: false,
    subject: "Your booking is confirmed!",
    body: "Hi {{customerName}},\n\nYour booking at {{facilityName}} has been confirmed.\n\nDate: {{date}}\nTime: {{startTime}} – {{endTime}}\nBay: {{bay}}\n\nSee you soon!",
  },
  {
    type: "BookingReminder",
    label: "Booking Reminder",
    description: "Sent 24 hours before a session",
    activeEmail: true,
    activeSms: true,
    subject: "Reminder: You have a session tomorrow",
    body: "Hi {{customerName}},\n\nJust a reminder that you have a session scheduled tomorrow.\n\nDate: {{date}}\nTime: {{startTime}} – {{endTime}}\nBay: {{bay}}\n\nSee you then!",
  },
  {
    type: "BookingCancel",
    label: "Booking Cancellation",
    description: "Sent when a booking is cancelled",
    activeEmail: true,
    activeSms: false,
    subject: "Your booking has been cancelled",
    body: "Hi {{customerName}},\n\nYour booking on {{date}} at {{startTime}} has been cancelled.\n\nIf you have any questions, please contact us at {{facilityEmail}}.",
  },
  {
    type: "BookingEnding",
    label: "Session Ending Soon",
    description: "Sent 15 minutes before session ends",
    activeEmail: false,
    activeSms: true,
    subject: "Your session is ending soon",
    body: "Hi {{customerName}},\n\nYour session ends in 15 minutes. Please begin wrapping up.\n\nThank you for visiting {{facilityName}}!",
  },
  {
    type: "BookingReport",
    label: "Daily Booking Report",
    description: "Daily summary sent to the facility owner",
    activeEmail: false,
    activeSms: false,
    subject: "Daily Booking Report — {{date}}",
    body: "Here is your daily summary for {{date}}.\n\nTotal bookings: {{count}}\nTotal revenue: {{revenue}}\n\nView full report in your dashboard.",
  },
  {
    type: "MembershipActive",
    label: "Membership Activated",
    description: "Sent when a new membership is activated",
    activeEmail: true,
    activeSms: false,
    subject: "Welcome to {{plan}} membership!",
    body: "Hi {{customerName}},\n\nYour {{plan}} membership at {{facilityName}} is now active.\n\nStart date: {{startDate}}\n\nEnjoy your membership benefits!",
  },
  {
    type: "BookingMultipleConfirmation",
    label: "Group Booking Confirmation",
    description: "Sent when multiple bays are booked",
    activeEmail: true,
    activeSms: false,
    subject: "Group booking confirmed!",
    body: "Hi {{customerName}},\n\nYour group booking for {{count}} bays has been confirmed for {{date}} at {{startTime}}.\n\nSee you soon!",
  },
];

export default function Notifications() {
  const { toast } = useToast();
  const [notifs, setNotifs] = useState<NotifConfig[]>(initialNotifs);
  const [channel, setChannel] = useState<"email" | "sms">("email");
  const [editingNotif, setEditingNotif] = useState<NotifConfig | null>(null);
  const [editForm, setEditForm] = useState<NotifConfig | null>(null);
  const [saving, setSaving] = useState(false);

  const toggle = (type: string, field: "activeEmail" | "activeSms") => {
    setNotifs((prev) => prev.map((n) => n.type === type ? { ...n, [field]: !n[field] } : n));
  };

  const openEdit = (notif: NotifConfig) => {
    setEditingNotif(notif);
    setEditForm({ ...notif });
  };

  const handleSaveTemplate = async () => {
    if (!editForm) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setNotifs((prev) => prev.map((n) => n.type === editForm.type ? editForm : n));
    setSaving(false);
    setEditingNotif(null);
    toast({ title: "Template saved", description: `${editForm.label} template updated.` });
  };

  const handleSaveAll = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast({ title: "Notification settings saved", description: "Your notification preferences have been updated." });
  };

  const activeField = channel === "email" ? "activeEmail" : "activeSms";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Configure automated messages sent to customers and staff</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={channel} onValueChange={(v) => setChannel(v as "email" | "sms")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSaveAll} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Notification</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold text-center">
                {channel === "email" ? "Email" : "SMS"}
              </TableHead>
              <TableHead className="text-right font-semibold">Edit Template</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifs.map((notif) => (
              <TableRow key={notif.type} className="hover:bg-muted/30">
                <TableCell>
                  <div className="font-medium text-sm">{notif.label}</div>
                  <Badge variant="outline" className="text-[10px] mt-1 bg-secondary text-secondary-foreground capitalize">
                    {channel}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-xs">{notif.description}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Switch
                      checked={notif[activeField]}
                      onCheckedChange={() => toggle(notif.type, activeField)}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-primary"
                    onClick={() => openEdit(notif)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" /> Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-muted/30 border rounded-xl p-4 text-sm text-muted-foreground">
        Available template variables: <code className="font-mono text-xs bg-muted px-1 rounded">{"{{customerName}}"}</code> <code className="font-mono text-xs bg-muted px-1 rounded">{"{{facilityName}}"}</code> <code className="font-mono text-xs bg-muted px-1 rounded">{"{{date}}"}</code> <code className="font-mono text-xs bg-muted px-1 rounded">{"{{startTime}}"}</code> <code className="font-mono text-xs bg-muted px-1 rounded">{"{{bay}}"}</code> <code className="font-mono text-xs bg-muted px-1 rounded">{"{{plan}}"}</code>
      </div>

      <Dialog open={!!editingNotif} onOpenChange={() => setEditingNotif(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Template — {editForm?.label}</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Subject Line</Label>
                <Input
                  value={editForm.subject}
                  onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                  placeholder="Email subject"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Message Body</Label>
                <Textarea
                  className="min-h-[200px] font-mono text-sm resize-y"
                  value={editForm.body}
                  onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNotif(null)}>Cancel</Button>
            <Button onClick={handleSaveTemplate} disabled={saving}>
              {saving ? "Saving…" : "Save Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
