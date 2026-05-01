import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { History, LayoutList, DollarSign, Clock } from "lucide-react";

export default function Reports() {
  const sections = [
    {
      title: "History",
      icon: <History className="h-5 w-5 text-primary" />,
      reports: [
        { name: "Booking History", description: "View past booking records and details" },
        { name: "Billing History", description: "View transaction and billing history" }
      ]
    },
    {
      title: "Daily Operations",
      icon: <LayoutList className="h-5 w-5 text-primary" />,
      reports: [
        { name: "End of Day", description: "Daily closing and summary reports" },
        { name: "Open Bills", description: "Currently open and unsettled bills" },
        { name: "Shift Report", description: "Employee shift operations and tills" }
      ]
    },
    {
      title: "Sales & Revenue",
      icon: <DollarSign className="h-5 w-5 text-primary" />,
      reports: [
        { name: "Monthly Revenue", description: "Revenue breakdown by month" },
        { name: "Quarterly Revenue", description: "High level quarterly performance" },
        { name: "Category Performance", description: "Sales categorized by type" }
      ]
    },
    {
      title: "Time & Trends",
      icon: <Clock className="h-5 w-5 text-primary" />,
      reports: [
        { name: "Peak Hours", description: "Busiest times of the day" },
        { name: "Peak Days", description: "Busiest days of the week" },
        { name: "Player Counts", description: "Average and total player metrics" }
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Select a Report</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section, index) => (
          <Card key={index} className="border-none shadow-md">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center gap-2">
                {section.icon}
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {section.reports.map((report, rIndex) => (
                  <div key={rIndex} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors group">
                    <div className="font-medium group-hover:text-primary transition-colors">{report.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">{report.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
