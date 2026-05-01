import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Building,
  Users,
  BookOpen,
  ClipboardCheck,
  LifeBuoy,
  Settings,
  Home,
  FileBarChart,
  CalendarDays,
  Info,
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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const orgNav = [
  { name: "SimVault", path: "/admin/org", icon: Building },
  { name: "Facilities", path: "/admin/facilities", icon: Building },
  { name: "Employees", path: "/admin/org/employees", icon: Users },
  { name: "Training Library", path: "/admin/org/training", icon: BookOpen },
  { name: "Audits", path: "/admin/org/audits", icon: ClipboardCheck },
  { name: "Support", path: "/admin/org/support", icon: LifeBuoy },
  { name: "Organization", path: "/admin/org/settings", icon: Settings },
];

const facilityNav = [
  { name: "Home", path: "/home", icon: Home },
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Reports", path: "/admin/reports", icon: FileBarChart },
  { name: "Bookings", path: "/admin/bookings", icon: CalendarDays },
  { name: "Details", path: "/admin/details", icon: Info },
  { name: "Bays", path: "/admin/bays", icon: LayoutGrid },
  { name: "Memberships", path: "/admin/memberships", icon: CreditCard },
  { name: "POS", path: "/admin/pos", icon: Monitor },
  { name: "Passes", path: "/admin/passes", icon: Ticket },
  { name: "Discount Codes", path: "/admin/discount-codes", icon: Tag },
  { name: "Employees", path: "/admin/employees", icon: Users },
  { name: "Integrations", path: "/admin/integrations", icon: Puzzle },
  { name: "Legal", path: "/admin/legal", icon: FileText },
  { name: "Customers", path: "/admin/customers", icon: Users },
  { name: "Schedules", path: "/admin/schedules", icon: Clock },
  { name: "Notifications", path: "/admin/notifications", icon: Bell },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isOrgLevel = location.startsWith("/admin/org") || location === "/admin/facilities";
  const currentNav = isOrgLevel ? orgNav : facilityNav;

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-card z-50 flex items-center px-4">
        <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
        <span className="ml-4 font-bold">GAME TIME</span>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:w-[130px] flex flex-col ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary-foreground">GT</span>
          </div>
          <span className="font-bold text-sm tracking-tight hidden md:block lg:hidden">GAME<br/>TIME</span>
          <span className="font-bold tracking-tight block md:hidden lg:block">GAME TIME</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {currentNav.map((item) => {
              const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
              return (
                <Link key={item.name} href={item.path}>
                  <div
                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-md transition-colors cursor-pointer ${
                      isActive
                        ? "bg-primary/10 text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-medium text-center">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/20 text-primary">D</AvatarFallback>
            </Avatar>
            <div className="text-center md:hidden lg:block">
              <p className="text-xs font-medium">Danielle Zackman</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pt-16 md:pt-0">
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
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
