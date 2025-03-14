import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import AuthMiddleware from "../middleware/auth.middlware.js";
const AuthRouter = Router();
AuthRouter.post("/create", UserController.signUp);
AuthRouter.get("/fetch-urls", AuthMiddleware, UserController.fetchUserUrl);
AuthRouter.post("/login", UserController.login);
AuthRouter.get("/logout", UserController.logout);
AuthRouter.get("/verify", AuthMiddleware, UserController.verifyUser);
AuthRouter.put("/update", AuthMiddleware, UserController.updateUser);

export default AuthRouter;
