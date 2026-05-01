import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2 } from "lucide-react";

export default function Notifications() {
  const notifications = [
    { type: "BookingCancel", active: true },
    { type: "BookingConfirmation", active: true },
    { type: "BookingEnding", active: true },
    { type: "BookingMultipleConfirmation", active: true },
    { type: "BookingReminder", active: true },
    { type: "BookingReport", active: false },
    { type: "MembershipActive", active: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <div className="w-[180px]">
          <Select defaultValue="email">
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Message Type</TableHead>
              <TableHead className="font-semibold">Message</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold text-center">Active</TableHead>
              <TableHead className="text-right font-semibold">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notif, i) => (
              <TableRow key={i} className="hover:bg-muted/30">
                <TableCell className="font-medium">{notif.type}</TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[300px] truncate">
                  Template for {notif.type.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                    Email
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Switch checked={notif.active} />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 text-primary">
                    <Edit2 className="h-4 w-4 mr-2" /> Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
