import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, ShoppingCart, Receipt, Smartphone, Zap } from "lucide-react";

const features = [
  {
    icon: <ShoppingCart className="h-6 w-6 text-primary" />,
    title: "Bay-Side Ordering",
    desc: "Guests scan a QR code at their bay to order food and drinks. Orders go straight to the kitchen.",
  },
  {
    icon: <UtensilsCrossed className="h-6 w-6 text-primary" />,
    title: "Menu Management",
    desc: "Build your menu with categories, modifiers, and availability windows. Toggle items on and off instantly.",
  },
  {
    icon: <Receipt className="h-6 w-6 text-primary" />,
    title: "Unified Billing",
    desc: "F&B charges are added directly to the booking tab. One payment at checkout — no split bills.",
  },
  {
    icon: <Smartphone className="h-6 w-6 text-primary" />,
    title: "Mobile POS",
    desc: "Staff can take orders and process payments from any device. No dedicated hardware required.",
  },
];

const menuExample = [
  { name: "Beer (Draft)", price: "$7", category: "Drinks" },
  { name: "House Wine", price: "$10", category: "Drinks" },
  { name: "Loaded Fries", price: "$12", category: "Food" },
  { name: "Chicken Sliders (3)", price: "$14", category: "Food" },
  { name: "Nachos", price: "$13", category: "Food" },
  { name: "Sparkling Water", price: "$4", category: "Drinks" },
];

export default function POS() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Point of Sale</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Food, beverage, and retail ordering at the bay</p>
        </div>
      </div>

      <div className="rounded-xl border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 p-5 flex items-start gap-3">
        <Zap className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Coming Soon — Growth & Pro plans</p>
          <p className="text-sm text-amber-700/80 dark:text-amber-400/80 mt-0.5">
            The POS module is in development for Growth and Pro customers. Below is a preview of the planned experience.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((f, i) => (
          <Card key={i} className="opacity-75">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                {f.icon}
              </div>
              <CardTitle className="text-base">{f.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="opacity-70">
        <CardHeader>
          <CardTitle className="text-base">Example Menu Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y border rounded-md">
            {menuExample.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.name}</span>
                  <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                </div>
                <span className="font-bold">{item.price}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
