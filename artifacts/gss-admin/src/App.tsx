import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { MarketingLayout } from "@/components/marketing-layout";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/protected-route";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/dashboard";
import Facilities from "@/pages/facilities";
import Reports from "@/pages/reports";
import Bookings from "@/pages/bookings";
import Details from "@/pages/details";
import Bays from "@/pages/bays";
import Memberships from "@/pages/memberships";
import POS from "@/pages/pos";
import Passes from "@/pages/passes";
import DiscountCodes from "@/pages/discount-codes";
import Employees from "@/pages/employees";
import Integrations from "@/pages/integrations";
import Legal from "@/pages/legal";
import Customers from "@/pages/customers";
import Schedules from "@/pages/schedules";
import Notifications from "@/pages/notifications";
import Audits from "@/pages/audits";
import Support from "@/pages/support";

import Home from "@/pages/marketing/home";
import About from "@/pages/marketing/about";
import Software from "@/pages/marketing/software";
import Contact from "@/pages/marketing/contact";
import Login from "@/pages/login";

const queryClient = new QueryClient();

function AdminRouter() {
  return (
    <ProtectedRoute>
      <Layout>
        <Switch>
          <Route path="/admin" component={Dashboard} />
          <Route path="/admin/facilities" component={Facilities} />
          <Route path="/admin/reports" component={Reports} />
          <Route path="/admin/bookings" component={Bookings} />
          <Route path="/admin/details" component={Details} />
          <Route path="/admin/bays" component={Bays} />
          <Route path="/admin/memberships" component={Memberships} />
          <Route path="/admin/pos" component={POS} />
          <Route path="/admin/passes" component={Passes} />
          <Route path="/admin/discount-codes" component={DiscountCodes} />
          <Route path="/admin/employees" component={Employees} />
          <Route path="/admin/integrations" component={Integrations} />
          <Route path="/admin/legal" component={Legal} />
          <Route path="/admin/customers" component={Customers} />
          <Route path="/admin/schedules" component={Schedules} />
          <Route path="/admin/notifications" component={Notifications} />
          <Route path="/admin/audits" component={Audits} />
          <Route path="/admin/org/support" component={Support} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </ProtectedRoute>
  );
}

function MarketingRouter() {
  return (
    <MarketingLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/software" component={Software} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </MarketingLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/admin/*" component={AdminRouter} />
      <Route path="/admin" component={AdminRouter} />
      <Route path="/*" component={MarketingRouter} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
