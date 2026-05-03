import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, Zap } from "lucide-react";

const examples = [
  { code: "LAUNCH20", discount: "20% off", usage: "First booking only", expires: "Dec 31, 2025" },
  { code: "MEMBER10", discount: "$10 off", usage: "Members only", expires: "No expiry" },
  { code: "SUMMER25", discount: "25% off", usage: "Weekday bookings", expires: "Sep 1, 2025" },
];

export default function DiscountCodes() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Discount Codes</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Promo codes and coupon management</p>
        </div>
      </div>

      <div className="rounded-xl border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 p-5 flex items-start gap-3">
        <Zap className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Coming Soon</p>
          <p className="text-sm text-amber-700/80 dark:text-amber-400/80 mt-0.5">
            Discount code management is in development. Below is an example of how codes will appear. Contact <a href="mailto:hello@simvault.io" className="underline">hello@simvault.io</a> to be notified when it launches.
          </p>
        </div>
      </div>

      <div className="border rounded-md bg-card divide-y opacity-70">
        <div className="grid grid-cols-4 px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">
          <div>Code</div>
          <div>Discount</div>
          <div>Restrictions</div>
          <div>Expires</div>
        </div>
        {examples.map((c, i) => (
          <div key={i} className="grid grid-cols-4 px-4 py-3 text-sm items-center">
            <div className="font-mono font-bold text-primary flex items-center gap-1.5">
              <Tag className="h-3 w-3" />{c.code}
            </div>
            <div className="font-medium">{c.discount}</div>
            <div className="text-muted-foreground">{c.usage}</div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{c.expires}</Badge>
            </div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Planned discount types</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
          {[
            "Percentage off any booking",
            "Fixed dollar amount off",
            "Free add-ons (food & beverage)",
            "Membership discount extensions",
            "Time-restricted codes (happy hour)",
            "Single-use personal codes",
          ].map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-primary">✓</span> {d}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
