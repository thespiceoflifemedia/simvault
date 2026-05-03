import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Ticket, Clock, CreditCard, Zap } from "lucide-react";

const examplePasses = [
  {
    icon: <Ticket className="w-5 h-5 text-primary" />,
    name: "10-Round Punch Card",
    description: "Pre-purchased credit good for 10 hourly bay sessions. Credits never expire.",
    price: "$399",
    value: "10 sessions",
  },
  {
    icon: <Clock className="w-5 h-5 text-primary" />,
    name: "Monthly Hour Block",
    description: "20 hours of bay time to be used within a rolling 30-day window.",
    price: "$299",
    value: "20 hours",
  },
  {
    icon: <CreditCard className="w-5 h-5 text-primary" />,
    name: "Season Pass",
    description: "Unlimited access for a full 90-day season. Best value for frequent players.",
    price: "$599",
    value: "90 days unlimited",
  },
];

export default function Passes() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Passes</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Pre-purchased session packs and credit bundles</p>
        </div>
      </div>

      <div className="rounded-xl border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 p-5 flex items-start gap-3">
        <Zap className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Coming Soon</p>
          <p className="text-sm text-amber-700/80 dark:text-amber-400/80 mt-0.5">
            The Passes module is in development. Below is a preview of how it will work. Contact <a href="mailto:hello@simvault.io" className="underline">hello@simvault.io</a> to be notified when it launches.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {examplePasses.map((pass, i) => (
          <Card key={i} className="opacity-70">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                {pass.icon}
                <Badge variant="outline" className="text-xs">{pass.value}</Badge>
              </div>
              <CardTitle className="text-base">{pass.name}</CardTitle>
              <CardDescription className="text-sm">{pass.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{pass.price}</div>
              <p className="text-xs text-muted-foreground mt-1">per pass</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="border rounded-xl p-6 bg-muted/20">
        <h3 className="font-semibold mb-2">How passes will work</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2"><span className="text-primary font-bold">1.</span> Create pass types with configurable credits, hours, or unlimited access windows.</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">2.</span> Customers purchase passes online or at check-in. Credits are attached to their profile.</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">3.</span> Credits deduct automatically when bookings are confirmed — no manual tracking needed.</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">4.</span> View pass balances, usage history, and expiry dates per customer in the CRM.</li>
        </ul>
      </div>
    </div>
  );
}
