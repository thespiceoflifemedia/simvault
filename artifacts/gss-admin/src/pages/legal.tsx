import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Save, FileText, ShieldCheck, Lock, BookOpen, Loader2 } from "lucide-react";

interface LegalDoc {
  id: number;
  type: string;
  title: string;
  content: string;
  active: boolean;
  requireAcceptance: boolean;
  updatedAt: string;
}

const DOC_ICONS: Record<string, React.ReactNode> = {
  terms: <FileText className="h-4 w-4" />,
  waiver: <ShieldCheck className="h-4 w-4" />,
  privacy: <Lock className="h-4 w-4" />,
  "booking-disclaimer": <BookOpen className="h-4 w-4" />,
};

const DOC_WARNINGS: Record<string, { variant: string; msg: string }> = {
  terms: { variant: "amber", msg: "Displayed to customers during booking. Keep it accurate and up to date." },
  waiver: { variant: "amber", msg: "Customers must acknowledge this before their first session. Consult a legal professional before modifying." },
  privacy: { variant: "blue", msg: "Explains how you collect and use customer data. Required in most jurisdictions." },
  "booking-disclaimer": { variant: "amber", msg: "Shown to customers at checkout as a final confirmation of their agreement." },
};

export default function Legal() {
  const { toast } = useToast();
  const [docs, setDocs] = useState<LegalDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [selected, setSelected] = useState<string>("terms");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/legal-documents", { credentials: "include" });
    if (res.ok) setDocs(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const update = (id: number, changes: Partial<LegalDoc>) => {
    setDocs((prev) => prev.map((d) => d.id === id ? { ...d, ...changes } : d));
  };

  const handleSave = async (doc: LegalDoc) => {
    setSaving(doc.id);
    const res = await fetch(`/api/legal-documents/${doc.id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: doc.content, active: doc.active, requireAcceptance: doc.requireAcceptance }),
    });
    setSaving(null);
    if (res.ok) {
      toast({ title: `${doc.title} saved`, description: "Document updated successfully." });
    } else {
      toast({ title: "Error saving", variant: "destructive" });
    }
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  const activeDoc = docs.find((d) => d.type === selected);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Legal Documents</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your legal content shown to customers during booking and sign-up
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Doc list sidebar */}
        <div className="space-y-2">
          {docs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelected(doc.type)}
              className={`w-full text-left px-3 py-3 rounded-lg border transition-colors ${selected === doc.type ? "bg-primary/5 border-primary/30" : "bg-card border-border hover:bg-muted/40"}`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-primary">{DOC_ICONS[doc.type] ?? <FileText className="h-4 w-4" />}</span>
                  <span className="text-sm font-medium">{doc.title}</span>
                </div>
                <Badge variant="outline" className={`text-[10px] px-1.5 ${doc.active ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                  {doc.active ? "Live" : "Off"}
                </Badge>
              </div>
              <div className="text-[10px] text-muted-foreground ml-6">Updated {fmt(doc.updatedAt)}</div>
            </button>
          ))}
        </div>

        {/* Editor */}
        {activeDoc ? (
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-primary">{DOC_ICONS[activeDoc.type] ?? <FileText className="h-5 w-5" />}</span>
                <h2 className="text-lg font-semibold">{activeDoc.title}</h2>
              </div>
              <Button onClick={() => handleSave(activeDoc)} disabled={saving === activeDoc.id}>
                <Save className="h-4 w-4 mr-2" />
                {saving === activeDoc.id ? "Saving…" : "Save Changes"}
              </Button>
            </div>

            {DOC_WARNINGS[activeDoc.type] && (
              <div className={`rounded-lg border px-4 py-3 text-sm ${DOC_WARNINGS[activeDoc.type].variant === "blue" ? "bg-blue-50/40 border-blue-200/50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400" : "bg-amber-50/40 border-amber-200/50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"}`}>
                {DOC_WARNINGS[activeDoc.type].msg}
              </div>
            )}

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <Switch id="doc-active" checked={activeDoc.active} onCheckedChange={(v) => update(activeDoc.id, { active: v })} />
                <Label htmlFor="doc-active">Published (visible to customers)</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="doc-accept" checked={activeDoc.requireAcceptance} onCheckedChange={(v) => update(activeDoc.id, { requireAcceptance: v })} />
                <Label htmlFor="doc-accept">Require acceptance at checkout</Label>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>{activeDoc.title}</Label>
              <Textarea
                className="min-h-[450px] font-mono text-sm leading-relaxed resize-y"
                value={activeDoc.content}
                onChange={(e) => update(activeDoc.id, { content: e.target.value })}
              />
            </div>
          </div>
        ) : (
          <div className="lg:col-span-3 flex items-center justify-center h-64 text-muted-foreground text-sm">
            Select a document to edit
          </div>
        )}
      </div>
    </div>
  );
}
