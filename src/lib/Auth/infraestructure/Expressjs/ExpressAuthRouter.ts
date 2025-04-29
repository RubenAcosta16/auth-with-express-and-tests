import { Router } from "express";

import { ExpressAuthController } from "./ExpressAuthController";

import { authAdminMiddleware } from "../../../shared/infraestructure/middleware/authAdminMiddleware";
import { roleAuthMiddleware } from "../../../shared/infraestructure/middleware/authMiddleware/roleAuthMiddleware";
import { authMiddleware } from "../../../shared/infraestructure/middleware/authMiddleware/authMiddleware";

const controller = new ExpressAuthController();
const ExpressAuthRouter = Router();

ExpressAuthRouter.post("/register", roleAuthMiddleware, controller.register);
// ExpressAuthRouter.post(
//   "/registeradmin",
//   authMiddleware,
//   authAdminMiddleware,
//   controller.registerAdmin
// );
ExpressAuthRouter.post("/login", controller.login);
ExpressAuthRouter.get("/protected", authMiddleware, controller.protectedRoute);
ExpressAuthRouter.get(
  "/admin",
  authMiddleware,
  authAdminMiddleware,
  controller.adminRoute
);
ExpressAuthRouter.post("/logout", controller.logout);

export { ExpressAuthRouter };
