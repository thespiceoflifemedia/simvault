import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
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

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/facilities" component={Facilities} />
      <Route path="/reports" component={Reports} />
      <Route path="/bookings" component={Bookings} />
      <Route path="/details" component={Details} />
      <Route path="/bays" component={Bays} />
      <Route path="/memberships" component={Memberships} />
      <Route path="/pos" component={POS} />
      <Route path="/passes" component={Passes} />
      <Route path="/discount-codes" component={DiscountCodes} />
      <Route path="/employees" component={Employees} />
      <Route path="/integrations" component={Integrations} />
      <Route path="/legal" component={Legal} />
      <Route path="/customers" component={Customers} />
      <Route path="/schedules" component={Schedules} />
      <Route path="/notifications" component={Notifications} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Layout>
            <Router />
          </Layout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
