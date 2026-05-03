import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Save, FileText, ShieldCheck, Lock } from "lucide-react";

const DEFAULT_TERMS = `TERMS AND CONDITIONS

Last updated: January 1, 2025

By booking a bay at our facility, you agree to the following terms and conditions.

1. RESERVATIONS
All reservations must be made in advance. Walk-ins are accepted subject to availability. Reservations are confirmed upon receipt of payment.

2. CANCELLATIONS
Cancellations made more than 24 hours before the session start time will receive a full refund or credit. Cancellations within 24 hours will forfeit the session fee.

3. CONDUCT
All guests are expected to behave in a respectful and safe manner. Management reserves the right to remove any guest for inappropriate conduct without refund.

4. EQUIPMENT
Guests are responsible for any damage caused to facility equipment or property during their session.

5. LIABILITY
Use of our facility is at your own risk. We are not responsible for personal injury or loss of personal property.`;

const DEFAULT_WAIVER = `WAIVER AND RELEASE OF LIABILITY

Please read this document carefully before participating in any activity at our facility.

ASSUMPTION OF RISK
I understand that participation in sports simulation activities involves inherent risks, including but not limited to: physical injury from swinging implements, tripping, or falling.

RELEASE OF LIABILITY
In consideration of being permitted to use the facility, I hereby release, waive, discharge, and covenant not to sue the facility, its owners, employees, and agents from any and all liability, claims, demands, or causes of action arising from my participation.

INDEMNIFICATION
I agree to indemnify and hold harmless the facility and its representatives from any claims, including attorney's fees, arising from my actions or negligence while using the facility.

MEDICAL AUTHORIZATION
In the event of an emergency, I authorize facility staff to seek medical assistance on my behalf.

By proceeding with your booking, you acknowledge that you have read, understood, and agree to these terms.`;

const DEFAULT_PRIVACY = `PRIVACY POLICY

Last updated: January 1, 2025

We respect your privacy and are committed to protecting your personal information.

INFORMATION WE COLLECT
We collect information you provide directly to us, including your name, email address, phone number, and payment information when you book a session or create an account.

HOW WE USE YOUR INFORMATION
We use the information we collect to process bookings, send confirmation and reminder emails, communicate with you about your sessions, and improve our services.

DATA SHARING
We do not sell or rent your personal information to third parties. We may share your information with payment processors and email service providers solely to facilitate our services.

DATA RETENTION
We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your data at any time by contacting us.

COOKIES
Our booking platform uses cookies to maintain your session and preferences. You may disable cookies in your browser settings, though this may affect functionality.

CONTACT
For privacy-related questions, please email hello@simvault.io.`;

export default function Legal() {
  const { toast } = useToast();
  const [terms, setTerms] = useState(DEFAULT_TERMS);
  const [waiver, setWaiver] = useState(DEFAULT_WAIVER);
  const [privacy, setPrivacy] = useState(DEFAULT_PRIVACY);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast({ title: "Legal documents saved", description: "Your documents have been updated successfully." });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Legal Documents</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your terms, waiver, and privacy policy shown to customers during booking
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="terms">
        <TabsList className="mb-4">
          <TabsTrigger value="terms" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Terms & Conditions
          </TabsTrigger>
          <TabsTrigger value="waiver" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Liability Waiver
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Privacy Policy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terms" className="space-y-3">
          <div className="rounded-lg border bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/50 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
            This document is displayed to customers when they complete a booking. Keep it accurate and up to date.
          </div>
          <div className="space-y-1.5">
            <Label>Terms &amp; Conditions</Label>
            <Textarea
              className="min-h-[420px] font-mono text-sm leading-relaxed resize-y"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            />
          </div>
        </TabsContent>

        <TabsContent value="waiver" className="space-y-3">
          <div className="rounded-lg border bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/50 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
            Customers must acknowledge this waiver before their first session. Consult a legal professional before modifying.
          </div>
          <div className="space-y-1.5">
            <Label>Liability Waiver</Label>
            <Textarea
              className="min-h-[420px] font-mono text-sm leading-relaxed resize-y"
              value={waiver}
              onChange={(e) => setWaiver(e.target.value)}
            />
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-3">
          <div className="rounded-lg border bg-blue-50/40 dark:bg-blue-950/20 border-blue-200/50 px-4 py-3 text-sm text-blue-700 dark:text-blue-400">
            Your privacy policy explains how you collect and use customer data. Required in most jurisdictions.
          </div>
          <div className="space-y-1.5">
            <Label>Privacy Policy</Label>
            <Textarea
              className="min-h-[420px] font-mono text-sm leading-relaxed resize-y"
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
