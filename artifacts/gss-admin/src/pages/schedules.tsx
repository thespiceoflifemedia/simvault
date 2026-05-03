import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, Zap } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const slots = [
  { label: "Morning", time: "8:00 AM – 12:00 PM", rate: "$35/hr" },
  { label: "Afternoon", time: "12:00 PM – 5:00 PM", rate: "$45/hr" },
  { label: "Evening", time: "5:00 PM – 10:00 PM", rate: "$55/hr" },
];

export default function Schedules() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Schedules & Pricing</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Time-based bay pricing and availability windows</p>
        </div>
      </div>

      <div className="rounded-xl border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 p-5 flex items-start gap-3">
        <Zap className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Coming Soon</p>
          <p className="text-sm text-amber-700/80 dark:text-amber-400/80 mt-0.5">
            Dynamic scheduling and time-block pricing are in development. Below is a preview of the planned interface.
          </p>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden opacity-70">
        <div className="bg-muted/50 px-4 py-3 flex items-center gap-2 border-b">
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Weekly Rate Schedule — Example</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/20">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Time Block</th>
                {days.map((d) => (
                  <th key={d} className="px-3 py-2.5 font-medium text-muted-foreground text-center">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {slots.map((slot, i) => (
                <tr key={i} className="hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="font-medium">{slot.label}</div>
                    <div className="text-xs text-muted-foreground">{slot.time}</div>
                  </td>
                  {days.map((d) => (
                    <td key={d} className="px-3 py-3 text-center">
                      <Badge variant="outline" className={`text-xs whitespace-nowrap ${i === 2 ? "bg-primary/5 border-primary/20 text-primary" : ""}`}>
                        {slot.rate}
                      </Badge>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Planned scheduling features</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
          {[
            "Time-block pricing per bay",
            "Weekend vs weekday rate splits",
            "Blackout dates and closures",
            "Happy hour automatic discounts",
            "Member-only booking windows",
            "Advance booking limit rules",
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-primary">✓</span> {f}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
