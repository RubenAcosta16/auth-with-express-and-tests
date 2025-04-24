import { NextFunction, Request, Response } from "express";
// import { ServiceContainer } from "../../Shared/infrastructure/ServiceContainer";
// import { UserNotFoundError } from "../domain/UserNotFoundError";
import { ServiceContainer } from "../../../shared/ServiceContainer";
import { UserNotFoundError } from "../../domain/errors";
// import { roles } from "../../UserTypes";

export class ExpressUserController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await ServiceContainer.user.getAll.run();

      res.json(users.map((user) => user.mapToPrimitives())).status(200);
    } catch (error) {
      next(error);
    }
  }

  async getOneById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await ServiceContainer.user.getOneById.run(req.params.id);

      res.json(user.mapToPrimitives()).status(200);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ message: error.message });
      }

      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, id, name, role, password } = req.body as {
        id: string;
        name: string;
        email: string;
        role: string;
        password: string;
      };
      await ServiceContainer.user.create.run(id, name, email, password, role);

      res.status(201).send();
    } catch (error) {
      next(error);
    }
  }

  async edit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, id, name, role, password } = req.body as {
        id: string;
        name: string;
        email: string;
        role: string;
        password: string;
      };
      await ServiceContainer.user.edit.run(id, name, email, password, role);

      res.status(204).send();
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ message: error.message });
      }

      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ServiceContainer.user.delete.run(req.params.id);

      res.status(204).send();
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ message: error.message });
      }

      next(error);
    }
  }
}
