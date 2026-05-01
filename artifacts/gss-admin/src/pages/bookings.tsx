import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Search, Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function Bookings() {
  const bays = [
    "Indoor Batting Cage 1",
    "Indoor Batting Cage 2",
    "Indoor Batting Cage 3",
    "MultiSport Golf Sim",
    "MultiSport Golf Sim 2",
    "Outdoor Batting Cage"
  ];

  const hours = Array.from({ length: 16 }, (_, i) => i + 8); // 8 AM to 11 PM

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border p-1 bg-muted/20">
            <Button variant="ghost" size="sm" className="px-4 bg-background shadow-sm">Day</Button>
            <Button variant="ghost" size="sm" className="px-4 text-muted-foreground">Month</Button>
          </div>
          
          <div className="flex items-center gap-1 ml-4">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-3 ml-1 font-medium">
              Today
            </Button>
            <span className="text-lg font-bold ml-3">Oct 24, 2023</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[250px]">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search bookings..." className="pl-8 h-8" />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="h-4 w-4 mr-2" />
                Quick Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Filter By</h4>
                <div className="text-sm text-muted-foreground">No active filters</div>
              </div>
            </PopoverContent>
          </Popover>
          <Button size="sm" className="h-8 bg-primary">
            <Plus className="h-4 w-4 mr-1" /> Create Booking / Event
          </Button>
        </div>
      </div>

      <div className="flex-1 border rounded-lg bg-card overflow-auto flex flex-col relative">
        <div className="flex border-b sticky top-0 bg-muted/50 z-10">
          <div className="w-20 border-r flex-shrink-0"></div>
          {bays.map((bay, i) => (
            <div key={i} className="flex-1 min-w-[150px] p-3 text-center border-r last:border-r-0 font-medium text-sm truncate">
              {bay}
            </div>
          ))}
        </div>
        
        <div className="flex-1 relative min-w-max">
          {hours.map((hour) => (
            <div key={hour} className="flex border-b h-20 group relative">
              <div className="w-20 border-r flex-shrink-0 p-2 text-right text-xs text-muted-foreground font-medium sticky left-0 bg-card z-10">
                {hour === 12 ? '12:00 PM' : hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
              </div>
              {bays.map((_, i) => (
                <div key={i} className="flex-1 min-w-[150px] border-r last:border-r-0 relative hover:bg-accent/10 transition-colors">
                  {/* Grid lines for half hours */}
                  <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-border/50"></div>
                </div>
              ))}
            </div>
          ))}
          
          {/* Current time line mock */}
          <div className="absolute left-20 right-0 top-[250px] border-t-2 border-red-500 z-20 pointer-events-none">
            <div className="absolute -left-[7px] -top-[5px] w-3 h-3 rounded-full bg-red-500"></div>
          </div>

          {/* Mock Booking */}
          <div className="absolute left-[calc(5rem+150px*3+1rem)] top-[160px] h-[120px] w-[calc(150px-2rem)] bg-blue-100 border border-blue-300 rounded-md p-2 z-10 overflow-hidden shadow-sm">
            <div className="text-xs font-bold text-blue-800">John Doe</div>
            <div className="text-[10px] text-blue-600">10:00 AM - 11:30 AM</div>
            <div className="text-[10px] text-blue-600 mt-1">MultiSport Golf Sim</div>
          </div>
        </div>
      </div>
    </div>
  );
}
