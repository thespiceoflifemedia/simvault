import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export default function Integrations() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Financial Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-md bg-muted/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">QuickBooks</h3>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Not Connected</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Sync your sales and revenue data automatically.</p>
              </div>
              <Button>Connect QuickBooks</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Provider</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <Checkbox id="payarc" defaultChecked />
              <label
                htmlFor="payarc"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Enable PayArc payments
              </label>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="merchantId">Merchant ID</Label>
                <Input id="merchantId" type="password" value="••••••••••••" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID</Label>
                <Input id="clientId" type="password" value="••••••••••••" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientSecret">Client Secret</Label>
                <Input id="clientSecret" type="password" value="••••••••••••••••••••••••" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secretKey">Secret Key</Label>
                <Input id="secretKey" type="password" value="••••••••••••••••••••••••" readOnly />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t z-10 md:left-[130px] flex items-center justify-between">
        <span className="text-sm text-muted-foreground">All changes saved</span>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
