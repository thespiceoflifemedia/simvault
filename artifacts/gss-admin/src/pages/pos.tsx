import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, ShoppingCart, Receipt, Monitor, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  available: boolean;
  description: string;
}

interface OrderItem {
  menuItem: MenuItem;
  qty: number;
}

interface OpenTab {
  id: number;
  bay: string;
  customer: string;
  items: OrderItem[];
  openedAt: string;
}

const CATEGORIES = ["Food", "Drinks", "Retail", "Other"];
const emptyForm = { name: "", category: "Food", price: "", available: true, description: "" };

export default function POS() {
  const { toast } = useToast();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [tabs, setTabs] = useState<OpenTab[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [newTabOpen, setNewTabOpen] = useState(false);
  const [newTabBay, setNewTabBay] = useState("Bay 1");
  const [newTabCustomer, setNewTabCustomer] = useState("");
  const [checkoutId, setCheckoutId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [bays, setBays] = useState<{ id: number; name: string }[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [menuRes, baysRes] = await Promise.all([
        fetch("/api/pos-orders", { credentials: "include" }),
        fetch("/api/bays", { credentials: "include" }),
      ]);
      if (menuRes.ok) setMenu(await menuRes.json());
      if (baysRes.ok) setBays(await baysRes.json());
    } catch (e) {
      toast({ title: "Failed to load POS data", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({ name: item.name, category: item.category, price: String(item.price), available: item.available, description: item.description });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const priceNum = parseFloat(form.price);
    if (!form.name.trim() || isNaN(priceNum)) return;
    setSaving(true);
    const body = { name: form.name, category: form.category, price: priceNum, available: form.available, description: form.description };
    try {
      if (editing) {
        await fetch(`/api/pos-orders/${editing.id}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } else {
        await fetch("/api/pos-orders", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      }
      setDialogOpen(false);
      loadData();
      toast({ title: editing ? "Item updated" : "Item added" });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/pos-orders/${id}`, { method: "DELETE", credentials: "include" });
    setDeleteId(null);
    loadData();
    toast({ title: "Item removed" });
  };

  const toggleAvailable = async (id: number) => {
    const item = menu.find((m) => m.id === id);
    if (!item) return;
    await fetch(`/api/pos-orders/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, available: !item.available }),
    });
    loadData();
  };

  const openNewTab = () => { setNewTabBay(bays[0]?.name || "Bay 1"); setNewTabCustomer(""); setNewTabOpen(true); };
  const createTab = () => {
    if (!newTabCustomer.trim()) return;
    setTabs([...tabs, { id: Date.now(), bay: newTabBay, customer: newTabCustomer, items: [], openedAt: new Date().toISOString() }]);
    setNewTabOpen(false);
    toast({ title: `Tab opened for ${newTabCustomer} at ${newTabBay}` });
  };

  const tabTotal = (tab: OpenTab) => tab.items.reduce((s, i) => s + i.menuItem.price * i.qty, 0);

  const closeTab = (id: number) => {
    const tab = tabs.find((t) => t.id === id);
    if (!tab) return;
    setTabs(tabs.filter((t) => t.id !== id));
    setCheckoutId(null);
    toast({ title: `Tab closed — $${tabTotal(tab).toFixed(2)} charged to ${tab.customer}` });
  };

  const elapsed = (iso: string) => {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  const categories = CATEGORIES.filter((c) => menu.some((m) => m.category === c));
  const checkoutTab = tabs.find((t) => t.id === checkoutId);

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Point of Sale</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Menu management and bay-side ordering</p>
        </div>
      </div>

      <Tabs defaultValue="menu">
        <TabsList>
          <TabsTrigger value="menu"><Monitor className="h-3.5 w-3.5 mr-1.5" />Menu</TabsTrigger>
          <TabsTrigger value="tabs"><ShoppingCart className="h-3.5 w-3.5 mr-1.5" />Open Tabs ({tabs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="mt-4 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{menu.filter((m) => m.available).length} of {menu.length} items available</p>
            <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1.5" />Add Item</Button>
          </div>

          {categories.map((cat) => (
            <div key={cat}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{cat}</h3>
              <div className="border rounded-md bg-card divide-y">
                {menu.filter((m) => m.category === cat).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                    <Switch checked={item.available} onCheckedChange={() => toggleAvailable(item.id)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${!item.available ? "line-through text-muted-foreground" : ""}`}>{item.name}</span>
                        {!item.available && <Badge variant="secondary" className="text-[10px]">Unavailable</Badge>}
                      </div>
                      {item.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>}
                    </div>
                    <div className="font-bold text-sm">${item.price.toFixed(2)}</div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}><Edit2 className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="tabs" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{tabs.length} open {tabs.length === 1 ? "tab" : "tabs"}</p>
            <Button size="sm" onClick={openNewTab}><Plus className="h-4 w-4 mr-1.5" />Open Tab</Button>
          </div>

          {tabs.length === 0 && (
            <div className="border border-dashed rounded-xl p-12 text-center">
              <Receipt className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">No open tabs</h3>
              <p className="text-muted-foreground text-sm mb-4">Open a tab when a customer starts a session.</p>
              <Button size="sm" onClick={openNewTab}><Plus className="h-4 w-4 mr-1.5" />Open Tab</Button>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tabs.map((tab) => (
              <div key={tab.id} className="border rounded-xl bg-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">{tab.customer}</div>
                    <div className="text-xs text-muted-foreground">{tab.bay} · {elapsed(tab.openedAt)} open</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">{tab.items.reduce((s, i) => s + i.qty, 0)} items</Badge>
                </div>
                <div className="space-y-1">
                  {tab.items.length === 0 && <p className="text-xs text-muted-foreground italic">No items yet</p>}
                  {tab.items.map((oi, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span>{oi.qty}× {oi.menuItem.name}</span>
                      <span className="font-medium">${(oi.menuItem.price * oi.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm font-bold">${tabTotal(tab).toFixed(2)}</span>
                  <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => setCheckoutId(tab.id)}>
                    <Receipt className="h-3 w-3 mr-1" />Close Tab
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Item" : "Add Menu Item"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Name <span className="text-destructive">*</span></Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Item name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Price ($) <span className="text-destructive">*</span></Label>
                <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional short description" />
            </div>
            <div className="flex items-center gap-3">
              <Switch id="avail" checked={form.available} onCheckedChange={(v) => setForm({ ...form, available: v })} />
              <Label htmlFor="avail">Available for ordering</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name.trim() || !form.price}>{editing ? "Save Changes" : "Add Item"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Remove menu item?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This item will be removed from the menu immediately.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId !== null && handleDelete(deleteId)}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={newTabOpen} onOpenChange={setNewTabOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Open Tab</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Bay</Label>
              <Select value={newTabBay} onValueChange={setNewTabBay}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {bays.map((b) => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Customer Name <span className="text-destructive">*</span></Label>
              <Input value={newTabCustomer} onChange={(e) => setNewTabCustomer(e.target.value)} placeholder="Customer name" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTabOpen(false)}>Cancel</Button>
            <Button onClick={createTab} disabled={!newTabCustomer.trim()}>Open Tab</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={checkoutId !== null} onOpenChange={() => setCheckoutId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Close Tab — {checkoutTab?.customer}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">{checkoutTab?.bay} · {checkoutTab ? elapsed(checkoutTab.openedAt) : ""} session</p>
            <div className="border rounded-md divide-y">
              {checkoutTab?.items.length === 0 && <p className="text-sm text-muted-foreground p-4 text-center italic">No items on tab</p>}
              {checkoutTab?.items.map((oi, idx) => (
                <div key={idx} className="flex justify-between text-sm px-4 py-2.5">
                  <span>{oi.qty}× {oi.menuItem.name}</span>
                  <span className="font-medium">${(oi.menuItem.price * oi.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-base pt-1">
              <span>Total</span>
              <span>${checkoutTab ? tabTotal(checkoutTab).toFixed(2) : "0.00"}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutId(null)}>Cancel</Button>
            <Button onClick={() => checkoutId !== null && closeTab(checkoutId)}>Charge & Close Tab</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
