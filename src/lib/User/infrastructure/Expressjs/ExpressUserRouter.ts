import { Router } from "express";

import { ExpressUserController } from "./ExpressUserController";

const controller = new ExpressUserController();
const ExpressUserRouter = Router();

ExpressUserRouter.get("/", controller.getAll);
ExpressUserRouter.get("/:id", controller.getOneById);
ExpressUserRouter.post("/", controller.create);
ExpressUserRouter.put("/", controller.edit);
ExpressUserRouter.delete("/:id", controller.delete);

export { ExpressUserRouter };
