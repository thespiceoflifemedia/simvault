import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { legalDocumentsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

const DEFAULT_DOCS = [
  {
    type: "terms",
    title: "Terms & Conditions",
    active: true,
    requireAcceptance: true,
    content: `TERMS AND CONDITIONS\n\nLast updated: January 1, 2025\n\nBy booking a bay at our facility, you agree to the following terms and conditions.\n\n1. RESERVATIONS\nAll reservations must be made in advance. Walk-ins are accepted subject to availability. Reservations are confirmed upon receipt of payment.\n\n2. CANCELLATIONS\nCancellations made more than 24 hours before the session start time will receive a full refund or credit. Cancellations within 24 hours will forfeit the session fee.\n\n3. CONDUCT\nAll guests are expected to behave in a respectful and safe manner. Management reserves the right to remove any guest for inappropriate conduct without refund.\n\n4. EQUIPMENT\nGuests are responsible for any damage caused to facility equipment or property during their session.\n\n5. LIABILITY\nUse of our facility is at your own risk. We are not responsible for personal injury or loss of personal property.`,
  },
  {
    type: "waiver",
    title: "Liability Waiver",
    active: true,
    requireAcceptance: true,
    content: `WAIVER AND RELEASE OF LIABILITY\n\nPlease read this document carefully before participating in any activity at our facility.\n\nASSUMPTION OF RISK\nI understand that participation in sports simulation activities involves inherent risks, including but not limited to: physical injury from swinging implements, tripping, or falling.\n\nRELEASE OF LIABILITY\nIn consideration of being permitted to use the facility, I hereby release, waive, discharge, and covenant not to sue the facility, its owners, employees, and agents from any and all liability, claims, demands, or causes of action arising from my participation.\n\nINDEMNIFICATION\nI agree to indemnify and hold harmless the facility and its representatives from any claims, including attorney's fees, arising from my actions or negligence while using the facility.\n\nMEDICAL AUTHORIZATION\nIn the event of an emergency, I authorize facility staff to seek medical assistance on my behalf.\n\nBy proceeding with your booking, you acknowledge that you have read, understood, and agree to these terms.`,
  },
  {
    type: "privacy",
    title: "Privacy Policy",
    active: true,
    requireAcceptance: false,
    content: `PRIVACY POLICY\n\nLast updated: January 1, 2025\n\nWe respect your privacy and are committed to protecting your personal information.\n\nINFORMATION WE COLLECT\nWe collect information you provide directly to us, including your name, email address, phone number, and payment information when you book a session or create an account.\n\nHOW WE USE YOUR INFORMATION\nWe use the information we collect to process bookings, send confirmation and reminder emails, communicate with you about your sessions, and improve our services.\n\nDATA SHARING\nWe do not sell or rent your personal information to third parties.\n\nDATA RETENTION\nWe retain your information for as long as your account is active or as needed to provide services.\n\nCONTACT\nFor privacy-related questions, please contact us through your account dashboard.`,
  },
  {
    type: "booking-disclaimer",
    title: "Booking Disclaimer",
    active: true,
    requireAcceptance: true,
    content: `BOOKING DISCLAIMER\n\nBy completing this booking, you confirm that:\n\n• You have read and agree to our Terms & Conditions\n• You have read and agree to our Liability Waiver\n• You understand our cancellation policy\n• All members of your group will comply with facility rules\n• Payment is required to confirm your booking`,
  },
];

router.get("/legal-documents", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  let docs = await db.select().from(legalDocumentsTable).where(eq(legalDocumentsTable.tenantId, tenantId));

  if (docs.length === 0) {
    const inserted = await db.insert(legalDocumentsTable).values(
      DEFAULT_DOCS.map((d) => ({ ...d, tenantId }))
    ).returning();
    docs = inserted;
  }

  res.json(docs);
});

router.put("/legal-documents/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  const [doc] = await db.update(legalDocumentsTable)
    .set({ ...req.body, updatedAt: new Date() })
    .where(and(eq(legalDocumentsTable.id, id), eq(legalDocumentsTable.tenantId, tenantId)))
    .returning();
  if (!doc) { res.status(404).json({ error: "Not found" }); return; }
  res.json(doc);
});

export default router;
