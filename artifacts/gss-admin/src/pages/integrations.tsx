import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, BookOpen, DollarSign, Lock, TrendingUp } from "lucide-react";

const integrations = [
  {
    icon: <DollarSign className="h-5 w-5" />,
    name: "Stripe",
    description: "Accept card payments online and at the bay. Connect your Stripe account to enable booking payments.",
    status: "available",
    category: "Payments",
  },
  {
    icon: <DollarSign className="h-5 w-5" />,
    name: "Square",
    description: "In-person and online payment processing via Square. Import existing customer data and transactions.",
    status: "available",
    category: "Payments",
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    name: "QuickBooks",
    description: "Automatically sync daily revenue, invoices, and refunds to QuickBooks for seamless bookkeeping.",
    status: "coming-soon",
    category: "Accounting",
  },
  {
    icon: <Lock className="h-5 w-5" />,
    name: "RemoteLock",
    description: "Automate door and bay access via smart locks. Doors unlock when a confirmed booking starts.",
    status: "coming-soon",
    category: "Access Control",
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    name: "Mailchimp",
    description: "Sync your customer list for email marketing. Segment members, trial customers, and one-time visitors.",
    status: "coming-soon",
    category: "Marketing",
  },
];

const statusMap: Record<string, { label: string; class: string }> = {
  available: { label: "Available", class: "bg-green-50 text-green-700 border-green-200" },
  connected: { label: "Connected", class: "bg-blue-50 text-blue-700 border-blue-200" },
  "coming-soon": { label: "Coming Soon", class: "bg-amber-50 text-amber-700 border-amber-200" },
};

export default function Integrations() {
  const categories = [...new Set(integrations.map((i) => i.category))];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Connect SimVault with the tools your facility already uses</p>
      </div>

      <div className="rounded-xl border bg-primary/5 border-primary/10 p-5 flex items-start gap-3">
        <Zap className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium">Integration setup</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Integration configuration is managed by the SimVault team during onboarding. Contact <a href="mailto:hello@simvault.io" className="text-primary hover:underline">hello@simvault.io</a> to connect a service to your account.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category}>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{category}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {integrations
                .filter((i) => i.category === category)
                .map((integration, j) => (
                  <Card key={j}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                            {integration.icon}
                          </div>
                          <CardTitle className="text-base">{integration.name}</CardTitle>
                        </div>
                        <Badge variant="outline" className={`text-xs ${statusMap[integration.status]?.class ?? ""}`}>
                          {statusMap[integration.status]?.label}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm leading-relaxed">{integration.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={integration.status === "coming-soon"}
                        className="text-xs"
                      >
                        {integration.status === "coming-soon" ? "Notify Me" : "Connect"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
