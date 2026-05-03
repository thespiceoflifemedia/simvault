import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import dashboardRouter from "./dashboard";
import baysRouter from "./bays";
import customersRouter from "./customers";
import bookingsRouter from "./bookings";
import membershipsRouter from "./memberships";
import tenantRouter from "./tenant";
import posOrdersRouter from "./pos-orders";
import passesRouter from "./passes";
import discountCodesRouter from "./discount-codes";
import schedulesRouter from "./schedules";
import loyaltyPointsRouter from "./loyalty-points";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(dashboardRouter);
router.use(baysRouter);
router.use(customersRouter);
router.use(bookingsRouter);
router.use(membershipsRouter);
router.use(tenantRouter);
router.use(posOrdersRouter);
router.use(passesRouter);
router.use(discountCodesRouter);
router.use(schedulesRouter);
router.use(loyaltyPointsRouter);

export default router;
