import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { notificationTemplatesTable, insertNotificationTemplateSchema } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

const DEFAULT_TEMPLATES = [
  { type: "BookingConfirmation", label: "Booking Confirmation", description: "Sent when a booking is confirmed", subject: "Your booking is confirmed!", body: "Hi {customerName},\n\nYour booking at {courseName} has been confirmed.\n\nDate: {startDate}\nTime: {startTime} – {endTime}\nBay: {bayName}\n\nSee you soon!", activeEmail: true, activeSms: false },
  { type: "BookingReminder", label: "Booking Reminder", description: "Sent 24 hours before a session", subject: "Reminder: You have a session tomorrow", body: "Hi {customerName},\n\nJust a reminder that you have a session scheduled tomorrow.\n\nDate: {startDate}\nTime: {startTime} – {endTime}\nBay: {bayName}\n\nSee you then!", activeEmail: true, activeSms: true },
  { type: "BookingCancel", label: "Booking Cancellation", description: "Sent when a booking is cancelled", subject: "Your booking has been cancelled", body: "Hi {customerName},\n\nYour booking on {startDate} at {startTime} has been cancelled.\n\nBooking details: {bookingDetails}", activeEmail: true, activeSms: false },
  { type: "BookingEnding", label: "Session Ending Soon", description: "Sent 15 minutes before session ends", subject: "Your session is ending soon", body: "Hi {customerName},\n\nYour session ends in 15 minutes.\n\nThank you for visiting {courseName}! Use this link to extend: {extendLink}", activeEmail: false, activeSms: true },
  { type: "BookingReport", label: "Daily Booking Report", description: "Daily summary sent to the facility owner", subject: "Daily Booking Report — {startDate}", body: "Here is your daily summary for {startDate}.\n\nView full report in your dashboard.", activeEmail: false, activeSms: false },
  { type: "BookingMultipleConfirmation", label: "Group Booking Confirmation", description: "Sent when multiple bays are booked", subject: "Group booking confirmed!", body: "Hi {customerName},\n\nYour group booking has been confirmed for {startDate} at {startTime}.\n\nBooking link: {bookingLink}", activeEmail: true, activeSms: false },
  { type: "MembershipActive", label: "Membership Activated", description: "Sent when a membership is activated", subject: "Welcome to {membershipName} membership!", body: "Hi {customerName},\n\nYour {membershipName} membership is now active.\n\nPrice: {membershipPrice}\n{membershipDescription}\n\nLog in: {loginLink}", activeEmail: true, activeSms: false },
  { type: "MembershipRenewal", label: "Membership Renewal", description: "Sent when a membership is renewed", subject: "Your membership has been renewed", body: "Hi {customerName},\n\nYour {membershipName} membership has been renewed for {membershipPrice}.\n\nLog in to view your account: {loginLink}", activeEmail: true, activeSms: false },
  { type: "MembershipCancellation", label: "Membership Cancellation", description: "Sent when a membership is cancelled", subject: "Your membership has been cancelled", body: "Hi {customerName},\n\nYour {membershipName} membership has been cancelled.\n\nIf you have questions, please contact us.", activeEmail: true, activeSms: false },
  { type: "RefundConfirmation", label: "Refund Confirmation", description: "Sent when a refund is issued", subject: "Your refund has been processed", body: "Hi {customerName},\n\nA refund has been issued for your booking on {startDate}.\n\nBooking details: {bookingDetails}", activeEmail: true, activeSms: false },
];

router.get("/notification-templates", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  let templates = await db.select().from(notificationTemplatesTable).where(eq(notificationTemplatesTable.tenantId, tenantId));

  if (templates.length === 0) {
    const inserted = await db.insert(notificationTemplatesTable).values(
      DEFAULT_TEMPLATES.map((t) => ({ ...t, tenantId }))
    ).returning();
    templates = inserted;
  }

  res.json(templates);
});

router.put("/notification-templates/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  const [tpl] = await db.update(notificationTemplatesTable)
    .set({ ...req.body, updatedAt: new Date() })
    .where(and(eq(notificationTemplatesTable.id, id), eq(notificationTemplatesTable.tenantId, tenantId)))
    .returning();
  if (!tpl) { res.status(404).json({ error: "Not found" }); return; }
  res.json(tpl);
});

export default router;
