import { Request, Response, NextFunction } from "express";
import { createEmptyUser, verifyToken } from "./utils";
import { UserId } from "../../../../User/domain/Props/UserId";
import { UserName } from "../../../../User/domain/Props/UserName";
import { UserEmail } from "../../../../User/domain/Props/UserEmail";
import { UserRole } from "../../../../User/domain/Props/UserRole";

export const roleAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.access_token;

  try {
    if (!token) {
      req.user = createEmptyUser();
      return next();
    }

    const decoded = verifyToken(token);
    const { id, name, email, role } = decoded;

    req.user = {
      id: new UserId(id),
      name: new UserName(name),
      email: new UserEmail(email),
      role: new UserRole(role),
    };

    next();
  } catch (error) {
    next(error);
  }
};
