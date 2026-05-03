import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  UserCog,
  LifeBuoy,
  Settings,
  FileBarChart,
  CalendarDays,
  LayoutGrid,
  CreditCard,
  Monitor,
  Ticket,
  Tag,
  Puzzle,
  FileText,
  Clock,
  Bell,
  Menu,
  LogOut,
  Shield,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

function SimVaultLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-md bg-[#3b82f6] flex items-center justify-center flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="6" height="6" rx="1" fill="white"/>
          <rect x="10" y="2" width="6" height="6" rx="1" fill="white" fillOpacity="0.6"/>
          <rect x="2" y="10" width="6" height="6" rx="1" fill="white" fillOpacity="0.6"/>
          <rect x="10" y="10" width="6" height="6" rx="1" fill="white"/>
        </svg>
      </div>
      <span className="font-bold text-sm tracking-tight">SimVault</span>
    </div>
  );
}

const facilityNav = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Bookings", path: "/admin/bookings", icon: CalendarDays },
  { name: "Bays", path: "/admin/bays", icon: LayoutGrid },
  { name: "Customers", path: "/admin/customers", icon: Users },
  { name: "Memberships", path: "/admin/memberships", icon: CreditCard },
  { name: "POS", path: "/admin/pos", icon: Monitor },
  { name: "Passes", path: "/admin/passes", icon: Ticket },
  { name: "Discounts", path: "/admin/discount-codes", icon: Tag },
  { name: "Reports", path: "/admin/reports", icon: FileBarChart },
  { name: "Employees", path: "/admin/employees", icon: UserCog },
  { name: "Schedules", path: "/admin/schedules", icon: Clock },
  { name: "Integrations", path: "/admin/integrations", icon: Puzzle },
  { name: "Forms", path: "/admin/forms", icon: ClipboardList },
  { name: "Notices", path: "/admin/notifications", icon: Bell },
  { name: "Legal", path: "/admin/legal", icon: FileText },
  { name: "Audits", path: "/admin/audits", icon: Shield },
  { name: "Settings", path: "/admin/details", icon: Settings },
  { name: "Support", path: "/admin/org/support", icon: LifeBuoy },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, tenant, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 border-b bg-card z-50 flex items-center px-4 gap-3">
        <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
        <SimVaultLogo />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-[130px] bg-card border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static flex flex-col ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-14 border-b flex items-center justify-center px-3 flex-shrink-0">
          <Link href="/" onClick={() => setIsMobileOpen(false)}>
            <SimVaultLogo />
          </Link>
        </div>

        {/* Tenant badge */}
        {tenant && (
          <div className="px-3 py-2 border-b bg-muted/30 flex-shrink-0">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Facility</div>
            <div className="text-xs font-semibold truncate">{tenant.name}</div>
            <div className="text-[10px] text-muted-foreground capitalize">{tenant.plan} plan</div>
          </div>
        )}

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="space-y-0.5 px-2">
            {facilityNav.map((item) => {
              const isActive = item.exact
                ? location === item.path
                : location === item.path || location.startsWith(item.path + "/");
              return (
                <Link key={item.name} href={item.path} onClick={() => setIsMobileOpen(false)}>
                  <div
                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#3b82f6]/10 text-[#3b82f6]"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4 mb-1" />
                    <span className="text-[10px] font-medium text-center leading-tight">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User footer */}
        <div className="border-t p-3 flex-shrink-0 space-y-2">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="text-center w-full">
              <p className="text-[11px] font-semibold truncate">{user?.name ?? "—"}</p>
              <p className="text-[10px] text-muted-foreground capitalize truncate">{user?.role ?? ""}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-7 text-[10px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1"
            onClick={logout}
          >
            <LogOut className="h-3 w-3" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pt-14 md:pt-0">
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  );
}
