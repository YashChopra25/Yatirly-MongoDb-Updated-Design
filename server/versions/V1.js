import { Router } from "express";
import AuthRouter from "../routes/auth.routes.js";
import UrlsRouter from "../routes/urls.router.js";
import AnalyticRouter from "../routes/analytics.router.js";
import AuthMiddleware from "../middleware/auth.middlware.js";
const V1Router = Router();
V1Router.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "API is running",
  });
});
V1Router.use("/auth/user", AuthRouter);
V1Router.use("/urls", UrlsRouter);
V1Router.use("/analytics", AuthMiddleware, AnalyticRouter);
export default V1Router;
