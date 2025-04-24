import { Request, Response, NextFunction } from "express";
import { AuthInvalidCredentialsError } from "../../../Auth/domain/errors";
import { roles } from "../../../User/UserTypes";
import { UserRole } from "../../../User/domain/Props/UserRole";

export const authAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AuthInvalidCredentialsError("User not authenticated");
    }

    if (req.user.role !== (roles.Admin as unknown as UserRole)) {
      throw new AuthInvalidCredentialsError(
        "Access denied: Only admin can access this route"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
