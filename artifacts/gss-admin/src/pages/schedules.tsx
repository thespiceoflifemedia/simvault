import { Button } from "@/components/ui/button";

export default function Schedules() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Schedules</h1>
        <Button>Add Schedule</Button>
      </div>
      <div className="border rounded-md p-6 bg-card min-h-[400px] flex items-center justify-center text-muted-foreground">
        Schedule management interface
      </div>
    </div>
  );
}
