import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import dashboardRouter from "./dashboard";
import baysRouter from "./bays";
import customersRouter from "./customers";
import bookingsRouter from "./bookings";
import membershipsRouter from "./memberships";
import tenantRouter from "./tenant";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(dashboardRouter);
router.use(baysRouter);
router.use(customersRouter);
router.use(bookingsRouter);
router.use(membershipsRouter);
router.use(tenantRouter);

export default router;
