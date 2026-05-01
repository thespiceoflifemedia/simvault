import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Code, Trash2, Edit, Lock, Info, MapPin, Clock } from "lucide-react";

export default function Details() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Gametime Sports Suite</h1>
            <Badge variant="secondary" className="font-mono text-xs font-semibold">GREEN EYE GIRL LLC</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" /> POS Link
          </Button>
          <Button variant="outline" size="sm">
            <Code className="h-4 w-4 mr-2" /> Embed Link
          </Button>
          <div className="w-px h-8 bg-border mx-1"></div>
          <Button variant="destructive" size="sm" className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 border">
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
          <Button variant="default" size="sm">
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">DESCRIPTION</Label>
                  <p className="text-sm">Premier indoor sports facility featuring state-of-the-art golf simulators and batting cages.</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> LOCATION
                  </Label>
                  <p className="text-sm">170 NW 20th St, Boca Raton, FL 33431, USA</p>
                  <div className="h-32 bg-muted rounded-md mt-2 flex items-center justify-center text-muted-foreground overflow-hidden border">
                    {/* Mock map embed */}
                    <div className="w-full h-full bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Boca+Raton,FL&zoom=13&size=400x200&sensor=false')] bg-cover bg-center opacity-50 grayscale"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1">
                    <Clock className="h-3 w-3" /> TIMEZONE
                  </Label>
                  <p className="text-sm font-medium">Eastern Daylight Time</p>
                  <p className="text-xs text-muted-foreground">Currently 9:46 AM</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Booking Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="font-semibold">Advance Booking Window</Label>
                    <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">30 days</span>
                  </div>
                  <p className="text-xs text-muted-foreground">How far in advance customers can book.</p>
                </div>

                <div className="space-y-3">
                  <Label className="font-semibold">Duration Limits</Label>
                  <div className="flex justify-between items-center text-sm p-2 rounded-md border bg-card">
                    <span className="text-muted-foreground">Minimum Duration</span>
                    <span className="font-medium">30 minutes</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <Label className="font-semibold text-muted-foreground">ADDITIONAL SETTINGS</Label>
                  <div className="text-sm text-muted-foreground italic">No additional settings configured.</div>
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-semibold">Online Payments</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Lock className="h-3 w-3 mr-1" /> Required
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Customers must pay when making a booking online.
                    </p>
                  </div>
                  
                  <div className="space-y-1 pt-4 border-t">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">CURRENCY</Label>
                    <div className="text-lg font-medium">USD ($)</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cancellation Fees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center p-3 rounded-md border bg-muted/20">
                    <div className="text-sm">
                      <span className="text-muted-foreground">When cancelled</span> <span className="font-medium">1 day before</span>
                    </div>
                    <div className="text-sm font-bold text-destructive">Fee 100%</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Last Minute Discounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground flex items-center justify-center p-6 border border-dashed rounded-md bg-muted/10">
                  <Info className="h-4 w-4 mr-2" /> No last minute discounts configured.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Taxes</CardTitle>
                <Button variant="ghost" size="sm">Edit Taxes</Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">FL State Tax (ST)</div>
                    <div className="font-bold text-lg">6%</div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Bookings</Badge>
                    <Badge variant="secondary">Passes</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hours">
          <Card>
            <CardContent className="p-10 text-center">
              <p className="text-muted-foreground">Hours configuration panel goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
