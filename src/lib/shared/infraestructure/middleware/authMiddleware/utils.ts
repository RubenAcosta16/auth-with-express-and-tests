// import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserId } from "../../../../User/domain/Props/UserId";
import { UserName } from "../../../../User/domain/Props/UserName";
import { UserEmail } from "../../../../User/domain/Props/UserEmail";
import { UserRole } from "../../../../User/domain/Props/UserRole";
import { SECRET_JWT_KEY } from "../../config";
import { AuthInvalidCredentialsError } from "../../../../Auth/domain/errors";
import { User } from "../../../../User/domain/User";

type OmitUser = Omit<
  User,
  "password" | "mapToPrimitives" | "mapToPrimitivesNoPassword"
>;

declare module "express" {
  interface Request {
    user?: OmitUser
    ;
  }
}

// Function to create an empty user
export const createEmptyUser = (): OmitUser => ({
  id: new UserId("---"),
  name: new UserName("---"),
  email: new UserEmail("---@c.c"),
  role: new UserRole("User"),
});

// Function to verify a token
export const verifyToken = (token: string): JwtPayload => {
  if (!SECRET_JWT_KEY) {
    throw new AuthInvalidCredentialsError("Secret JWT key is not defined");
  }
  try {
    return jwt.verify(token, SECRET_JWT_KEY) as JwtPayload;
  } catch {
    throw new AuthInvalidCredentialsError("Invalid token");
  }
};
