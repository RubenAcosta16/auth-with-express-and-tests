import { Request, Response, NextFunction } from "express";
import { AuthInvalidCredentialsError } from "../../../domain/errors";
import { verifyToken } from "./utils";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.access_token;

  try {
    if (!token) {
      throw new AuthInvalidCredentialsError("Access denied: No token provided");
    }

    const decoded = verifyToken(token);
    const { id, name, email, role } = decoded;

    req.user = { id, name, email, role };

    next();
  } catch (error) {
    next(error);
  }
};
