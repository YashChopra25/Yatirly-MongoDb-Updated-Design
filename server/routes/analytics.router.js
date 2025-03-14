import { Router } from "express";
const AnalyticRouter = Router();
import AnalyticsController from "../controllers/analytics.controller.js";

AnalyticRouter.get("/fetch", AnalyticsController.fetchAnalytics);
export default AnalyticRouter;
