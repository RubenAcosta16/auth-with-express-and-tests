import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../config";
import { User } from "../../../User/domain/User";
import { AuthInvalidCredentialsError } from "../../../Auth/domain/errors";

declare module "express" {
  interface Request {
    user?: Omit<
      User,
      "password" | "mapToPrimitives" | "mapToPrimitivesNoPassword"
    >;
  }
}

const verifyToken = (token: string): JwtPayload => {
  try {
    if (!SECRET_JWT_KEY) {
      throw new AuthInvalidCredentialsError("Secret JWT key is not defined");
    }
    return jwt.verify(token, SECRET_JWT_KEY) as JwtPayload;
  } catch {
    throw new AuthInvalidCredentialsError("Invalid token");
  }
};

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

