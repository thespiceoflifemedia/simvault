import { Button } from "@/components/ui/button";

export default function Legal() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Legal</h1>
        <Button>Save Changes</Button>
      </div>
      <div className="border rounded-md p-6 bg-card min-h-[400px] flex items-center justify-center text-muted-foreground">
        Legal documents and terms configuration interface
      </div>
    </div>
  );
}
