import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, GripVertical, Edit2, Trash2 } from "lucide-react";
import { Link } from "wouter";

export default function Bays() {
  const bays = [
    { name: "Indoor Batting Cage 1", active: true, players: "1-6", hours: "Custom", desc: "Regular bay" },
    { name: "Indoor Batting Cage 2", active: true, players: "1-4", hours: "Custom", desc: "Regular bay" },
    { name: "Indoor Batting Cage 3", active: true, players: "1-6", hours: "Custom", desc: "Regular bay" },
    { name: "MultiSport Golf Sim", active: true, players: "1-6", hours: "Custom", desc: "Regular bay" },
    { name: "MultiSport Golf Sim 2", active: true, players: "1-6", hours: "Custom", desc: "Regular bay" },
    { name: "Outdoor Batting Cage", active: true, players: "1-6", hours: "Custom", desc: "Regular bay" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Bays</h1>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Add Bay
        </Button>
      </div>

      <div className="border rounded-md bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12 text-center"></TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Active</TableHead>
              <TableHead className="font-semibold">Players</TableHead>
              <TableHead className="font-semibold">Hours</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bays.map((bay, i) => (
              <TableRow key={i} className="hover:bg-muted/30">
                <TableCell className="text-center text-muted-foreground/50">
                  <GripVertical className="h-4 w-4 mx-auto cursor-grab" />
                </TableCell>
                <TableCell className="font-medium text-primary">
                  <Link href={`/bays/${i}`} className="hover:underline">{bay.name}</Link>
                </TableCell>
                <TableCell>
                  {bay.active ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 uppercase text-[10px] tracking-wider">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 uppercase text-[10px] tracking-wider">
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm">{bay.players}</TableCell>
                <TableCell className="text-sm">
                  <div className="flex items-center gap-2">
                    {bay.hours}
                    <Button variant="link" size="sm" className="h-auto p-0 text-primary text-xs">View</Button>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{bay.desc}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
