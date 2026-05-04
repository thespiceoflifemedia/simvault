import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Save, CalendarDays, CreditCard, AlertTriangle, Percent, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FacilitySettings {
  id: number;
  tenantId: number;
  timezone: string;
  advanceBookingDays: number;
  minimumDurationMinutes: number;
  onlinePaymentsRequired: boolean;
  currency: string;
  cancellationFeeDays: number;
  cancellationFeePercent: string;
  taxPercent: string;
}

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
  "America/Toronto",
  "America/Vancouver",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Asia/Dubai",
];

const CURRENCIES = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "CAD", label: "CAD — Canadian Dollar" },
  { code: "GBP", label: "GBP — British Pound" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "AUD", label: "AUD — Australian Dollar" },
  { code: "NZD", label: "NZD — New Zealand Dollar" },
  { code: "JPY", label: "JPY — Japanese Yen" },
  { code: "SGD", label: "SGD — Singapore Dollar" },
  { code: "AED", label: "AED — UAE Dirham" },
];

export default function FacilitySettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<FacilitySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    timezone: "America/New_York",
    advanceBookingDays: "30",
    minimumDurationMinutes: "30",
    onlinePaymentsRequired: false,
    currency: "USD",
    cancellationFeeDays: "1",
    cancellationFeePercent: "100",
    taxPercent: "0",
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/facility-settings", { credentials: "include" });
      if (res.ok) {
        const data: FacilitySettings = await res.json();
        setSettings(data);
        setForm({
          timezone: data.timezone,
          advanceBookingDays: String(data.advanceBookingDays),
          minimumDurationMinutes: String(data.minimumDurationMinutes),
          onlinePaymentsRequired: data.onlinePaymentsRequired,
          currency: data.currency,
          cancellationFeeDays: String(data.cancellationFeeDays),
          cancellationFeePercent: data.cancellationFeePercent,
          taxPercent: data.taxPercent,
        });
      }
    } catch {
      toast({ title: "Failed to load settings", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        timezone: form.timezone,
        advanceBookingDays: parseInt(form.advanceBookingDays),
        minimumDurationMinutes: parseInt(form.minimumDurationMinutes),
        onlinePaymentsRequired: form.onlinePaymentsRequired,
        currency: form.currency,
        cancellationFeeDays: parseInt(form.cancellationFeeDays),
        cancellationFeePercent: parseFloat(form.cancellationFeePercent),
        taxPercent: parseFloat(form.taxPercent),
      };
      await fetch("/api/facility-settings", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      toast({ title: "Settings saved" });
      load();
    } catch {
      toast({ title: "Failed to save settings", variant: "destructive" });
    }
    setSaving(false);
  };

  const f = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-9 w-64" />
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-40 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Facility Settings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Configure booking rules, payments, cancellation policy, and taxes
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      {/* Booking Settings */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Booking Settings</CardTitle>
          </div>
          <CardDescription>Control how far ahead customers can book and minimum session length</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Timezone</Label>
            <Select value={form.timezone} onValueChange={(v) => f("timezone", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>{tz.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Advance Booking Window (days)</Label>
              <Input
                type="number"
                min="1"
                max="365"
                value={form.advanceBookingDays}
                onChange={(e) => f("advanceBookingDays", e.target.value)}
                placeholder="30"
              />
              <p className="text-[11px] text-muted-foreground">
                How many days ahead customers can book
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>Minimum Session Duration (min)</Label>
              <Input
                type="number"
                min="15"
                max="480"
                step="15"
                value={form.minimumDurationMinutes}
                onChange={(e) => f("minimumDurationMinutes", e.target.value)}
                placeholder="30"
              />
              <p className="text-[11px] text-muted-foreground">
                Shortest bookable session length
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Payment Settings</CardTitle>
          </div>
          <CardDescription>Set your currency and online payment requirements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Currency</Label>
            <Select value={form.currency} onValueChange={(v) => f("currency", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Require payment at booking</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Customers must pay online when making a reservation
              </p>
            </div>
            <Switch
              checked={form.onlinePaymentsRequired}
              onCheckedChange={(v) => setForm((prev) => ({ ...prev, onlinePaymentsRequired: v }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Policy */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Cancellation Policy</CardTitle>
          </div>
          <CardDescription>Define the window and fee for late cancellations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Cancellation Window (days)</Label>
              <Input
                type="number"
                min="0"
                value={form.cancellationFeeDays}
                onChange={(e) => f("cancellationFeeDays", e.target.value)}
                placeholder="1"
              />
              <p className="text-[11px] text-muted-foreground">
                Cancellations within this window incur a fee
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>Cancellation Fee (%)</Label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  value={form.cancellationFeePercent}
                  onChange={(e) => f("cancellationFeePercent", e.target.value)}
                  placeholder="100"
                  className="pr-8"
                />
                <Percent className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="text-[11px] text-muted-foreground">
                % of booking price charged as fee
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Settings */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Tax</CardTitle>
          </div>
          <CardDescription>Applied to all bookings and POS transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5 max-w-[240px]">
            <Label>Tax Rate (%)</Label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                max="100"
                step="0.25"
                value={form.taxPercent}
                onChange={(e) => f("taxPercent", e.target.value)}
                placeholder="0"
                className="pr-8"
              />
              <Percent className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className="text-[11px] text-muted-foreground">Set to 0 to disable tax</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
