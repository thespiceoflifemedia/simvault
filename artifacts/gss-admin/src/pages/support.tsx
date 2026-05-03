import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, BookOpen, ExternalLink, CheckCircle2 } from "lucide-react";

const faqs = [
  {
    q: "How do I add a new bay to my account?",
    a: "Go to the Bays page in the admin panel and click \"Add Bay\". Fill in the name, simulator type, and optional description, then click Save.",
  },
  {
    q: "Can I bulk-import customers?",
    a: "CSV import is on the roadmap. For now, customers can be added individually via the Customers page or will be created automatically when they book online.",
  },
  {
    q: "How do I upgrade my plan?",
    a: "Contact us at hello@simvault.io with your facility name and the plan you'd like. We'll handle the upgrade and any pro-rated billing.",
  },
  {
    q: "What payment gateways are supported?",
    a: "We support Stripe and Square. Connect your account via the Integrations page or contact support to have it configured during onboarding.",
  },
  {
    q: "Can customers book online?",
    a: "Yes — the public-facing booking page is available at your facility's SimVault subdomain. Contact us to enable and customise the online booking flow.",
  },
  {
    q: "How do I cancel a booking?",
    a: "Open the Bookings page, find the booking in the list view, and click the edit button. Change the status to Cancelled and save.",
  },
];

export default function Support() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", category: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setSent(true);
    toast({ title: "Message sent", description: "We'll get back to you within 1 business day." });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b pb-6">
        <h1 className="text-2xl font-bold tracking-tight">Support</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Get help from the SimVault team or browse answers below</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-5 flex flex-col items-center text-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-sm">Email Support</div>
              <div className="text-xs text-muted-foreground mt-1">hello@simvault.io</div>
              <div className="text-xs text-muted-foreground">Response within 1 business day</div>
            </div>
            <a href="mailto:hello@simvault.io">
              <Button variant="outline" size="sm" className="text-xs">Send Email</Button>
            </a>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex flex-col items-center text-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-sm">Documentation</div>
              <div className="text-xs text-muted-foreground mt-1">Setup guides and how-tos</div>
              <div className="text-xs text-muted-foreground">Available at docs.simvault.io</div>
            </div>
            <Button variant="outline" size="sm" className="text-xs gap-1" disabled>
              View Docs <ExternalLink className="h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex flex-col items-center text-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-sm">Live Chat</div>
              <div className="text-xs text-muted-foreground mt-1">Mon – Fri, 9am – 5pm EST</div>
              <div className="text-xs text-muted-foreground">Coming soon</div>
            </div>
            <Button variant="outline" size="sm" className="text-xs" disabled>Start Chat</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="font-medium text-sm mb-1.5">{faq.q}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Send a Message</h2>
          {sent ? (
            <div className="border border-dashed rounded-xl p-10 text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
              <h3 className="font-semibold">Message received!</h3>
              <p className="text-sm text-muted-foreground">We'll respond to your email within 1 business day.</p>
              <Button variant="outline" size="sm" onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "", category: "" }); }}>
                Send another
              </Button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Your Name</Label>
                  <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="billing">Billing & Plans</SelectItem>
                    <SelectItem value="booking">Booking Issues</SelectItem>
                    <SelectItem value="tech">Technical Problem</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Brief description" />
              </div>
              <div className="space-y-1.5">
                <Label>Message</Label>
                <Textarea
                  required
                  className="min-h-[140px] resize-y"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your issue or question in detail…"
                />
              </div>
              <Button type="submit" disabled={sending} className="w-full">
                {sending ? "Sending…" : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
