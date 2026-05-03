import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail, Phone, MapPin, CreditCard, Calendar } from "lucide-react";
import { useAuth } from "@/lib/auth";

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

const planBadgeClass: Record<string, string> = {
  starter: "bg-gray-50 text-gray-700 border-gray-200",
  growth: "bg-blue-50 text-blue-700 border-blue-200",
  pro: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function Facilities() {
  const { tenant: authTenant } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tenant", { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { setTenant(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const name = tenant?.name ?? authTenant?.name ?? "Your Facility";
  const plan = tenant?.plan ?? authTenant?.plan ?? "starter";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Facility</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Your SimVault account and facility overview</p>
        </div>
      </div>

      {tenant && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">{name}</CardTitle>
                <Badge variant="outline" className={`text-xs ml-auto ${planBadgeClass[plan] ?? ""}`}>
                  {plan.charAt(0).toUpperCase() + plan.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span>{tenant.email}</span>
              </div>
              {tenant.phone && (
                <div className="flex items-start gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span>{tenant.phone}</span>
                </div>
              )}
              {tenant.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span>{tenant.address}</span>
                </div>
              )}
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Member since {new Date(tenant.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Plan Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/40 border">
                <span className="font-semibold capitalize">{plan} Plan</span>
                <Badge variant="outline" className={planBadgeClass[plan] ?? ""}>Active</Badge>
              </div>
              <div className="text-sm text-muted-foreground space-y-1.5">
                {plan === "starter" && (
                  <>
                    <div className="flex items-center gap-1.5"><span className="text-primary">✓</span> Up to 4 bays</div>
                    <div className="flex items-center gap-1.5"><span className="text-primary">✓</span> Bay scheduling, memberships & CRM</div>
                  </>
                )}
                {plan === "growth" && (
                  <>
                    <div className="flex items-center gap-1.5"><span className="text-primary">✓</span> Up to 10 bays</div>
                    <div className="flex items-center gap-1.5"><span className="text-primary">✓</span> POS, staff scheduler, loyalty</div>
                  </>
                )}
                {plan === "pro" && (
                  <>
                    <div className="flex items-center gap-1.5"><span className="text-primary">✓</span> Unlimited bays</div>
                    <div className="flex items-center gap-1.5"><span className="text-primary">✓</span> Full POS, advanced CRM, multi-location</div>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground pt-1 border-t">
                To upgrade or change your plan, email <a href="mailto:hello@simvault.io" className="text-primary hover:underline">hello@simvault.io</a>
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
