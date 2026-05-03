import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, TrendingUp, Lock, BookOpen, CheckCircle2, XCircle, Plug, ChevronRight } from "lucide-react";

type Status = "available" | "connected" | "coming-soon";

interface Integration {
  id: string;
  icon: React.ReactNode;
  name: string;
  description: string;
  status: Status;
  category: string;
  connectFields?: { id: string; label: string; placeholder: string; type?: string }[];
}

const INTEGRATIONS: Integration[] = [
  {
    id: "stripe",
    icon: <DollarSign className="h-5 w-5" />,
    name: "Stripe",
    description: "Accept card payments online and at the bay. Connect your Stripe account to enable booking payments and automatic invoicing.",
    status: "available",
    category: "Payments",
    connectFields: [
      { id: "publishable_key", label: "Publishable Key", placeholder: "pk_live_..." },
      { id: "secret_key", label: "Secret Key", placeholder: "sk_live_...", type: "password" },
    ],
  },
  {
    id: "square",
    icon: <DollarSign className="h-5 w-5" />,
    name: "Square",
    description: "In-person and online payment processing via Square. Import existing customer data and transactions.",
    status: "available",
    category: "Payments",
    connectFields: [
      { id: "access_token", label: "Access Token", placeholder: "EAAAl...", type: "password" },
      { id: "location_id", label: "Location ID", placeholder: "LXXXXXXXXXXXXXXXXX" },
    ],
  },
  {
    id: "quickbooks",
    icon: <TrendingUp className="h-5 w-5" />,
    name: "QuickBooks",
    description: "Automatically sync daily revenue, invoices, and refunds to QuickBooks for seamless bookkeeping.",
    status: "coming-soon",
    category: "Accounting",
  },
  {
    id: "remotelock",
    icon: <Lock className="h-5 w-5" />,
    name: "RemoteLock",
    description: "Automate door and bay access via smart locks. Doors unlock when a confirmed booking starts.",
    status: "coming-soon",
    category: "Access Control",
  },
  {
    id: "mailchimp",
    icon: <BookOpen className="h-5 w-5" />,
    name: "Mailchimp",
    description: "Sync your customer list for email marketing. Segment members, trial customers, and one-time visitors.",
    status: "coming-soon",
    category: "Marketing",
  },
];

const statusConfig: Record<Status, { label: string; className: string }> = {
  available: { label: "Available", className: "bg-green-50 text-green-700 border-green-200" },
  connected: { label: "Connected", className: "bg-blue-50 text-blue-700 border-blue-200" },
  "coming-soon": { label: "Coming Soon", className: "bg-amber-50 text-amber-700 border-amber-200" },
};

export default function Integrations() {
  const { toast } = useToast();
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [connectTarget, setConnectTarget] = useState<Integration | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [disconnectTarget, setDisconnectTarget] = useState<string | null>(null);
  const [notifyTarget, setNotifyTarget] = useState<Integration | null>(null);
  const [notifyEmail, setNotifyEmail] = useState("");

  const getStatus = (id: string, defaultStatus: Status): Status => statuses[id] ?? defaultStatus;

  const openConnect = (integration: Integration) => {
    setConnectTarget(integration);
    setFields({});
  };

  const handleConnect = async () => {
    if (!connectTarget) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setStatuses((s) => ({ ...s, [connectTarget.id]: "connected" }));
    setSaving(false);
    setConnectTarget(null);
    toast({ title: `${connectTarget.name} connected`, description: "The integration is now active on your account." });
  };

  const handleDisconnect = () => {
    if (!disconnectTarget) return;
    setStatuses((s) => ({ ...s, [disconnectTarget]: "available" }));
    const name = INTEGRATIONS.find((i) => i.id === disconnectTarget)?.name;
    setDisconnectTarget(null);
    toast({ title: `${name} disconnected` });
  };

  const handleNotify = () => {
    if (!notifyTarget || !notifyEmail.trim()) return;
    toast({ title: "You'll be notified", description: `We'll email ${notifyEmail} when ${notifyTarget.name} is available.` });
    setNotifyTarget(null);
    setNotifyEmail("");
  };

  const categories = [...new Set(INTEGRATIONS.map((i) => i.category))];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Connect SimVault with the tools your facility already uses</p>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category}>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{category}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {INTEGRATIONS.filter((i) => i.category === category).map((integration) => {
                const status = getStatus(integration.id, integration.status);
                const cfg = statusConfig[status];
                return (
                  <Card key={integration.id} className={status === "connected" ? "border-primary/30 bg-primary/5" : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${status === "connected" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                            {integration.icon}
                          </div>
                          <div>
                            <CardTitle className="text-sm">{integration.name}</CardTitle>
                          </div>
                        </div>
                        <Badge variant="outline" className={`text-xs ${cfg.className}`}>
                          {status === "connected" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {cfg.label}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm leading-relaxed mt-2">{integration.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {status === "connected" ? (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-xs flex-1" disabled>
                            <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" /> Connected
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive" onClick={() => setDisconnectTarget(integration.id)}>
                            <XCircle className="h-3 w-3 mr-1" /> Disconnect
                          </Button>
                        </div>
                      ) : status === "available" ? (
                        <Button variant="outline" size="sm" className="text-xs" onClick={() => openConnect(integration)}>
                          <Plug className="h-3.5 w-3.5 mr-1.5" /> Connect
                          <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="text-xs" onClick={() => setNotifyTarget(integration)}>
                          Notify Me
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Connect dialog */}
      <Dialog open={connectTarget !== null} onOpenChange={() => setConnectTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect {connectTarget?.name}</DialogTitle>
            <DialogDescription>Enter your {connectTarget?.name} credentials to link your account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {connectTarget?.connectFields?.map((f) => (
              <div key={f.id} className="space-y-1.5">
                <Label>{f.label} <span className="text-destructive">*</span></Label>
                <Input
                  type={f.type ?? "text"}
                  placeholder={f.placeholder}
                  value={fields[f.id] ?? ""}
                  onChange={(e) => setFields({ ...fields, [f.id]: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Your credentials are encrypted and stored securely. SimVault will never share them with third parties.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConnectTarget(null)}>Cancel</Button>
            <Button
              onClick={handleConnect}
              disabled={saving || !connectTarget?.connectFields?.every((f) => (fields[f.id] ?? "").trim())}
            >
              {saving ? "Connecting…" : `Connect ${connectTarget?.name}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disconnect confirm */}
      <Dialog open={disconnectTarget !== null} onOpenChange={() => setDisconnectTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect {INTEGRATIONS.find((i) => i.id === disconnectTarget)?.name}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This will remove the integration from your account. You can reconnect at any time.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisconnectTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDisconnect}>Disconnect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notify me dialog */}
      <Dialog open={notifyTarget !== null} onOpenChange={() => setNotifyTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Get notified — {notifyTarget?.name}</DialogTitle>
            <DialogDescription>We'll email you as soon as this integration is available.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Email address <span className="text-destructive">*</span></Label>
              <Input type="email" placeholder="you@facility.com" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotifyTarget(null)}>Cancel</Button>
            <Button onClick={handleNotify} disabled={!notifyEmail.trim()}>Notify Me</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
