import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const roleColors: Record<string, string> = {
  owner: "bg-purple-50 text-purple-700 border-purple-200",
  admin: "bg-blue-50 text-blue-700 border-blue-200",
  staff: "bg-gray-50 text-gray-700 border-gray-200",
};

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/employees", { credentials: "include" })
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setEmployees(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Users with access to your SimVault account</p>
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      )}

      {!loading && employees.length === 0 && (
        <div className="border border-dashed rounded-xl p-12 text-center">
          <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No team members found</h3>
          <p className="text-muted-foreground text-sm">Team member management coming soon.</p>
        </div>
      )}

      {!loading && employees.length > 0 && (
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{emp.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{emp.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${roleColors[emp.role] ?? ""} capitalize text-xs`}>
                      {emp.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(emp.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="bg-muted/30 border rounded-xl p-5 text-sm text-muted-foreground">
        <strong className="text-foreground">Inviting team members</strong> — multi-user access and role management is on the SimVault roadmap. Contact <a href="mailto:hello@simvault.io" className="text-primary hover:underline">hello@simvault.io</a> if you need access added urgently.
      </div>
    </div>
  );
}
