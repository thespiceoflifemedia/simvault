import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface AuditEntry {
  id: number;
  action: string;
  entity: string;
  entityId: string;
  description: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  status: "success" | "warning" | "info";
}

const actionColors: Record<string, string> = {
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

function generateAudits(userName: string): AuditEntry[] {
  const base = new Date();
  const ago = (mins: number) => new Date(base.getTime() - mins * 60 * 1000).toISOString();

  return [
    { id: 1, action: "LOGIN", entity: "Auth", entityId: "-", description: "Signed in successfully", actor: userName, actorRole: "owner", timestamp: ago(5), status: "success" },
    { id: 2, action: "BOOKING_CREATED", entity: "Booking", entityId: "#142", description: "Created booking for Bay 1 — John Smith", actor: userName, actorRole: "owner", timestamp: ago(38), status: "success" },
    { id: 3, action: "CUSTOMER_UPDATED", entity: "Customer", entityId: "#28", description: "Updated phone number for Sarah Johnson", actor: userName, actorRole: "owner", timestamp: ago(62), status: "info" },
    { id: 4, action: "BOOKING_CANCELLED", entity: "Booking", entityId: "#139", description: "Cancelled booking — Mike Davis (no-show)", actor: userName, actorRole: "owner", timestamp: ago(95), status: "warning" },
    { id: 5, action: "BAY_UPDATED", entity: "Bay", entityId: "Bay 2", description: "Changed status to inactive for maintenance", actor: userName, actorRole: "owner", timestamp: ago(140), status: "warning" },
    { id: 6, action: "MEMBERSHIP_CREATED", entity: "Membership", entityId: "#31", description: "Created Monthly Unlimited membership for Tom Lee", actor: userName, actorRole: "owner", timestamp: ago(220), status: "success" },
    { id: 7, action: "TENANT_UPDATED", entity: "Facility", entityId: "-", description: "Updated facility address", actor: userName, actorRole: "owner", timestamp: ago(380), status: "info" },
    { id: 8, action: "BOOKING_CREATED", entity: "Booking", entityId: "#141", description: "Created booking for Bay 3 — Emily Clark", actor: userName, actorRole: "owner", timestamp: ago(490), status: "success" },
    { id: 9, action: "CUSTOMER_CREATED", entity: "Customer", entityId: "#52", description: "Added new customer — Alex Turner", actor: userName, actorRole: "owner", timestamp: ago(720), status: "success" },
    { id: 10, action: "BAY_UPDATED", entity: "Bay", entityId: "Bay 2", description: "Restored Bay 2 to active status", actor: userName, actorRole: "owner", timestamp: ago(890), status: "success" },
    { id: 11, action: "MEMBERSHIP_CANCELLED", entity: "Membership", entityId: "#27", description: "Cancelled membership — Chris Nguyen (request)", actor: userName, actorRole: "owner", timestamp: ago(1200), status: "warning" },
    { id: 12, action: "BOOKING_UPDATED", entity: "Booking", entityId: "#137", description: "Rescheduled booking from Bay 1 to Bay 4", actor: userName, actorRole: "owner", timestamp: ago(1440), status: "info" },
    { id: 13, action: "LOGIN", entity: "Auth", entityId: "-", description: "Signed in successfully", actor: userName, actorRole: "owner", timestamp: ago(1500), status: "success" },
    { id: 14, action: "CUSTOMER_CREATED", entity: "Customer", entityId: "#51", description: "Added new customer — Rachel Kim", actor: userName, actorRole: "owner", timestamp: ago(2880), status: "success" },
    { id: 15, action: "BOOKING_CREATED", entity: "Booking", entityId: "#136", description: "Created booking for Bay 2 — Rachel Kim", actor: userName, actorRole: "owner", timestamp: ago(2900), status: "success" },
  ];
}

const formatRelative = (iso: string) => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const actionLabel = (action: string) => action.replace(/_/g, " ");

const entityColors: Record<string, string> = {
  Auth: "bg-gray-100 text-gray-600",
  Booking: "bg-violet-50 text-violet-700",
  Customer: "bg-emerald-50 text-emerald-700",
  Bay: "bg-blue-50 text-blue-700",
  Membership: "bg-amber-50 text-amber-700",
  Facility: "bg-rose-50 text-rose-700",
};

export default function Audits() {
  const { user } = useAuth();
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterEntity, setFilterEntity] = useState("all");

  useEffect(() => {
    setTimeout(() => {
      setAudits(generateAudits(user?.name ?? "Admin"));
      setLoading(false);
    }, 400);
  }, [user]);

  const filtered = audits.filter((a) => {
    const q = search.toLowerCase();
    const entityMatch = filterEntity === "all" || a.entity === filterEntity;
    return entityMatch && (
      a.description.toLowerCase().includes(q) ||
      a.action.toLowerCase().includes(q) ||
      a.entity.toLowerCase().includes(q) ||
      a.actor.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
          <p className="text-muted-foreground text-sm mt-0.5">A record of all actions taken in your account</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search actions, entities, descriptions…"
            className="pl-9 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterEntity} onValueChange={setFilterEntity}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All entities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All entities</SelectItem>
            <SelectItem value="Auth">Auth</SelectItem>
            <SelectItem value="Booking">Booking</SelectItem>
            <SelectItem value="Customer">Customer</SelectItem>
            <SelectItem value="Bay">Bay</SelectItem>
            <SelectItem value="Membership">Membership</SelectItem>
            <SelectItem value="Facility">Facility</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="border border-dashed rounded-xl p-12 text-center">
          <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No audit entries found</h3>
          <p className="text-muted-foreground text-sm">Try adjusting your search or filter.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="border rounded-md bg-card overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground bg-muted/50 px-4 py-2.5 border-b">
            <div className="w-24 mr-4">Action</div>
            <div>Description</div>
            <div className="w-24 text-center mr-4">Entity</div>
            <div className="w-24 text-right">When</div>
          </div>
          <div className="divide-y">
            {filtered.map((entry) => (
              <div key={entry.id} className="grid grid-cols-[auto_1fr_auto_auto] gap-0 items-center px-4 py-3 hover:bg-muted/20 transition-colors">
                <div className="w-24 mr-4">
                  <Badge variant="outline" className={`text-[10px] uppercase tracking-wide whitespace-nowrap ${actionColors[entry.status]}`}>
                    {actionLabel(entry.action).split(" ")[0]}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium">{entry.description}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">by {entry.actor} ({entry.actorRole})</div>
                </div>
                <div className="w-24 text-center mr-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${entityColors[entry.entity] ?? "bg-muted text-muted-foreground"}`}>
                    {entry.entity}
                  </span>
                </div>
                <div className="w-24 text-right">
                  <div className="text-xs text-muted-foreground">{formatRelative(entry.timestamp)}</div>
                  <div className="text-[10px] text-muted-foreground/60">
                    {new Date(entry.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
