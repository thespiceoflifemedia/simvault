import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Building2, Mail, Phone, MapPin, Calendar, CreditCard } from "lucide-react";

interface Tenant {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: string | null;
  address: string | null;
  plan: string;
  active: boolean;
  createdAt: string;
}

const planLabels: Record<string, string> = {
  starter: "Starter",
  growth: "Growth",
  pro: "Pro",
};

export default function Details() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  const load = () => {
    setLoading(true);
    fetch("/api/tenant", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { setTenant(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openEdit = () => {
    if (!tenant) return;
    setForm({ name: tenant.name, email: tenant.email, phone: tenant.phone ?? "", address: tenant.address ?? "" });
    setEditOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/tenant", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone || null, address: form.address || null }),
    });
    setSaving(false);
    setEditOpen(false);
    load();
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!tenant) return <p className="text-muted-foreground">Failed to load facility settings.</p>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">{tenant.name}</h1>
            <Badge variant="outline" className="font-mono text-xs font-semibold">{tenant.slug}</Badge>
            <Badge variant={tenant.active ? "default" : "secondary"} className="text-xs">
              {tenant.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">Facility settings and configuration</p>
        </div>
        <Button variant="outline" size="sm" onClick={openEdit}>
          <Edit className="h-4 w-4 mr-2" /> Edit Facility
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Facility Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1 mb-1">
                <Mail className="h-3 w-3" /> Email
              </Label>
              <p className="text-sm font-medium">{tenant.email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1 mb-1">
                <Phone className="h-3 w-3" /> Phone
              </Label>
              <p className="text-sm font-medium">{tenant.phone ?? <span className="text-muted-foreground italic">Not set</span>}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1 mb-1">
                <MapPin className="h-3 w-3" /> Address
              </Label>
              <p className="text-sm font-medium">{tenant.address ?? <span className="text-muted-foreground italic">Not set</span>}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1 mb-1">
                <Calendar className="h-3 w-3" /> Member Since
              </Label>
              <p className="text-sm font-medium">
                {new Date(tenant.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Subscription Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
              <div>
                <div className="font-bold text-lg">{planLabels[tenant.plan] ?? tenant.plan}</div>
                <div className="text-xs text-muted-foreground capitalize">Current plan</div>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold">
                {tenant.plan.toUpperCase()}
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              {tenant.plan === "starter" && (
                <>
                  <div className="flex items-center gap-2 text-muted-foreground"><span className="text-green-600">✓</span> Up to 4 bays</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><span className="text-green-600">✓</span> Bay scheduling & memberships</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><span className="text-green-600">✓</span> Analytics & CRM</div>
                </>
              )}
              {tenant.plan === "growth" && (
                <>
                  <div className="flex items-center gap-2 text-muted-foreground"><span className="text-green-600">✓</span> Up to 10 bays</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><span className="text-green-600">✓</span> POS Essentials + Staff Scheduler</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><span className="text-green-600">✓</span> Loyalty Rewards</div>
                </>
              )}
              {tenant.plan === "pro" && (
                <>
                  <div className="flex items-center gap-2 text-muted-foreground"><span className="text-green-600">✓</span> Unlimited bays</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><span className="text-green-600">✓</span> Full POS Suite + Advanced CRM</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><span className="text-green-600">✓</span> Multi-location management</div>
                </>
              )}
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                To change your plan, contact <a href="mailto:hello@simvault.io" className="text-primary hover:underline">hello@simvault.io</a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* API Access */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">API Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              SimVault provides a full REST API to integrate with your existing tools. All endpoints require authenticated sessions and are scoped to your tenant.
            </p>
            <div className="bg-muted/50 border rounded-lg p-4 font-mono text-sm space-y-1">
              <div className="text-muted-foreground">Base URL</div>
              <div className="text-foreground font-semibold">{window.location.origin}/api</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {["/api/bays", "/api/bookings", "/api/customers", "/api/memberships"].map((ep) => (
                <div key={ep} className="bg-muted/30 border rounded px-3 py-2 font-mono text-xs text-muted-foreground">{ep}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Facility</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Facility Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Optional" />
            </div>
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Optional" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name.trim() || !form.email.trim()}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
